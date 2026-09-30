import { spawnSync } from 'node:child_process';
const major = Number(process.versions.node.split('.')[0]);
if (major < 22 || (major === 22 && Number(process.versions.node.split('.')[1]) < 12)) {
  console.error('Installe Node.js 24 LTS, puis relance ce script.');
  process.exit(1);
}
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
for (const args of [['ci'], ['run', 'check']]) {
  const result = spawnSync(npm, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log('Projet prêt. Lance npm run dev pour ouvrir le jeu.');
