export interface ReelPoint { x: number; y: number }
export function circularTurns(from: ReelPoint, to: ReelPoint): number {
 const a=Math.hypot(from.x,from.y), b=Math.hypot(to.x,to.y);
 if(a<14||b<14||a>60||b>60)return 0;
 let delta=Math.atan2(to.y,to.x)-Math.atan2(from.y,from.x);
 if(delta>Math.PI)delta-=Math.PI*2; if(delta< -Math.PI)delta+=Math.PI*2;
 return Math.abs(delta)<=Math.PI/2?Math.abs(delta)/(Math.PI*2):0;
}
export function wheelTurns(delta: number, mode = 0): number {
  if (!Number.isFinite(delta)) return 0;
  const pixels = delta * (mode === 1 ? 16 : mode === 2 ? 180 : 1);
  return Math.min(240, Math.abs(pixels)) / 500;
}
