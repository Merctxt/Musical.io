import { useRef, useState, useCallback } from 'react';

let globalSampler = null;
let globalReady = false;
let loadingPromise = null;

async function initSampler() {
  if (globalSampler && globalReady) return globalSampler;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const Tone = await import('tone');
    await Tone.start();

    return new Promise((resolve) => {
      const sampler = new Tone.Sampler({
        urls: {
          A0: 'A0.mp3', C1: 'C1.mp3', 'D#1': 'Ds1.mp3', 'F#1': 'Fs1.mp3',
          A1: 'A1.mp3', C2: 'C2.mp3', 'D#2': 'Ds2.mp3', 'F#2': 'Fs2.mp3',
          A2: 'A2.mp3', C3: 'C3.mp3', 'D#3': 'Ds3.mp3', 'F#3': 'Fs3.mp3',
          A3: 'A3.mp3', C4: 'C4.mp3', 'D#4': 'Ds4.mp3', 'F#4': 'Fs4.mp3',
          A4: 'A4.mp3', C5: 'C5.mp3', 'D#5': 'Ds5.mp3', 'F#5': 'Fs5.mp3',
          A5: 'A5.mp3', C6: 'C6.mp3', 'D#6': 'Ds6.mp3', 'F#6': 'Fs6.mp3',
          A6: 'A6.mp3', C7: 'C7.mp3', 'D#7': 'Ds7.mp3', 'F#7': 'Fs7.mp3',
          A7: 'A7.mp3', C8: 'C8.mp3',
        },
        release: 1,
        baseUrl: 'https://tonejs.github.io/audio/salamander/',
        onload: () => {
          globalSampler = sampler;
          globalReady = true;
          resolve(sampler);
        },
        onerror: () => {
          // Fallback to PolySynth
          const poly = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'triangle' },
            envelope: { attack: 0.02, decay: 0.5, sustain: 0.4, release: 1.5 },
            volume: -6,
          }).toDestination();
          globalSampler = poly;
          globalReady = true;
          resolve(poly);
        },
      }).toDestination();
    });
  })();

  return loadingPromise;
}

export function useAudio() {
  const [isReady, setIsReady] = useState(globalReady);
  const [isLoading, setIsLoading] = useState(false);
  const Tone = useRef(null);

  const ensureReady = useCallback(async () => {
    if (globalReady) {
      setIsReady(true);
      return globalSampler;
    }
    setIsLoading(true);
    try {
      Tone.current = await import('tone');
      const sampler = await initSampler();
      setIsReady(true);
      setIsLoading(false);
      return sampler;
    } catch (e) {
      setIsLoading(false);
      console.error('Audio init error:', e);
      return null;
    }
  }, []);

  const playNote = useCallback(async (noteStr, duration = '8n') => {
    const sampler = await ensureReady();
    if (!sampler) return;
    try {
      sampler.triggerAttackRelease(noteStr, duration);
    } catch (e) { /* ignore */ }
  }, [ensureReady]);

  const playChord = useCallback(async (notes, duration = '2n') => {
    const sampler = await ensureReady();
    if (!sampler) return;
    try {
      const noteStrs = notes.map(n => (typeof n === 'string' ? n : n.noteStr));
      sampler.triggerAttackRelease(noteStrs, duration);
    } catch (e) { /* ignore */ }
  }, [ensureReady]);

  const playArpeggio = useCallback(async (notes, delay = 0.12) => {
    const sampler = await ensureReady();
    if (!sampler) return;
    const ToneLib = await import('tone');
    try {
      const now = ToneLib.now();
      notes.forEach((n, i) => {
        const noteStr = typeof n === 'string' ? n : n.noteStr;
        sampler.triggerAttackRelease(noteStr, '4n', now + i * delay);
      });
    } catch (e) { /* ignore */ }
  }, [ensureReady]);

  const playProgression = useCallback(async (chordList, interval = 1.0) => {
    const sampler = await ensureReady();
    if (!sampler) return;
    const ToneLib = await import('tone');
    try {
      const now = ToneLib.now();
      chordList.forEach((chord, i) => {
        const noteStrs = chord.notes.map(n => n.noteStr);
        sampler.triggerAttackRelease(noteStrs, '2n', now + i * interval);
      });
    } catch (e) { /* ignore */ }
  }, [ensureReady]);

  return { playNote, playChord, playArpeggio, playProgression, ensureReady, isReady, isLoading };
}
