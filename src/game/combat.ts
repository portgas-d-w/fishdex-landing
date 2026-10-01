const clamp = (n: number, low: number, high: number) => Math.max(low, Math.min(high, n));
export function fishBearing(time: number, strength: number): number {
  return clamp(Math.sin(time * 0.48 + strength) * 0.78 + Math.sin(time * 1.65) * 0.12, -0.9, 0.9);
}
export interface CombatState { distance: number; lineLength: number; tension: number; fatigue: number }
export interface CombatInput { yaw: number; lift: number; bearing: number; force: number; power: number; reelSpeed: number; motion: 'burst' | 'cruise' | 'return' }
// Unités de jeu : élasticité canne/fil, pression, frein automatique et nage radiale.
// Aucun angle binaire ni minuteur de victoire : la pression vient du fil disponible.
export function stepCombat(state: CombatState, input: CombatInput, delta: number) {
  const dt = clamp(delta, 0, 0.05), error = Math.abs(input.yaw - input.bearing);
  const power = Math.max(0.3, input.power), force = Math.max(0.2, input.force);
  const alignment = 1 / (1 + error * error * 1.8);
  const relativeForce = force / power * (1 - state.fatigue * 0.72);
  const spanOffset = input.lift * 0.85 + error * 0.35;
  const swim = input.motion === 'burst' ? relativeForce * 0.95 : input.motion === 'return' ? -relativeForce * 0.38 : relativeForce * 0.10;
  const resistance = state.tension * power / (force * (1 - state.fatigue * 0.5) + 0.4) * 0.65 * alignment;
  const velocity = swim - resistance;
  const distance = Math.max(1.8, state.distance + velocity * dt);
  const retrieved = input.reelSpeed * 0.95 * power * (0.55 + alignment * 0.45);
  let lineLength = Math.max(0.5, state.lineLength - retrieved * dt);
  const span = distance + spanOffset;
  const load = Math.max(0, (span - lineLength) / 0.85);
  const brakeThreshold = 0.60 + input.lift * 0.18 + error * 0.12;
  const dragSpeed = Math.max(0, load - brakeThreshold) * 5;
  lineLength += dragSpeed * dt;
  const desired = clamp((span - lineLength) / 0.85, 0, 1.25);
  const tension = clamp(state.tension + (desired - state.tension) * Math.min(1, dt * 12), 0, 1.25);
  const slack = Math.max(0, lineLength - span);
  const work = tension >= 0.12 && tension < 0.95 ? tension * alignment * 0.065 : tension < 0.05 ? -0.008 : 0;
  const fatigue = clamp(state.fatigue + work * dt, 0, 1);
  return { distance, lineLength, tension, fatigue, alignment, relativeForce, velocity, dragSpeed, slack };
}
