export type QualityTier = 'high' | 'med' | 'low' | 'dom-fallback';

export interface DeviceEnv {
  width: number;
  dpr: number;
  cores: number;
  hasWebGL: boolean;
  reducedMotion: boolean;
}

export interface TierParams {
  dprCap: number;
  particleScale: number; // multiplicateur sur le nombre de particules
  postProcessing: boolean;
  waterRes: number;      // résolution des render targets de l’eau
}

export const QUALITY_TIERS: Record<Exclude<QualityTier, 'dom-fallback'>, TierParams> = {
  high: { dprCap: 2,   particleScale: 1,   postProcessing: true,  waterRes: 512 },
  med:  { dprCap: 1.5, particleScale: 0.6, postProcessing: true,  waterRes: 256 },
  low:  { dprCap: 1,   particleScale: 0.3, postProcessing: false, waterRes: 256 },
};

export function detectQualityTier(env: DeviceEnv): QualityTier {
  if (env.reducedMotion || !env.hasWebGL) return 'dom-fallback';
  if (env.width <= 768) return env.cores <= 4 ? 'low' : 'med';
  if (env.cores <= 4) return 'med';
  return 'high';
}

// Helper d’exécution navigateur (non testé unitairement).
export function readDeviceEnv(): DeviceEnv {
  const hasWebGL = (() => {
    try {
      const c = document.createElement('canvas');
      return !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch {
      return false;
    }
  })();
  return {
    width: window.innerWidth,
    dpr: window.devicePixelRatio || 1,
    cores: navigator.hardwareConcurrency || 4,
    hasWebGL,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
}
