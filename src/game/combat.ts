const clamp = (n: number, low: number, high: number) => Math.max(low, Math.min(high, n));
export function fishBearing(time: number, strength: number): number {
  return clamp(Math.sin(time * 0.48 + strength) * 0.78 + Math.sin(time * 1.65) * 0.12, -0.9, 0.9);
}
export function combatForces(yaw: number, lift: number, bearing: number, burst: boolean, force: number, power: number, reelSpeed: number) {
  const error = Math.abs(yaw - bearing);
  const alignment = clamp(1 - error / 0.65, 0, 1);
  const contact = lift < 0.08 && reelSpeed < 0.05 ? 0.015 : 1;
  const tension = clamp((0.09 + lift * 0.30 + error * 0.25 + (burst ? 0.40 * force / power : 0) + reelSpeed * 0.10 * force) * contact, 0, 1.25);
  const recovery = reelSpeed * 0.13 / force * alignment ** 3 * (0.45 + lift * 0.65) * power * (burst ? 0.08 : 1);
  const escape = (burst ? 0.034 * force : 0.006 * force) * (1 + (1 - alignment) * 2.7);
  return { alignment, tension, recovery, escape };
}
