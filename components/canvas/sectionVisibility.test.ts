import { describe, it, expect } from 'vitest';
import { sectionVisibility } from './sectionVisibility';

describe('sectionVisibility', () => {
  it('invisible quand la section est loin devant dans le fog', () => {
    const v = sectionVisibility(60);
    expect(v.opacity).toBe(0);
  });

  it('émerge progressivement à l’approche (flou qui se résorbe)', () => {
    const v = sectionVisibility(22); // entre FOG_REVEAL et READ_FAR
    expect(v.opacity).toBeGreaterThan(0);
    expect(v.opacity).toBeLessThan(1);
    expect(v.blur).toBeGreaterThan(0);
    expect(v.darken).toBe(0);
  });

  it('est nette et pleinement opaque en zone de lecture', () => {
    const v = sectionVisibility(12); // ~ READING_DISTANCE
    expect(v.opacity).toBeCloseTo(1, 2);
    expect(v.blur).toBeLessThan(1);
    expect(v.darken).toBeCloseTo(0, 2);
    expect(v.spread).toBeCloseTo(0, 2);
  });

  it('écarte les couches à la traversée', () => {
    const reading = sectionVisibility(12).spread;
    const crossing = sectionVisibility(0).spread;
    expect(crossing).toBeGreaterThan(reading);
  });

  it('réabsorbe par la profondeur AVANT de disparaître (occlusion)', () => {
    const v = sectionVisibility(-14); // derrière la caméra, en réabsorption
    expect(v.darken).toBeGreaterThan(0.3);     // assombrie
    expect(v.desaturate).toBeGreaterThan(0.3); // désaturée
    expect(v.opacity).toBeGreaterThan(0);      // pas encore totalement effacée
  });

  it('est totalement réabsorbée en profondeur', () => {
    const v = sectionVisibility(-40);
    expect(v.opacity).toBe(0);
  });

  it('darken et desaturate restent dans [0,1]', () => {
    for (let d = 30; d >= -45; d -= 1) {
      const v = sectionVisibility(d);
      expect(v.darken).toBeGreaterThanOrEqual(0);
      expect(v.darken).toBeLessThanOrEqual(1);
      expect(v.desaturate).toBeGreaterThanOrEqual(0);
      expect(v.desaturate).toBeLessThanOrEqual(1);
      expect(v.opacity).toBeGreaterThanOrEqual(0);
      expect(v.opacity).toBeLessThanOrEqual(1);
    }
  });
});
