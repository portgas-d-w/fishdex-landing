export const waterVertex=`
precision highp float;
attribute vec3 position;
uniform mat4 worldViewProjection,world;
varying vec3 wp;
varying vec4 clip;
void main(){wp=(world*vec4(position,1.)).xyz;clip=worldViewProjection*vec4(position,1.);gl_Position=clip;}
`;
export const waterFragment=`
precision highp float;
varying vec3 wp;
varying vec4 clip;
uniform mat4 view;
uniform float time,mirrorOn,wind,contextDepth,turbidity,fineDetail,waveCount;
uniform vec3 eye,sky;
uniform sampler2D depthMap,reflection,ripples;
uniform vec4 waves[8],waveMotion[8];
void main(){
 vec2 p=wp.xz;
 vec4 info=texture2D(depthMap,clamp(vec2((p.x+90.)/180.,(p.y+31.)/140.),vec2(.001),vec2(.999)));
 float depth=contextDepth>0.?contextDepth:info.r*8.;
 float bank=contextDepth>0.?1.:smoothstep(0.,.18,info.g);
 float contact=contextDepth>0.?0.:info.b;
 vec3 sight=normalize(eye-wp);float distanceToEye=length(eye-wp);
 float fineFade=(1.-smoothstep(10.,48.,distanceToEye))*smoothstep(.045,.24,sight.y);
 float middleFade=1.-smoothstep(25.,115.,distanceToEye);
 // One tile, unrelated scales/rotations/velocities. Mip filtering removes remote detail.
 vec2 dominant=vec2(dot(p,vec2(.86,.51)),dot(p,vec2(-.51,.86)));
 vec4 broad=texture2D(ripples,dominant*vec2(.042,.065)+vec2(time*(.003+wind*.009),time*.0011));
 vec4 middle=texture2D(ripples,vec2(dot(p,vec2(.31,-.95)),dot(p,vec2(.95,.31)))*.17+vec2(-time*.011,time*.007)+broad.b*.11);
 vec4 small=texture2D(ripples,vec2(dot(p,vec2(-.73,.68)),dot(p,vec2(-.68,-.73)))*.59+vec2(time*.023,time*.016));
 vec2 slope=(broad.rg*2.-1.)*.10+(middle.rg*2.-1.)*.105*middleFade+(small.rg*2.-1.)*.055*fineFade*fineDetail;
 if(fineDetail>.95){vec2 extra=texture2D(ripples,p*1.03+vec2(-time*.028,time*.017)).rg*2.-1.;slope+=extra*.018*fineFade;}
 slope*=mix(.45,1.,bank)*(.75+min(abs(wind),1.)*.4);
 // Meniscus/contact variation, not permanent foam or artificial ambient impacts.
 slope+=(middle.rg*2.-1.)*contact*.018;
 if(waveCount>0.)for(int i=0;i<8;i++){
  if(float(i)>=waveCount)break;
  vec4 w=waves[i],motion=waveMotion[i];vec2 d=p-w.xy;
  vec2 aligned=vec2(dot(d,motion.xy),dot(d,vec2(-motion.y,motion.x)));
  aligned.x*=mix(1.,.65,motion.w);float radius=length(aligned);
  float front=.10+w.z*(.42+w.w*.65),width=.10+w.z*.10;
  if(radius<front+width*3.){
   float offset=(radius-front)/width;
   float envelope=exp(-offset*offset)*smoothstep(0.,.10,w.z)*pow(max(0.,1.-w.z/2.4),2.);
   vec2 gradient=d/max(.06,length(d));
   slope+=gradient*offset*envelope*w.w*.42;
  }
 }
 vec3 normal=normalize(vec3(slope.x,1.,slope.y));
 float cosine=max(.015,dot(sight,normal));
 float fresnel=.035+.76*pow(1.-cosine,5.);
 vec3 ray=reflect(-sight,normal);
 vec3 skyReflection=mix(vec3(.79,.84,.83),vec3(.45,.63,.73),pow(max(0.,ray.y),.45));
 skyReflection*=sky/vec3(.7176,.7686,.7608);
 // Forest/horizon tint also remains present in the environment fallback.
 vec3 env=mix(vec3(.34,.40,.33),skyReflection,smoothstep(-.04,.22,ray.y));
 vec2 normalOnScreen=(view*vec4(normal-vec3(0.,1.,0.),0.)).xy;
 vec2 uv=clip.xy/max(.001,clip.w)*.5+.5;
 vec2 distortion=normalOnScreen*(.075+.035*fresnel);
 vec2 lookup=clamp(uv+distortion,vec2(.003),vec2(.997));
 vec3 reflected=texture2D(reflection,lookup).rgb;
 if(fineDetail>.95){
  vec2 spread=vec2(.0014,.0008)*(1.+fresnel);
  reflected=reflected*.5+texture2D(reflection,clamp(lookup+spread,vec2(.003),vec2(.997))).rgb*.25+texture2D(reflection,clamp(lookup-spread,vec2(.003),vec2(.997))).rgb*.25;
 }
 env=mix(env,reflected,mirrorOn*.88);
 // Beer-Lambert approximation along the oblique column, with the real pond depth.
 float path=depth/max(.30,sight.y);
 float transmission=exp(-path*turbidity);
 vec3 volume=mix(vec3(.205,.275,.235),vec3(.115,.205,.195),smoothstep(.12,4.,depth));
 volume+=(broad.b-.5)*.028+(info.a-.5)*.018+(middle.b-.5)*.06*transmission;
 volume*=1.-contact*.12;
 float alpha=clamp(1.-transmission*(1.-fresnel),.035,.998);
 vec3 color=(volume*(1.-transmission)*(1.-fresnel)+env*fresnel)/alpha;
 // Broad, restrained highlights: no unstable point glints at the horizon.
 float highlight=pow(max(0.,dot(reflect(-normalize(vec3(-.65,.8,.4)),normal),sight)),28.);
 color+=vec3(.55,.54,.43)*highlight*.025*fineFade;
 gl_FragColor=vec4(color,alpha);
}
`;
