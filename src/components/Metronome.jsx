import React, { useState, useCallback, useEffect, useRef } from 'react';
import styles from './Metronome.module.css';

const TIME_SIGNATURES = [
  { label: '2/4', beats: 2 },
  { label: '3/4', beats: 3 },
  { label: '4/4', beats: 4 },
  { label: '6/8', beats: 6 },
];

const BPM_MIN = 40;
const BPM_MAX = 220;
const BPM_PRESETS = [60, 80, 100, 120, 140, 160, 180];

export default function Metronome() {
  const [bpm, setBpm] = useState(120);
  const [timeSig, setTimeSig] = useState(TIME_SIGNATURES[2]); // 4/4
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(-1); // -1 = stopped
  const [tapTimes, setTapTimes] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const accentSynthRef = useRef(null);
  const beatSynthRef = useRef(null);
  const loopRef = useRef(null);
  const beatIndexRef = useRef(0);
  const ToneRef = useRef(null);

  const initTone = useCallback(async () => {
    if (ToneRef.current) return ToneRef.current;
    const Tone = await import('tone');
    await Tone.start();
    ToneRef.current = Tone;

    accentSynthRef.current = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.05 },
      volume: -4,
    }).toDestination();

    beatSynthRef.current = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.04 },
      volume: -10,
    }).toDestination();

    return Tone;
  }, []);

  const stopMetronome = useCallback(() => {
    if (loopRef.current) {
      loopRef.current.stop();
      loopRef.current.dispose();
      loopRef.current = null;
    }
    if (ToneRef.current) {
      ToneRef.current.Transport.stop();
    }
    beatIndexRef.current = 0;
    setCurrentBeat(-1);
    setIsPlaying(false);
  }, []);

  const startMetronome = useCallback(async () => {
    const Tone = await initTone();
    if (!Tone) return;

    Tone.Transport.bpm.value = bpm;
    Tone.Transport.stop();
    Tone.Transport.cancel();
    beatIndexRef.current = 0;

    loopRef.current = new Tone.Sequence(
      (time, beatNum) => {
        if (!isMuted) {
          if (beatNum === 0) {
            accentSynthRef.current?.triggerAttackRelease('E5', '32n', time);
          } else {
            beatSynthRef.current?.triggerAttackRelease('C4', '32n', time);
          }
        }
        Tone.getDraw().schedule(() => {
          setCurrentBeat(beatNum);
        }, time);
      },
      Array.from({ length: timeSig.beats }, (_, i) => i),
      '4n'
    );

    loopRef.current.start(0);
    Tone.Transport.start();
    setIsPlaying(true);
  }, [bpm, timeSig, isMuted, initTone]);

  const handleToggle = useCallback(async () => {
    if (isPlaying) {
      stopMetronome();
    } else {
      await startMetronome();
    }
  }, [isPlaying, startMetronome, stopMetronome]);

  // Update BPM on-the-fly
  useEffect(() => {
    if (ToneRef.current && isPlaying) {
      ToneRef.current.Transport.bpm.value = bpm;
    }
  }, [bpm, isPlaying]);

  // Restart when time signature changes while playing
  useEffect(() => {
    if (isPlaying) {
      stopMetronome();
      // Small delay to let stop settle
      setTimeout(() => startMetronome(), 50);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeSig]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMetronome();
      accentSynthRef.current?.dispose();
      beatSynthRef.current?.dispose();
    };
  }, [stopMetronome]);

  const handleTap = useCallback(() => {
    const now = Date.now();
    setTapTimes(prev => {
      const recent = [...prev, now].filter(t => now - t < 4000).slice(-8);
      if (recent.length >= 2) {
        const intervals = recent.slice(1).map((t, i) => t - recent[i]);
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const newBpm = Math.round(60000 / avgInterval);
        const clamped = Math.max(BPM_MIN, Math.min(BPM_MAX, newBpm));
        setBpm(clamped);
      }
      return recent;
    });
  }, []);

  const handleBpmInput = useCallback((e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) setBpm(Math.max(BPM_MIN, Math.min(BPM_MAX, val)));
  }, []);

  // Tempo names
  const tempoName = bpm < 60 ? 'Largo' : bpm < 66 ? 'Larghetto' : bpm < 76 ? 'Adagio' : bpm < 108 ? 'Andante' : bpm < 120 ? 'Moderato' : bpm < 156 ? 'Allegro' : bpm < 176 ? 'Vivace' : 'Presto';

  return (
    <div className={styles.container}>
      {/* Beat display */}
      <div className={styles.beatDisplay}>
        {Array.from({ length: timeSig.beats }, (_, i) => (
          <div
            key={i}
            className={`${styles.beatDot} ${currentBeat === i ? styles.beatActive : ''} ${currentBeat === i && i === 0 ? styles.beatAccent : ''}`}
          />
        ))}
      </div>

      {/* BPM display */}
      <div className={styles.bpmSection}>
        <div className={styles.bpmDisplay}>
          <input
            type="number"
            className={styles.bpmInput}
            value={bpm}
            onChange={handleBpmInput}
            min={BPM_MIN}
            max={BPM_MAX}
          />
          <span className={styles.bpmUnit}>BPM</span>
        </div>
        <span className={styles.tempoName}>{tempoName}</span>
      </div>

      {/* Slider */}
      <input
        type="range"
        className={styles.slider}
        min={BPM_MIN}
        max={BPM_MAX}
        value={bpm}
        onChange={e => setBpm(Number(e.target.value))}
      />

      {/* BPM presets */}
      <div className={styles.presets}>
        {BPM_PRESETS.map(preset => (
          <button
            key={preset}
            className={`${styles.presetBtn} ${bpm === preset ? styles.presetActive : ''}`}
            onClick={() => setBpm(preset)}
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Controls row */}
      <div className={styles.controls}>
        {/* Time signature */}
        <div className={styles.controlGroup}>
          <label>Compasso</label>
          <div className={styles.timeSigBtns}>
            {TIME_SIGNATURES.map(ts => (
              <button
                key={ts.label}
                className={`${styles.timeSigBtn} ${timeSig.label === ts.label ? styles.active : ''}`}
                onClick={() => setTimeSig(ts)}
              >
                {ts.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mute */}
        <div className={styles.controlGroup}>
          <label>Som</label>
          <button
            className={`${styles.muteBtn} ${isMuted ? styles.muted : ''}`}
            onClick={() => setIsMuted(m => !m)}
          >
            {isMuted ? '🔇 Mudo' : '🔊 Ativo'}
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className={styles.actionRow}>
        <button
          className={`${styles.playBtn} ${isPlaying ? styles.stopBtn : ''}`}
          onClick={handleToggle}
        >
          {isPlaying ? '⏹ Parar' : '▶ Iniciar'}
        </button>
        <button className={styles.tapBtn} onClick={handleTap}>
          Tap Tempo
        </button>
      </div>

      {/* Reference table */}
      <div className={styles.referenceCard}>
        <h3>Referência de Andamentos</h3>
        <div className={styles.referenceGrid}>
          {[
            ['Grave',     '< 40'],
            ['Largo',     '40–59'],
            ['Larghetto', '60–65'],
            ['Adagio',    '66–75'],
            ['Andante',   '76–107'],
            ['Moderato',  '108–119'],
            ['Allegro',   '120–155'],
            ['Vivace',    '156–175'],
            ['Presto',    '176–200'],
            ['Prestissimo','> 200'],
          ].map(([name, range]) => (
            <div key={name} className={`${styles.refRow} ${tempoName === name ? styles.refRowActive : ''}`}>
              <span className={styles.refName}>{name}</span>
              <span className={styles.refRange}>{range} BPM</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
