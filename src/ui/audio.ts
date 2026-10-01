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
  tone(kind: 'cast' | 'bite' | 'catch' | 'reel') {
    if (!this.enabled || !this.context || this.context.state !== 'running') return;
    const notes = kind === 'catch' ? [523, 659, 784] : kind === 'bite' ? [680, 860] : kind === 'reel' ? [180] : [260];
    notes.forEach((frequency, index) => {
      const context = this.context!;
      const osc = context.createOscillator(); const gain = context.createGain();
      const start = context.currentTime + index * 0.13;
      osc.type = kind === 'reel' ? 'triangle' : 'sine'; osc.frequency.value = frequency;
      const duration = kind === 'reel' ? 0.045 : 0.25;
      gain.gain.setValueAtTime(0, start); gain.gain.linearRampToValueAtTime(kind === 'reel' ? 0.012 : 0.055, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      osc.connect(gain).connect(context.destination); osc.onended = () => { osc.disconnect(); gain.disconnect(); }; osc.start(start); osc.stop(start + duration + 0.02);
    });
  }
}
