import React, { useState, useCallback } from 'react';
import Piano from './Piano.jsx';
import { NOTES, NOTE_NAMES_PT, SCALES, INTERVAL_NAMES, INTERVAL_SHORT, getScaleNotes, buildNoteColorMap, buildNoteIntervalMap, getNoteColor } from '../utils/musicTheory.js';
import { useAudio } from '../hooks/useAudio.js';
import styles from './ScaleExplorer.module.css';

const ROOT_NOTES = NOTES;
const SCALE_KEYS = Object.keys(SCALES);

export default function ScaleExplorer() {
  const [root, setRoot] = useState('C');
  const [rootOctave] = useState(4);
  const [scaleType, setScaleType] = useState('major');
  const { playArpeggio, isLoading } = useAudio();

  const scale = SCALES[scaleType];
  const scaleNotes = getScaleNotes(root, rootOctave, scaleType);
  const noteColors = buildNoteColorMap(scaleNotes);
  const noteLabels = buildNoteIntervalMap(scaleNotes);
  const highlightedNotes = scaleNotes.map(n => n.noteStr);

  const noteNames = scaleNotes
    .filter(n => n.interval < 12)
    .map(n => n.note)
    .join(' — ');

  const handlePlayScale = useCallback(async () => {
    await playArpeggio(scaleNotes, 0.2);
  }, [scaleNotes, playArpeggio]);

  const handlePlayDescending = useCallback(async () => {
    await playArpeggio([...scaleNotes].reverse(), 0.2);
  }, [scaleNotes, playArpeggio]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.scaleDisplay}>
          <span className={styles.scaleName}>{root} {scale?.name}</span>
        </div>

        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <label>Tônica</label>
            <div className={styles.noteGrid}>
              {ROOT_NOTES.map(note => (
                <button
                  key={note}
                  className={`${styles.noteBtn} ${root === note ? styles.active : ''}`}
                  onClick={() => setRoot(note)}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.controlGroup}>
            <label>Escala</label>
            <div className={styles.scaleBtns}>
              {SCALE_KEYS.map(key => (
                <button
                  key={key}
                  className={`${styles.scaleBtn} ${scaleType === key ? styles.active : ''}`}
                  onClick={() => setScaleType(key)}
                >
                  {SCALES[key].name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.pianoSection}>
        <Piano
          octaves={[3, 4, 5, 6]}
          highlightedNotes={highlightedNotes}
          noteColors={noteColors}
          noteLabels={noteLabels}
        />
      </div>

      <div className={styles.playSection}>
        <button className={styles.playBtn} onClick={handlePlayScale} disabled={isLoading}>
          ▶ Ascendente
        </button>
        <button className={styles.playBtnSecondary} onClick={handlePlayDescending} disabled={isLoading}>
          ▼ Descendente
        </button>
      </div>

      <div className={styles.info}>
        <h3>Notas da Escala</h3>
        <p className={styles.noteNames}>{noteNames}</p>
        <div className={styles.intervalList}>
          {scaleNotes.filter(n => n.interval < 12).map((n, i) => (
            <div key={n.noteStr} className={styles.intervalItem}>
              <span
                className={styles.dot}
                style={{ background: getNoteColor(n.interval) }}
              />
              <span className={styles.degree}>{i + 1}°</span>
              <span className={styles.noteName}>{n.note}</span>
              <span className={styles.intervalBadge} style={{ color: getNoteColor(n.interval) }}>
                {INTERVAL_SHORT[n.interval]}
              </span>
              <span className={styles.intervalFull}>
                {INTERVAL_NAMES[n.interval]}
              </span>
            </div>
          ))}
        </div>
        <div className={styles.formulaRow}>
          <span className={styles.formulaLabel}>Fórmula:</span>
          <span className={styles.formula}>
            {scale?.intervals.join(' — ')}
          </span>
          <span className={styles.formulaNote}>(semitons)</span>
        </div>
      </div>
    </div>
  );
}
