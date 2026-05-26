import React, { useState } from 'react';
import styles from './Piano.module.css';

const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const WHITE_NOTE_INDICES = [0, 2, 4, 5, 7, 9, 11]; // C D E F G A B
const BLACK_AFTER_WHITE = { 'C#': 0, 'D#': 1, 'F#': 3, 'G#': 4, 'A#': 5 };

function Piano({
  octaves = [3, 4, 5],
  highlightedNotes = [],
  noteColors = {},
  noteLabels = {},
  onNoteClick,
  activeNotes = [],
}) {
  const [pressedKey, setPressedKey] = useState(null);

  // Build white key list
  const whiteKeys = [];
  octaves.forEach(oct => {
    WHITE_NOTE_INDICES.forEach(noteIdx => {
      const note = CHROMATIC[noteIdx];
      const noteStr = `${note}${oct}`;
      whiteKeys.push({ note, octave: oct, noteStr });
    });
  });

  // Build black key list with their positions
  const blackKeys = [];
  octaves.forEach((oct, octIdx) => {
    CHROMATIC.forEach(note => {
      if (!note.includes('#')) return;
      const afterWhiteIdx = BLACK_AFTER_WHITE[note];
      const globalWhiteIdx = octIdx * 7 + afterWhiteIdx;
      blackKeys.push({ note, octave: oct, noteStr: `${note}${oct}`, whiteIdx: globalWhiteIdx });
    });
  });

  const isHighlighted = (noteStr) => highlightedNotes.includes(noteStr);
  const isActive = (noteStr) => activeNotes.includes(noteStr);
  const getColor = (noteStr) => noteColors[noteStr];
  const getLabel = (noteStr) => noteLabels[noteStr];

  const handleClick = (noteStr) => {
    setPressedKey(noteStr);
    setTimeout(() => setPressedKey(null), 200);
    onNoteClick && onNoteClick(noteStr);
  };

  const totalWhiteKeys = octaves.length * 7;

  return (
    <div className={styles.pianoWrapper}>
      <div className={styles.piano} style={{ '--total-white': totalWhiteKeys }}>
        {/* White keys */}
        {whiteKeys.map((key) => {
          const hl = isHighlighted(key.noteStr);
          const color = getColor(key.noteStr);
          const label = getLabel(key.noteStr);
          const pressed = pressedKey === key.noteStr || isActive(key.noteStr);
          return (
            <button
              key={key.noteStr}
              className={`${styles.whiteKey} ${hl ? styles.highlighted : ''} ${pressed ? styles.pressed : ''}`}
              style={hl && color ? { '--key-color': color } : undefined}
              onClick={() => handleClick(key.noteStr)}
              title={key.noteStr}
            >
              {label && <span className={styles.keyLabel}>{label}</span>}
              {!label && <span className={styles.keyName}>{key.note}</span>}
            </button>
          );
        })}

        {/* Black keys — absolutely positioned */}
        {blackKeys.map((key) => {
          const hl = isHighlighted(key.noteStr);
          const color = getColor(key.noteStr);
          const label = getLabel(key.noteStr);
          const pressed = pressedKey === key.noteStr || isActive(key.noteStr);
          return (
            <button
              key={key.noteStr}
              className={`${styles.blackKey} ${hl ? styles.highlighted : ''} ${pressed ? styles.pressed : ''}`}
              style={{
                left: `calc(${key.whiteIdx} * var(--wk-width) + var(--wk-width) * 0.64)`,
                ...(hl && color ? { '--key-color': color } : {}),
              }}
              onClick={() => handleClick(key.noteStr)}
              title={key.noteStr}
            >
              {label && <span className={styles.keyLabel}>{label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Piano;
