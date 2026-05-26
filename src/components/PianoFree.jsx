import React, { useState, useCallback } from 'react';
import Piano from './Piano.jsx';
import { NOTES, NOTE_NAMES_PT, INTERVAL_NAMES } from '../utils/musicTheory.js';
import { useAudio } from '../hooks/useAudio.js';
import styles from './PianoFree.module.css';

const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export default function PianoFree() {
  const [activeNotes, setActiveNotes] = useState([]);
  const [pressedHistory, setPressedHistory] = useState([]);
  const { playNote, isLoading, ensureReady } = useAudio();

  const handleNoteClick = useCallback(async (noteStr) => {
    await playNote(noteStr, '4n');
    const note = noteStr.replace(/\d/, '');
    setActiveNotes(prev => {
      const next = [...prev, noteStr].slice(-12);
      return next;
    });
    setPressedHistory(prev => [
      { noteStr, note, time: Date.now() },
      ...prev,
    ].slice(0, 8));
  }, [playNote]);

  const clearNotes = useCallback(() => {
    setActiveNotes([]);
    setPressedHistory([]);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.intro}>
        <p>Clique nas teclas para explorar livremente o teclado. O piano usa samples reais de piano de cauda (Salamander Grand Piano).</p>
        {isLoading && <span className={styles.loadingBadge}>⏳ Carregando samples...</span>}
      </div>

      <div className={styles.pianoSection}>
        <Piano
          octaves={[2, 3, 4, 5, 6]}
          onNoteClick={handleNoteClick}
          highlightedNotes={[]}
        />
      </div>

      <div className={styles.infoBar}>
        <div className={styles.pressedNotes}>
          {pressedHistory.length === 0 ? (
            <span className={styles.hint}>Clique em qualquer tecla para tocar...</span>
          ) : (
            pressedHistory.map((item, i) => (
              <span
                key={`${item.noteStr}-${item.time}`}
                className={styles.pressedNote}
                style={{ opacity: 1 - i * 0.12 }}
              >
                {NOTE_NAMES_PT[item.note] ?? item.note}
                <span className={styles.pressedOctave}>{item.noteStr.replace(/[A-G#]+/, '')}</span>
              </span>
            ))
          )}
        </div>
        {pressedHistory.length > 0 && (
          <button className={styles.clearBtn} onClick={clearNotes}>Limpar</button>
        )}
      </div>

      <div className={styles.referenceGrid}>
        <h3>Referência das Notas</h3>
        <div className={styles.noteCards}>
          {CHROMATIC.map((note, i) => (
            <div key={note} className={`${styles.noteCard} ${note.includes('#') ? styles.noteCardBlack : ''}`}>
              <span className={styles.noteCardName}>{note}</span>
              <span className={styles.noteCardPt}>{NOTE_NAMES_PT[note]}</span>
              <span className={styles.noteCardSemitone}>+{i}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.tips}>
        <div className={styles.tip}>
          <span className={styles.tipIcon}>💡</span>
          <div>
            <strong>Dica:</strong> Vá para a seção <em>Acordes</em> para ver como os acordes são formados sobre o teclado com cores por intervalo.
          </div>
        </div>
        <div className={styles.tip}>
          <span className={styles.tipIcon}>🎯</span>
          <div>
            <strong>Treino:</strong> Use a seção <em>Jogo</em> para testar seu ouvido identificando acordes e escalas.
          </div>
        </div>
      </div>
    </div>
  );
}
