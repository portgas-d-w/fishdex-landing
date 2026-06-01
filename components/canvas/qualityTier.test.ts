import { describe, it, expect } from 'vitest';
import { detectQualityTier, QUALITY_TIERS, type DeviceEnv } from './qualityTier';

const base: DeviceEnv = {
  width: 1920, dpr: 2, cores: 8, hasWebGL: true, reducedMotion: false,
};

describe('detectQualityTier', () => {
  it('reduced-motion → fallback DOM', () => {
    expect(detectQualityTier({ ...base, reducedMotion: true })).toBe('dom-fallback');
  });

  it('pas de WebGL → fallback DOM', () => {
    expect(detectQualityTier({ ...base, hasWebGL: false })).toBe('dom-fallback');
  });

  it('desktop puissant → high', () => {
    expect(detectQualityTier(base)).toBe('high');
  });

  it('mobile correct → med', () => {
    expect(detectQualityTier({ ...base, width: 600, dpr: 2, cores: 8 })).toBe('med');
  });

  it('mobile faible → low', () => {
    expect(detectQualityTier({ ...base, width: 600, dpr: 1, cores: 2 })).toBe('low');
  });

  it('chaque palier non-fallback a des paramètres de rendu', () => {
    for (const tier of ['high', 'med', 'low'] as const) {
      const p = QUALITY_TIERS[tier];
      expect(p.dprCap).toBeGreaterThan(0);
      expect(p.particleScale).toBeGreaterThan(0);
      expect(p.waterRes).toBeGreaterThan(0);
      expect(typeof p.postProcessing).toBe('boolean');
    }
  });
});
