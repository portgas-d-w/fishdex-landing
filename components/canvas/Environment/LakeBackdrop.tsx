import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { START_Z } from '../diveConfig';

/**
 * Décor cinématographique fixe de bord de lac.
 *
 * Remplace l'ancien skybox HDRI 360° (équirectangulaire) : on ne regarde plus
 * dans toutes les directions, la caméra vise vers l'avant et ce décor sert de
 * « plan » de cinéma. C'est une portion de cylindre (vue de l'intérieur,
 * BackSide) texturée par une image lever de soleil 2:1, placée loin en −Z.
 *
 * La courbure (vs un plan plat) enveloppe l'horizon et évite l'effet « affiche ».
 *
 * Cadrage : on n'affiche que la partie HAUTE de la photo (ciel + brume + forêt
 * jusqu'à la berge) ; l'eau de la photo est coupée (UV) car c'est la surface
 * d'eau 3D qui joue ce rôle. La berge de la photo est posée au niveau de l'eau
 * 3D (y≈0) → les arbres ne « trempent » plus dans l'eau. La hauteur du cylindre
 * est calculée pour respecter le ratio de la zone visible (pas de déformation).
 *
 * `fog={false}` : le décor reste net et lumineux au-dessus de l'eau. La
 * disparition en plongée est gérée à la main via l'opacité (même critère que la
 * surface) → reproduit l'ancien fondu `scene.backgroundIntensity`.
 */

const RADIUS = 190;        // TUNE — distance du décor (rayon du cylindre)
// Arc resserré (≈ proche du FOV) : concentre les pixels de l'image source dans la
// zone visible plutôt que de les étirer sur des côtés hors-champ → image plus nette.
const ARC = THREE.MathUtils.degToRad(110); // TUNE — arc horizontal couvert (FOV + petite marge)
const SEGMENTS = 64;       // finesse de la courbure

// Dimensions de l'asset (px) et fraction de l'image, depuis le HAUT, à conserver
// (ciel + forêt jusqu'à la berge). Le reste (l'eau de la photo) est coupé.
const IMG_W = 3456;
const IMG_H = 2303;
const SKY_FRACTION = 0.52;  // TUNE — part haute affichée (la berge tombe à cette fraction depuis le haut)

// Hauteur monde calculée pour respecter le ratio de la zone visible → 0 déformation.
const ARC_WIDTH = RADIUS * ARC;
const VISIBLE_ASPECT = IMG_W / (IMG_H * SKY_FRACTION);
const HEIGHT = ARC_WIDTH / VISIBLE_ASPECT;
// Niveau de la berge du décor. PAS y=0 (niveau physique de l'eau) : en perspective,
// la surface d'eau 3D (plan fini) remonte jusqu'à son bord lointain ≈ hauteur des
// yeux. La berge lointaine doit donc se poser juste sur cet horizon visuel, sinon
// l'eau recouvre la base et les arbres « sortent » de l'eau. Calibré sur la caméra
// de départ (y≈12) et la taille du plan d'eau (cf. WaterSurface).
const BASE_Y = 7;           // TUNE — remonter si arbres encore dans l'eau, descendre si berge flotte
const CENTER_Y = BASE_Y + HEIGHT / 2;

export default function LakeBackdrop() {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);
  const texture = useTexture('/assets/generated/lake-backdrop-hd.webp');

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    // Filtrage anisotrope max : netteté préservée quand le plan est vu en angle.
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    // X : vue de l'intérieur (BackSide) → l'image apparaît miroir, on la retourne.
    // Y : on ne garde que la fraction haute (ciel+forêt) ; l'eau de la photo est
    //     coupée. wrapT en clamp pour éviter toute répétition au bord.
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(-1, SKY_FRACTION);
    texture.offset.set(1, 1 - SKY_FRACTION);
    texture.needsUpdate = true;
  }, [texture, gl]);

  useFrame(() => {
    const mat = matRef.current;
    const mesh = meshRef.current;
    if (!mat || !mesh) return;

    // Fondu en plongée : plein au-dessus de l'eau, 0 une fois immergé.
    // Reprend la formule de l'ancien scene.backgroundIntensity.
    const y = camera.position.y;
    const submerge = THREE.MathUtils.clamp((1 - y) / 4, 0, 1); // 0 au-dessus, 1 en profondeur
    mat.opacity = 1 - submerge;

    // Inutile de dessiner le décor une fois nettement immergé.
    mesh.visible = mat.opacity > 0.01;
  });

  // Arc centré sur −Z (theta = π), vu de l'intérieur.
  const thetaStart = Math.PI - ARC / 2;

  return (
    <mesh ref={meshRef} position={[0, CENTER_Y, START_Z]}>
      <cylinderGeometry
        args={[RADIUS, RADIUS, HEIGHT, SEGMENTS, 1, true, thetaStart, ARC]}
      />
      <meshBasicMaterial
        ref={matRef}
        map={texture}
        side={THREE.BackSide}
        transparent
        opacity={1}
        depthWrite={false}
        fog={false}
        toneMapped={false}
      />
    </mesh>
  );
}
