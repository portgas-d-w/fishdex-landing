export interface WaterPoint { x: number; z: number }
export interface CastAim { point: WaterPoint; valid: boolean; reason: string; depth: number; habitat: 'reeds' | 'open' | 'willow' }
export interface CastSample { x: number; y: number; time: number }
export class CastGesture {
  private samples: CastSample[];
  readonly start: CastSample;
  readonly width: number;
  readonly height: number;
  readonly power: number;
  private inspect:(point:WaterPoint)=>CastAim;
  private reach:number;
  constructor(start: CastSample, width: number, height: number, power = 1, inspect=inspectTarget, reach=23) { this.start = start; this.width = width; this.height = height; this.power = power; this.samples = [start];this.inspect=inspect;this.reach=reach; }
  static canStart(y: number, height: number) { return y >= height * 2 / 3; }
  move(sample: CastSample) {
    if (sample.time < this.samples.at(-1)!.time) return;
    this.samples.push(sample);
    while (this.samples.length > 2 && this.samples[1].time < sample.time - 180) this.samples.shift();
  }
  pose(sample: CastSample) {
    const amplitude = Math.max(0, (this.start.y - sample.y) / this.height);
    return { yaw: Math.max(-1, Math.min(1, (sample.x - this.start.x) / this.width * 3)), lift: Math.max(0.05, Math.min(0.9, 0.15 + amplitude * 1.7)) };
  }
  aim(sample: CastSample): CastAim {
    const first = this.samples.find(s => s.time >= sample.time - 180) ?? this.samples.at(-1)!;
    const seconds = Math.max(0.016, (sample.time - first.time) / 1000);
    const dx = (sample.x - this.start.x) / this.width, forward = (this.start.y - sample.y) / this.height;
    const velocity = Math.max(0, (first.y - sample.y) / this.height / seconds);
    const energy = Math.min(1, velocity * 0.72) * 0.85 + Math.min(1, forward / 0.55) * Math.min(1, velocity) * 0.15;
    const distance = 2.5 + energy * Math.min(this.reach-2.5,19, 15 * Math.max(0.5, this.power));
    const angle = Math.atan2(dx * 1.5, Math.max(0.001, forward));
    const aim = this.inspect({ x: Math.sin(angle) * distance, z: Math.cos(angle) * distance - 1 });
    if (!CastGesture.canStart(this.start.y, this.height) || sample.y < 0 || sample.x < 0 || sample.x > this.width || sample.y > this.height * 0.62 || forward < 0.09 || velocity < 0.06) return { ...aim, valid: false, reason: 'Partez du bas, projetez vers l’eau puis relâchez au centre.' };
    return aim;
  }
}
export function inspectTarget(point: WaterPoint): CastAim {
  const finite = Number.isFinite(point.x) && Number.isFinite(point.z);
  const distance = Math.hypot(point.x, point.z + 1);
  const water = finite && point.z >= 1.5 && point.z <= 22 && Math.abs(point.x) <= 11;
  const valid = water && distance <= 23;
  return { point, valid, reason: valid ? '' : water ? 'Trop loin : rapprochez la cible.' : 'Visez l’eau devant le ponton.',
    depth: point.z < 7 ? 1.2 : point.z < 13 ? 2.4 : 4,
    habitat: point.z > 12 ? 'open' : point.x > 2 ? 'willow' : 'reeds' };
}
// Les deltas normalisés rendent la sensibilité stable après redimensionnement.
export function aimFromGesture(dx: number, dy: number, width: number, height: number, sensitivity = 1): CastAim {
  const aim = inspectTarget({ x: dx / Math.max(1, width) * 42 * sensitivity, z: -dy / Math.max(1, height) * 65 * sensitivity });
  if (Math.hypot(dx, dy) < 14) return { ...aim, valid: false, reason: 'Glissez vers l’eau pour choisir votre distance.' };
  return aim;
}
