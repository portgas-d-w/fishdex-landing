// Sons synthétisés localement, démarrés uniquement après un geste de l’utilisateur.
export class GameAudio {
  private context?: AudioContext;
  enabled = false;
  async unlock() {
    if (!this.enabled) return;
    try {
      this.context ??= new AudioContext();
      if (this.context.state === 'suspended') await this.context.resume();
    } catch { /* Audio optionnel, le jeu reste utilisable. */ }
  }
  tone(kind: 'cast' | 'bite' | 'catch') {
    if (!this.enabled || !this.context || this.context.state !== 'running') return;
    const notes = kind === 'catch' ? [523, 659, 784] : kind === 'bite' ? [680, 860] : [260];
    notes.forEach((frequency, index) => {
      const context = this.context!;
      const osc = context.createOscillator(); const gain = context.createGain();
      const start = context.currentTime + index * 0.13;
      osc.type = 'sine'; osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0, start); gain.gain.linearRampToValueAtTime(0.055, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
      osc.connect(gain).connect(context.destination); osc.start(start); osc.stop(start + 0.27);
    });
  }
}
