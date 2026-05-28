import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollProgress } from '../useScrollProgress';
import { useScrollVelocity } from '../useScrollProgress';

/* ------------------------------------------------------------------ */
/*  Animated Voronoi caustic light patterns                           */
/*  - 4 layered transparent planes at different Z depths              */
/*  - Scroll-reactive: fades with depth, distorts with velocity       */
/*  - AdditiveBlending, very subtle (#8FBFA3, opacity 0.04–0.08)     */
/* ------------------------------------------------------------------ */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform float uProgress;
  uniform float uVelocity;
  uniform float uDepthFade;   // per-plane fade multiplier (0..1)

  /* ---- Voronoi helpers ---- */

  // Hash without sine — stable across GPUs
  vec2 hash22(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx + p3.yz) * p3.zy);
  }

  // Voronoi distance-to-nearest-point
  float voronoi(vec2 uv, float time) {
    vec2 n = floor(uv);
    vec2 f = fract(uv);

    float md = 8.0;

    for (int j = -1; j <= 1; j++) {
      for (int i = -1; i <= 1; i++) {
        vec2 g = vec2(float(i), float(j));
        vec2 o = hash22(n + g);

        // Animate the feature points — slow organic drift
        o = 0.5 + 0.5 * sin(time * 0.6 + 6.2831 * o);

        vec2 r = g + o - f;
        float d = dot(r, r);
        md = min(md, d);
      }
    }

    return sqrt(md);
  }

  void main() {
    // ---- Velocity-based UV distortion ----
    float vel = clamp(uVelocity, -1.0, 1.0);
    vec2 uv = vUv;
    uv.y += vel * 0.012 * sin(uv.x * 12.0 + uTime * 2.0);
    uv.x += vel * 0.008 * cos(uv.y * 10.0 + uTime * 1.5);

    // ---- Two layered Voronoi at different scales / speeds ----
    float scale1 = 8.0;
    float scale2 = 5.0;

    float v1 = voronoi(uv * scale1, uTime * 0.35);
    float v2 = voronoi(uv * scale2 + vec2(7.3, 3.1), uTime * 0.25 + 50.0);

    // Invert and sharpen to get the bright "net of light" pattern
    float c1 = 1.0 - smoothstep(0.0, 0.22, v1);
    float c2 = 1.0 - smoothstep(0.0, 0.18, v2);

    float caustic = c1 + c2 * 0.5;
    caustic = pow(caustic, 2.2);

    // ---- Color: #8FBFA3 very desaturated ----
    // #8FBFA3 ≈ rgb(0.561, 0.749, 0.639)
    // Desaturated: push toward grey
    vec3 baseColor = vec3(0.561, 0.749, 0.639);
    vec3 desaturated = mix(vec3(dot(baseColor, vec3(0.299, 0.587, 0.114))), baseColor, 0.35);

    vec3 color = desaturated * caustic;

    // ---- Opacity: 0.04 to 0.08 range ----
    // Caustic value modulates within this range
    float baseOpacity = mix(0.04, 0.08, caustic);

    // ---- Scroll-based opacity: present near surface (progress 0..0.5), fades deeper ----
    // Near surface = low progress, mostly visible
    // Mid-depth = partially visible
    // Deep = faded out
    float scrollFade = 1.0 - smoothstep(0.3, 0.85, uProgress);

    // ---- Circular edge falloff to avoid hard plane edges ----
    float edgeDist = length(vUv - 0.5);
    float edgeFade = 1.0 - smoothstep(0.35, 0.5, edgeDist);

    // ---- Combine all fade factors ----
    float alpha = baseOpacity * edgeFade * scrollFade * uDepthFade;

    gl_FragColor = vec4(color, alpha);
  }
`;

/* ------------------------------------------------------------------ */
/*  Per-plane config                                                  */
/* ------------------------------------------------------------------ */

interface PlaneConfig {
  z: number;
  size: number;
  depthFade: number; // 0..1 — how much light reaches this depth
}

const PLANES: PlaneConfig[] = [
  { z: -50,  size: 120, depthFade: 1.0  },
  { z: -150, size: 180, depthFade: 0.7  },
  { z: -300, size: 260, depthFade: 0.4  },
  { z: -500, size: 360, depthFade: 0.15 },
];

/* ------------------------------------------------------------------ */
/*  Single caustic plane                                              */
/* ------------------------------------------------------------------ */

interface CausticPlaneProps {
  config: PlaneConfig;
  progressRef: { current: number };
  velocityRef: { current: number };
}

function CausticPlane({ config, progressRef, velocityRef }: CausticPlaneProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uVelocity: { value: 0 },
      uDepthFade: { value: config.depthFade },
    }),
    [config.depthFade],
  );

  useFrame((state) => {
    const mat = matRef.current;
    if (!mat) return;

    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uProgress.value = progressRef.current;
    mat.uniforms.uVelocity.value = velocityRef.current;
  });

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, config.z]}
    >
      <planeGeometry args={[config.size, config.size]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Caustics component                                           */
/* ------------------------------------------------------------------ */

export default function Caustics() {
  const progressRef = useScrollProgress();
  const velocityRef = useScrollVelocity();

  return (
    <>
      {PLANES.map((config, i) => (
        <CausticPlane
          key={i}
          config={config}
          progressRef={progressRef}
          velocityRef={velocityRef}
        />
      ))}
    </>
  );
}
