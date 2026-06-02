import { useMemo, useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useFBO } from '@react-three/drei';
import * as THREE from 'three';
import { FULLSCREEN_VERT, SIM_FRAG } from './fluidShaders';

const FBO_SIZE = 128; // TUNE — résolution de la grille de simulation

interface PointerState {
  x: number;
  y: number;
  dx: number;
  dy: number;
  active: number;
}

export interface FluidSim {
  /** Avance la simulation d'un pas et renvoie la texture de vélocité courante. */
  step: (delta: number) => THREE.Texture;
}

/**
 * Simulation de fluide GPU en ping-pong (deux FBO half-float). Rend hors-écran
 * dans `step()` (appelé depuis un useFrame AVANT le composer). Le pointeur est
 * suivi en global pour injecter de la vélocité (curseur = force).
 */
export function useFluidSimulation(): FluidSim {
  const gl = useThree((s) => s.gl);

  const fboSettings = useMemo(
    () => ({
      type: THREE.HalfFloatType,
      depthBuffer: false,
      stencilBuffer: false,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
    }),
    []
  );

  const fboA = useFBO(FBO_SIZE, FBO_SIZE, fboSettings);
  const fboB = useFBO(FBO_SIZE, FBO_SIZE, fboSettings);
  const targets = useRef<{ read: THREE.WebGLRenderTarget; write: THREE.WebGLRenderTarget }>({
    read: fboA,
    write: fboB,
  });

  const scene = useMemo(() => new THREE.Scene(), []);
  const camera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: FULLSCREEN_VERT,
        fragmentShader: SIM_FRAG,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uPrev: { value: null as THREE.Texture | null },
          uDt: { value: 0 },
          uDissipation: { value: 0.985 }, // TUNE — persistance du fluide
          uPointer: { value: new THREE.Vector2(0.5, 0.5) },
          uPointerVel: { value: new THREE.Vector2(0, 0) },
          uRadius: { value: 0.0008 }, // TUNE — taille du splat
          uForce: { value: 1.0 }, // TUNE — intensité du curseur
          uActive: { value: 0 },
        },
      }),
    []
  );

  // Quad plein écran ajouté une fois à la scène hors-écran.
  useMemo(() => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  }, [scene, material]);

  const pointer = useRef<PointerState>({ x: 0.5, y: 0.5, dx: 0, dy: 0, active: 0 });

  useEffect(() => {
    let lastX = 0.5;
    let lastY = 0.5;
    const onMove = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = 1 - e.clientY / window.innerHeight;
      pointer.current.dx = x - lastX;
      pointer.current.dy = y - lastY;
      pointer.current.x = x;
      pointer.current.y = y;
      pointer.current.active = 1;
      lastX = x;
      lastY = y;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const step = (delta: number): THREE.Texture => {
    const p = pointer.current;
    const u = material.uniforms;
    u.uPrev.value = targets.current.read.texture;
    u.uDt.value = delta;
    (u.uPointer.value as THREE.Vector2).set(p.x, p.y);
    (u.uPointerVel.value as THREE.Vector2).set(p.dx, p.dy);
    u.uActive.value = p.active;

    const prev = gl.getRenderTarget();
    gl.setRenderTarget(targets.current.write);
    gl.render(scene, camera);
    gl.setRenderTarget(prev);

    // Swap read/write.
    const tmp = targets.current.read;
    targets.current.read = targets.current.write;
    targets.current.write = tmp;

    // Décroissance de l'impulsion (le curseur doit « relâcher »).
    p.active *= 0.85;
    p.dx *= 0.85;
    p.dy *= 0.85;

    return targets.current.read.texture;
  };

  return { step };
}
