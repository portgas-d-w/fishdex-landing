import { describe, it, expect } from 'vitest';
import {
  SECTIONS,
  START_Z,
  END_Z,
  SURFACE_CROSSING_PROGRESS,
  cameraPosAt,
  cameraLookAt,
  sampleDepthGrading,
} from './diveConfig';

describe('SECTIONS', () => {
  it('a 8 arrêts (1 bord de lac + 7 sections de contenu)', () => {
    expect(SECTIONS).toHaveLength(8);
  });

  it('a des readingProgress strictement croissants dans [0,1]', () => {
    for (let i = 0; i < SECTIONS.length; i++) {
      expect(SECTIONS[i].readingProgress).toBeGreaterThanOrEqual(0);
      expect(SECTIONS[i].readingProgress).toBeLessThanOrEqual(1);
      if (i > 0) {
        expect(SECTIONS[i].readingProgress).toBeGreaterThan(SECTIONS[i - 1].readingProgress);
      }
    }
  });

  it('place chaque plan de section devant la caméra à sa position de lecture', () => {
    for (const s of SECTIONS) {
      const camZ = cameraPosAt(s.readingProgress).z;
      expect(s.sectionZ).toBeLessThan(camZ);
    }
  });
});

describe('cameraPosAt', () => {
  it('part au-dessus de l’eau et descend sous la surface', () => {
    expect(cameraPosAt(0).y).toBeGreaterThan(1);
    expect(cameraPosAt(1).y).toBeLessThan(0);
  });

  it('avance de façon monotone en Z (de START_Z vers END_Z)', () => {
    expect(cameraPosAt(0).z).toBeCloseTo(START_Z, 1);
    expect(cameraPosAt(1).z).toBeCloseTo(END_Z, 1);
    let prev = cameraPosAt(0).z;
    for (let p = 0.05; p <= 1.0001; p += 0.05) {
      const z = cameraPosAt(p).z;
      expect(z).toBeLessThan(prev + 1e-6);
      prev = z;
    }
  });

  it('traverse y=0 autour de SURFACE_CROSSING_PROGRESS', () => {
    expect(cameraPosAt(SURFACE_CROSSING_PROGRESS).y).toBeCloseTo(0, 0);
    expect(cameraPosAt(SURFACE_CROSSING_PROGRESS - 0.03).y).toBeGreaterThan(0);
    expect(cameraPosAt(SURFACE_CROSSING_PROGRESS + 0.03).y).toBeLessThan(0);
  });
});

describe('cameraLookAt', () => {
  it('regarde vers l’avant (cible plus négative en Z que la caméra)', () => {
    const p = 0.5;
    expect(cameraLookAt(p).z).toBeLessThan(cameraPosAt(p).z);
  });
});

describe('sampleDepthGrading', () => {
  it('épaissit le fog avec la profondeur', () => {
    expect(sampleDepthGrading(1).fogDensity).toBeGreaterThan(sampleDepthGrading(0).fogDensity);
  });

  it('assombrit l’ambiance avec la profondeur', () => {
    expect(sampleDepthGrading(1).ambientIntensity).toBeLessThan(sampleDepthGrading(0).ambientIntensity);
  });

  it('interpole entre keyframes (valeur intermédiaire bornée)', () => {
    const mid = sampleDepthGrading(0.5).fogDensity;
    expect(mid).toBeGreaterThan(sampleDepthGrading(0).fogDensity);
    expect(mid).toBeLessThan(sampleDepthGrading(1).fogDensity);
  });
});
