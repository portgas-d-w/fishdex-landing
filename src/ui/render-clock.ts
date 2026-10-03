/** Keep the fractional frame budget instead of resetting it at every RAF. */
export function nextRenderDeadline(now:number,deadline:number,interval:number){
 if(interval<=0)return now;
 return deadline+Math.max(1,Math.floor((now-deadline)/interval)+1)*interval;
}
