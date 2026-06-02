import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { diveState } from '../useScrollProgress';

const SURFACE_URL = '/assets/ultimate/audio-surface.mp3';
const ABYSS_URL = '/assets/ultimate/audio-abyss.mp3';

/**
 * Audio spatial sous-marin (Web Audio API natif via THREE.PositionalAudio).
 * - Surface (audio-surface.mp3) posé près de la surface (z≈5, y=0).
 * - Abysse (audio-abyss.mp3) posé dans les profondeurs.
 *   → le déplacement de la caméra (listener) fait le cross-fade par distance.
 * - Au passage de Y=0, un BiquadFilterNode (lowpass) étouffe la surface.
 * - Le volume master suit le scroll.
 *
 * L'AudioContext démarre suspendu (politique autoplay) : on le reprend au
 * premier geste utilisateur (pointer / wheel / touch / clavier).
 */
export default function UnderwaterAudio() {
  const camera = useThree((s) => s.camera);
  const scene = useThree((s) => s.scene);

  const listenerRef = useRef<THREE.AudioListener | null>(null);
  const lowpassRef = useRef<BiquadFilterNode | null>(null);

  useEffect(() => {
    const listener = new THREE.AudioListener();
    listener.setMasterVolume(0); // silencieux tant qu'on n'a pas scrollé
    camera.add(listener);
    listenerRef.current = listener;

    const surface = new THREE.PositionalAudio(listener);
    const abyss = new THREE.PositionalAudio(listener);

    // Lowpass natif appliqué à la SURFACE uniquement (Web Audio API).
    const lowpass = listener.context.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 20000; // ouvert au-dessus de l'eau (pas de filtrage)
    surface.setFilter(lowpass);
    lowpassRef.current = lowpass;

    // Positions spatiales
    surface.position.set(0, 0, 5);
    abyss.position.set(0, -2, -120);
    scene.add(surface);
    scene.add(abyss);

    let disposed = false;
    const loader = new THREE.AudioLoader();
    loader.load(SURFACE_URL, (buffer) => {
      if (disposed) return;
      surface.setBuffer(buffer);
      surface.setLoop(true);
      surface.setRefDistance(8); // TUNE — portée de la source de surface
      surface.setVolume(1);
    });
    loader.load(ABYSS_URL, (buffer) => {
      if (disposed) return;
      abyss.setBuffer(buffer);
      abyss.setLoop(true);
      abyss.setRefDistance(22); // TUNE — portée de la source abyssale
      abyss.setVolume(1);
    });

    // Autoplay : reprise du contexte + lecture au premier geste.
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      const ctx = listener.context;
      const begin = () => {
        if (surface.buffer && !surface.isPlaying) surface.play();
        if (abyss.buffer && !abyss.isPlaying) abyss.play();
      };
      if (ctx.state === 'suspended') ctx.resume().then(begin).catch(() => undefined);
      else begin();
    };
    const opts: AddEventListenerOptions = { once: true, passive: true };
    window.addEventListener('pointerdown', start, opts);
    window.addEventListener('wheel', start, opts);
    window.addEventListener('touchstart', start, opts);
    window.addEventListener('keydown', start, { once: true });

    return () => {
      disposed = true;
      window.removeEventListener('pointerdown', start);
      window.removeEventListener('wheel', start);
      window.removeEventListener('touchstart', start);
      window.removeEventListener('keydown', start);
      if (surface.isPlaying) surface.stop();
      if (abyss.isPlaying) abyss.stop();
      scene.remove(surface);
      scene.remove(abyss);
      camera.remove(listener);
    };
  }, [camera, scene]);

  useFrame((state, delta) => {
    const listener = listenerRef.current;
    if (!listener) return;

    // Volume master lié au scroll (fade-in qui s'amplifie avec la plongée).
    const target = THREE.MathUtils.clamp(0.2 + diveState.progress * 0.8, 0, 1);
    listener.setMasterVolume(THREE.MathUtils.damp(listener.getMasterVolume(), target, 3, delta));

    // Lowpass au passage de Y=0 : ouvert au-dessus, étouffé sous l'eau.
    const lowpass = lowpassRef.current;
    if (lowpass) {
      const y = state.camera.position.y;
      const submerge = THREE.MathUtils.clamp((0.5 - y) / 1.0, 0, 1); // 0 au-dessus, 1 immergé
      const targetFreq = THREE.MathUtils.lerp(20000, 350, submerge);
      lowpass.frequency.value = THREE.MathUtils.damp(lowpass.frequency.value, targetFreq, 3, delta);
    }
  });

  return null;
}
