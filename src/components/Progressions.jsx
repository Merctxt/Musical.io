import React, { useState, useCallback } from 'react';
import Piano from './Piano.jsx';
import { NOTES, PROGRESSIONS, CHORD_TYPES, getProgressionChords, buildNoteColorMap, buildNoteIntervalMap, getNoteColor } from '../utils/musicTheory.js';
import { useAudio } from '../hooks/useAudio.js';
import styles from './Progressions.module.css';

const PROG_KEYS = Object.keys(PROGRESSIONS);

export default function Progressions() {
  const [key, setKey] = useState('C');
  const [progId, setProgId] = useState('I-IV-V');
  const [activeChordIdx, setActiveChordIdx] = useState(null);
  const { playProgression, playChord, isLoading } = useAudio();

  const progression = PROGRESSIONS[progId];
  const chords = getProgressionChords(key, 4, progId);

  const allNotes = chords.flatMap(c => c.notes);
  const allColors = buildNoteColorMap(allNotes);

  const activeChord = activeChordIdx !== null ? chords[activeChordIdx] : null;
  const displayNotes = activeChord ? activeChord.notes : [];
  const displayColors = buildNoteColorMap(displayNotes);
  const displayLabels = buildNoteIntervalMap(displayNotes);
  const highlightedNotes = displayNotes.map(n => n.noteStr);

  const handlePlayAll = useCallback(async () => {
    setActiveChordIdx(null);
    await playProgression(chords, 1.2);
    // Animate through chords
    chords.forEach((_, i) => {
      setTimeout(() => setActiveChordIdx(i), i * 1200);
    });
    setTimeout(() => setActiveChordIdx(null), chords.length * 1200 + 600);
  }, [chords, playProgression]);

  const handleChordClick = useCallback(async (chord, idx) => {
    setActiveChordIdx(idx);
    await playChord(chord.notes);
  }, [playChord]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.progDisplay}>
          <span className={styles.progName}>{progression?.name}</span>
          <span className={styles.progGenre}>{progression?.genre}</span>
        </div>
        <p className={styles.progDesc}>{progression?.description}</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label>Tonalidade</label>
          <div className={styles.noteGrid}>
            {NOTES.map(note => (
              <button
                key={note}
                className={`${styles.noteBtn} ${key === note ? styles.active : ''}`}
                onClick={() => setKey(note)}
              >
                {note}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label>Progressão</label>
          <div className={styles.progBtns}>
            {PROG_KEYS.map(k => (
              <button
                key={k}
                className={`${styles.progBtn} ${progId === k ? styles.active : ''}`}
                onClick={() => { setProgId(k); setActiveChordIdx(null); }}
              >
                {PROGRESSIONS[k].name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chord sequence display */}
      <div className={styles.chordSequence}>
        {chords.map((chord, i) => (
          <button
            key={i}
            className={`${styles.chordCard} ${activeChordIdx === i ? styles.chordActive : ''}`}
            onClick={() => handleChordClick(chord, i)}
          >
            <span className={styles.romanNumeral}>{chord.romanNumeral}</span>
            <span className={styles.chordDisplayName}>{chord.displayName}</span>
            <div className={styles.chordNotesList}>
              {chord.notes.slice(0, 4).map(n => (
                <span key={n.noteStr} className={styles.miniNote} style={{ color: getNoteColor(n.interval) }}>
                  {n.note}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      <div className={styles.playBar}>
        <button className={styles.playAllBtn} onClick={handlePlayAll} disabled={isLoading}>
          {isLoading ? '⏳ Carregando...' : '▶ Tocar Progressão'}
        </button>
        {activeChordIdx !== null && (
          <span className={styles.activeLabel}>
            Tocando: {chords[activeChordIdx]?.displayName}
          </span>
        )}
      </div>

      <div className={styles.pianoSection}>
        <Piano
          octaves={[3, 4, 5]}
          highlightedNotes={highlightedNotes}
          noteColors={displayColors}
          noteLabels={displayLabels}
        />
      </div>

      {activeChord && (
        <div className={styles.chordInfo}>
          <h3>{activeChord.displayName} — {CHORD_TYPES[activeChord.type]?.name}</h3>
          <p>{CHORD_TYPES[activeChord.type]?.description}</p>
        </div>
      )}
    </div>
  );
}
