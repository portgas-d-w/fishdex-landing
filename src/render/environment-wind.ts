import {MaterialPluginBase} from '@babylonjs/core/Materials/materialPluginBase';
import type {Material} from '@babylonjs/core/Materials/material';
import type {MaterialDefines} from '@babylonjs/core/Materials/materialDefines';
import type {UniformBuffer} from '@babylonjs/core/Materials/uniformBuffer';

/** Source commune : horloge de simulation et vent du jeu, mis à jour une fois par image par PondScenery. */
export const SHARED_WIND={time:0,strength:0};

/**
 * Balancement GPU des végétaux GLB : déplacement horizontal ∝ hauteur² au-dessus du pivot (base fixe),
 * phase tirée de la position de l’instance, amplitude par matériau. Aucune reconstruction CPU des meshes ;
 * collisions, obstacles et placements inchangés.
 */
export class FoliageWindPlugin extends MaterialPluginBase{
 constructor(material:Material,private amplitude:number){super(material,'FdxWind',220,{FDXWIND:false});this._enable(true);}
 override prepareDefines(defines:MaterialDefines){defines.FDXWIND=true;}
 override getClassName(){return 'FdxWindPlugin';}
 override getUniforms(){return{ubo:[{name:'fdxWind',size:4,type:'vec4'}],vertex:'#ifdef FDXWIND\nuniform vec4 fdxWind;\n#endif\n'};}
 override bindForSubMesh(ubo:UniformBuffer){ubo.updateFloat4('fdxWind',SHARED_WIND.time,SHARED_WIND.strength,this.amplitude,0);}
 override getCustomCode(shaderType:string){
  if(shaderType!=='vertex')return null;
  return{CUSTOM_VERTEX_UPDATE_WORLDPOS:`
#ifdef FDXWIND
 float fdxH=max(0.,positionUpdated.y);
 vec2 fdxP=finalWorld[3].xz;
 float fdxS=sin(fdxWind.x*1.1+fdxP.x*.31+fdxP.y*.17)+.35*sin(fdxWind.x*2.3+fdxP.y*.53+positionUpdated.x*1.7);
 worldPos.xz+=vec2(.8,.45)*fdxS*fdxH*fdxH*fdxWind.z*(.35+fdxWind.y);
#endif
`};
 }
}
/** Amplitudes calibrées sur la hauteur des modèles (≈6 cm en tête d’arbre, ≈8 cm en tête de roseau, vent moyen). */
export const WIND_AMPLITUDE:Record<string,number>={fdx_leaves:.0006,fdx_bark:.0006,fdx_reed_blade:.012};
