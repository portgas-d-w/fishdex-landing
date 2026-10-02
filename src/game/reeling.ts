export function wheelTurns(delta: number, mode = 0): number {
  if (!Number.isFinite(delta)) return 0;
  const pixels = delta * (mode === 1 ? 16 : mode === 2 ? 180 : 1);
  return Math.min(240, Math.abs(pixels)) / 500;
}
