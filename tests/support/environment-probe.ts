// Fixture de contrat uniquement, interceptée par le navigateur, jamais publiée.
export function environmentProbe(scale=1){
 const points=[[-.7,-.4,-.6],[.7,-.4,-.6],[.7,.4,-.6],[-.7,.4,-.6],[-.7,-.4,.6],[.7,-.4,.6],[.7,.4,.6],[-.7,.4,.6]].flat().map(v=>v*scale);
 const indices=[0,2,1,0,3,2,4,5,6,4,6,7,0,1,5,0,5,4,3,7,6,3,6,2,0,4,7,0,7,3,1,2,6,1,6,5];
 const binary=Buffer.alloc(168);points.forEach((v,i)=>binary.writeFloatLE(v,i*4));indices.forEach((v,i)=>binary.writeUInt16LE(v,96+i*2));
 const source={asset:{version:'2.0'},scene:0,scenes:[{nodes:[0]}],nodes:[{mesh:0}],meshes:[{primitives:[{attributes:{POSITION:0},indices:1}]}],buffers:[{byteLength:168}],bufferViews:[{buffer:0,byteOffset:0,byteLength:96,target:34962},{buffer:0,byteOffset:96,byteLength:72,target:34963}],accessors:[{bufferView:0,componentType:5126,count:8,type:'VEC3',min:[-.7,-.4,-.6].map(v=>v*scale),max:[.7,.4,.6].map(v=>v*scale)},{bufferView:1,componentType:5123,count:36,type:'SCALAR'}]};
 const json=Buffer.from(JSON.stringify(source)),jsonSize=Math.ceil(json.length/4)*4,out=Buffer.alloc(12+8+jsonSize+8+binary.length,32);
 out.writeUInt32LE(0x46546c67,0);out.writeUInt32LE(2,4);out.writeUInt32LE(out.length,8);out.writeUInt32LE(jsonSize,12);out.writeUInt32LE(0x4e4f534a,16);json.copy(out,20);out.writeUInt32LE(binary.length,20+jsonSize);out.writeUInt32LE(0x004e4942,24+jsonSize);binary.copy(out,28+jsonSize);return out;
}
