import React, { useState, useCallback } from 'react';
import Piano from './Piano.jsx';
import { NOTES, NOTE_NAMES_PT, CHORD_TYPES, INTERVAL_NAMES, INTERVAL_SHORT, getChordNotes, buildNoteColorMap, buildNoteIntervalMap, getNoteColor } from '../utils/musicTheory.js';
import { useAudio } from '../hooks/useAudio.js';
import styles from './ChordBuilder.module.css';

const ROOT_NOTES = NOTES;
const CHORD_KEYS = Object.keys(CHORD_TYPES);
const CATEGORIES = ['Tríade', 'Tétrade', 'Extensão'];

export default function ChordBuilder() {
  const [root, setRoot] = useState('C');
  const [rootOctave, setRootOctave] = useState(4);
  const [chordType, setChordType] = useState('M');
  const [playMode, setPlayMode] = useState('chord'); // chord | arpeggio
  const { playNote, playChord, playArpeggio, isLoading } = useAudio();

  const chord = CHORD_TYPES[chordType];
  const chordNotes = getChordNotes(root, rootOctave, chordType);
  const noteColors = buildNoteColorMap(chordNotes);
  const noteLabels = buildNoteIntervalMap(chordNotes);
  const highlightedNotes = chordNotes.map(n => n.noteStr);

  const chordName = `${root}${chord?.symbol ?? ''}`;

  const handlePlay = useCallback(async () => {
    if (playMode === 'arpeggio') {
      await playArpeggio(chordNotes);
    } else {
      await playChord(chordNotes);
    }
  }, [playMode, chordNotes, playChord, playArpeggio]);

  const handleNoteClick = useCallback(async (noteStr) => {
    await playNote(noteStr, '8n');
  }, [playNote]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.chordDisplay}>
          <span className={styles.chordName}>{chordName}</span>
          <span className={styles.chordFullName}>{chord?.name}</span>
        </div>
        <div className={styles.controls}>
          {/* Root note */}
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

          {/* Octave */}
          <div className={styles.controlGroup}>
            <label>Oitava</label>
            <div className={styles.octaveBtns}>
              {[3, 4, 5].map(oct => (
                <button
                  key={oct}
                  className={`${styles.octBtn} ${rootOctave === oct ? styles.active : ''}`}
                  onClick={() => setRootOctave(oct)}
                >
                  {oct}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chord type selector */}
        <div className={styles.typeSelector}>
          {CATEGORIES.map(cat => {
            const catChords = CHORD_KEYS.filter(k => CHORD_TYPES[k].category === cat);
            return (
              <div key={cat} className={styles.typeCategory}>
                <span className={styles.categoryLabel}>{cat}</span>
                <div className={styles.typeBtns}>
                  {catChords.map(key => (
                    <button
                      key={key}
                      className={`${styles.typeBtn} ${chordType === key ? styles.active : ''}`}
                      onClick={() => setChordType(key)}
                      title={CHORD_TYPES[key].name}
                    >
                      {key === 'M' ? 'Maior' : key}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Piano */}
      <div className={styles.pianoSection}>
        <Piano
          octaves={[3, 4, 5, 6]}
          highlightedNotes={highlightedNotes}
          noteColors={noteColors}
          noteLabels={noteLabels}
          onNoteClick={handleNoteClick}
        />
      </div>

      {/* Play controls */}
      <div className={styles.playSection}>
        <div className={styles.playModes}>
          <button
            className={`${styles.playModeBtn} ${playMode === 'chord' ? styles.active : ''}`}
            onClick={() => setPlayMode('chord')}
          >
            Acorde
          </button>
          <button
            className={`${styles.playModeBtn} ${playMode === 'arpeggio' ? styles.active : ''}`}
            onClick={() => setPlayMode('arpeggio')}
          >
            Arpejo
          </button>
        </div>
        <button className={styles.playBtn} onClick={handlePlay} disabled={isLoading}>
          {isLoading ? '⏳ Carregando...' : '▶ Tocar'}
        </button>
      </div>

      {/* Interval explanation */}
      <div className={styles.explanation}>
        <h3>Composição do Acorde</h3>
        <p className={styles.formula}>{chord?.description}</p>
        <div className={styles.intervalList}>
          {chordNotes.map((n, i) => (
            <div key={n.noteStr} className={styles.intervalItem}>
              <span
                className={styles.intervalDot}
                style={{ background: getNoteColor(n.interval) }}
              />
              <span className={styles.intervalBadge} style={{ color: getNoteColor(n.interval) }}>
                {INTERVAL_SHORT[n.interval] ?? n.interval}
              </span>
              <span className={styles.noteName}>{n.note}{n.octave}</span>
              <span className={styles.intervalName}>
                {INTERVAL_NAMES[n.interval] ?? `+${n.interval} semitons`}
              </span>
            </div>
          ))}
        </div>
        <div className={styles.formulaRow}>
          <span className={styles.formulaLabel}>Intervalos:</span>
          <span className={styles.formulaIntervals}>
            {chord?.intervals.join(' — ')}
          </span>
          <span className={styles.formulaNote}> (semitons a partir da fundamental)</span>
        </div>
      </div>
    </div>
  );
}
