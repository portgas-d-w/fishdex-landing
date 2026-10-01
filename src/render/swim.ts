import { VertexBuffer } from '@babylonjs/core/Buffers/buffer';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import type { AssetContainer } from '@babylonjs/core/assetContainer';
import { swimSections } from '../game/swimming';
export class BodyWave {
  private parts: { mesh: Mesh; original: Float32Array; normals: Float32Array; positions: Float32Array; rotatedNormals: Float32Array }[] = [];
  constructor(container: AssetContainer, private tailSign = 1) {
    for (const mesh of container.meshes) {
      if (!(mesh instanceof Mesh)) continue;
      const positions = mesh.getVerticesData(VertexBuffer.PositionKind), normals = mesh.getVerticesData(VertexBuffer.NormalKind);
      if (!positions || !normals) continue;
      mesh.makeGeometryUnique();
      const original = new Float32Array(positions), baseline = new Float32Array(normals);
      const output = new Float32Array(original), rotatedNormals = new Float32Array(baseline);
      mesh.setVerticesData(VertexBuffer.PositionKind, output, true); mesh.setVerticesData(VertexBuffer.NormalKind, rotatedNormals, true);
      this.parts.push({ mesh, original, normals: baseline, positions: output, rotatedNormals });
    }
  }
  update(time: number, fast = false, intensity = 1) {
    const curve = swimSections(time * (fast ? 1.7 : 1), (fast ? 0.24 : 0.14) * intensity, this.tailSign);
    for (const p of this.parts) {
      for (let i = 0; i < p.original.length; i += 3) {
        const longitudinal = p.original[i] * this.tailSign;
        if (longitudinal <= -0.2) continue; // Tête stable.
        const t = Math.min(1, (longitudinal + 0.2) / 1.25) * 32;
        const index = Math.min(31, Math.floor(t)), f = t - index;
        const a = curve[index], b = curve[index + 1];
        const angle = a.angle + (b.angle - a.angle) * f;
        const cos = Math.cos(angle), sin = Math.sin(angle), side = p.original[i + 2];
        p.positions[i] = a.x + (b.x - a.x) * f - side * sin;
        p.positions[i + 2] = a.z + (b.z - a.z) * f + side * cos;
        p.rotatedNormals[i] = p.normals[i] * cos - p.normals[i + 2] * sin;
        p.rotatedNormals[i + 2] = p.normals[i] * sin + p.normals[i + 2] * cos;
      }
      p.mesh.updateVerticesData(VertexBuffer.PositionKind, p.positions, false, false);
      p.mesh.updateVerticesData(VertexBuffer.NormalKind, p.rotatedNormals, false, false);
    }
  }
}
