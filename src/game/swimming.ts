// Courbe centrale inextensible : rotation des sections, sans pièces détachées.
export function swimSections(time: number, amplitude = 0.12, tailSign = 1) {
  const sections: { x: number; z: number; angle: number }[] = [];
  let x = -0.2, z = 0;
  for (let i = 0; i <= 32; i++) {
    const t = i / 32;
    const angle = i === 0 ? 0 : amplitude * t * t * Math.sin(time * 4.4 - t * 4);
    if (i) { x += Math.cos(angle) * 1.25 / 32; z += Math.sin(angle) * 1.25 / 32; }
    sections.push({ x: x * tailSign, z, angle: angle * tailSign });
  }
  return sections;
}
