import { pickSpecies } from './catalog.ts';
import type { BaitId, Species, SpotId } from './catalog.ts';

export type Phase = 'idle' | 'casting' | 'waiting' | 'bite' | 'fighting' | 'caught' | 'lost';
export interface Catch { speciesId: Species['id']; length: number; date: string }
export class FishingGame {
  phase: Phase = 'idle';
  spot: SpotId = 'reeds';
  bait: BaitId = 'worm';
  elapsed = 0;
  tension = 0.25;
  progress = 0;
  pulling = false;
  reeling = false;
  failure = '';
  result: Catch | null = null;
  fish: Species | null = null;
  private waitDuration = 4;
  private slackTime = 0;
  private highTensionTime = 0;
  private random: () => number;
  constructor(random: () => number = Math.random) { this.random = random; }

  setSpot(spot: SpotId) { if (this.phase === 'idle') this.spot = spot; }
  setBait(bait: BaitId) { if (this.phase === 'idle') this.bait = bait; }
  cast() {
    if (this.phase !== 'idle') return;
    this.result = null;
    this.fish = pickSpecies(this.spot, this.bait, this.random());
    this.waitDuration = 3 + this.random() * 4;
    this.transition('casting');
  }
  strike() {
    if (this.phase !== 'bite') return;
    this.tension = 0.32; this.progress = 0; this.slackTime = 0; this.highTensionTime = 0;
    this.transition('fighting');
  }
  reset() {
    this.transition('idle'); this.result = null; this.fish = null;
    this.tension = 0.25; this.progress = 0; this.pulling = false; this.failure = '';
  }
  release() { this.reeling = false; }
  private transition(phase: Phase) { this.phase = phase; this.elapsed = 0; this.reeling = false; }
  private lose(reason: string) { this.failure = reason; this.transition('lost'); }
  update(delta: number) {
    // Simulation fixed step in the caller; large gaps never consume a bite or break the line.
    const dt = Math.min(Math.max(delta, 0), 0.05);
    this.elapsed += dt;
    if (this.phase === 'casting' && this.elapsed >= 1.1) this.transition('waiting');
    else if (this.phase === 'waiting' && this.elapsed >= this.waitDuration) this.transition('bite');
    else if (this.phase === 'bite' && this.elapsed >= 4.5) this.lose('Il a relâché l’appât. La prochaine touche sera la bonne.');
    else if (this.phase === 'fighting' && this.fish) {
      this.pulling = this.elapsed % 4.8 > 2.8;
      const force = this.fish.strength;
      this.tension += (this.reeling ? (this.pulling ? 0.44 * force : 0.12 * force) : -0.40) * dt;
      this.tension = Math.min(1, Math.max(0, this.tension));
      const gain = this.pulling ? 0.012 : 0.12 / force;
      this.progress = Math.min(1, Math.max(0, this.progress + (this.reeling ? gain : -0.012) * dt));
      this.highTensionTime = this.tension >= 0.97 ? this.highTensionTime + dt : 0;
      this.slackTime = this.tension < 0.025 ? this.slackTime + dt : 0;
      if (this.highTensionTime > 0.35) this.lose('Le fil a cassé. Relâche le moulinet quand le poisson tire.');
      else if (this.slackTime > 4) this.lose('Le poisson s’est décroché. Garde un peu de tension dans le fil.');
      else if (this.elapsed > 90) this.lose('Le poisson a trouvé refuge. Essaie de mouliner entre ses départs.');
      else if (this.progress >= 1) {
        this.result = { speciesId: this.fish.id, length: Math.round((this.fish.min + Math.pow(this.random(), 1.6) * (this.fish.max - this.fish.min)) * 10) / 10, date: new Date().toISOString() };
        this.transition('caught');
      }
    }
  }
}
