import React, { useState, useCallback, useEffect } from 'react';
import { NOTES, CHORD_TYPES, SCALES, getChordNotes, getScaleNotes, randomItem, shuffleArray, buildNoteColorMap } from '../utils/musicTheory.js';
import { useAudio } from '../hooks/useAudio.js';
import Piano from './Piano.jsx';
import styles from './EarTraining.module.css';

const CHORD_KEYS = Object.keys(CHORD_TYPES);
const SCALE_KEYS = Object.keys(SCALES);
const EXERCISE_TYPES = [
  { id: 'chord', label: 'Acordes', description: 'Ouça e identifique o acorde' },
  { id: 'scale', label: 'Escalas', description: 'Ouça e identifique a escala' },
  { id: 'interval', label: 'Intervalos', description: 'Ouça e identifique o intervalo' },
];

const INTERVALS = [
  { semitones: 1, name: 'Segunda menor' },
  { semitones: 2, name: 'Segunda maior' },
  { semitones: 3, name: 'Terça menor' },
  { semitones: 4, name: 'Terça maior' },
  { semitones: 5, name: 'Quarta justa' },
  { semitones: 6, name: 'Quinta dim' },
  { semitones: 7, name: 'Quinta justa' },
  { semitones: 8, name: 'Quinta aum' },
  { semitones: 9, name: 'Sexta maior' },
  { semitones: 10, name: 'Sétima menor' },
  { semitones: 11, name: 'Sétima maior' },
  { semitones: 12, name: 'Oitava' },
];

function generateQuestion(type) {
  const root = randomItem(NOTES);
  const octave = 4;
  if (type === 'chord') {
    const correct = randomItem(CHORD_KEYS.slice(0, 12)); // exclude complex extensions for ear training
    const wrongPool = CHORD_KEYS.filter(k => k !== correct).slice(0, 10);
    const wrongs = shuffleArray(wrongPool).slice(0, 3);
    const options = shuffleArray([correct, ...wrongs]);
    return {
      type: 'chord',
      root,
      octave,
      correct,
      options,
      notes: getChordNotes(root, octave, correct),
    };
  }
  if (type === 'scale') {
    const correct = randomItem(SCALE_KEYS);
    const wrongPool = SCALE_KEYS.filter(k => k !== correct);
    const wrongs = shuffleArray(wrongPool).slice(0, 3);
    const options = shuffleArray([correct, ...wrongs]);
    return {
      type: 'scale',
      root,
      octave,
      correct,
      options,
      notes: getScaleNotes(root, octave, correct),
    };
  }
  // interval
  const correct = randomItem(INTERVALS);
  const wrongPool = INTERVALS.filter(i => i.semitones !== correct.semitones);
  const wrongs = shuffleArray(wrongPool).slice(0, 3);
  const options = shuffleArray([correct, ...wrongs]);
  return {
    type: 'interval',
    root,
    octave,
    correct,
    options,
  };
}

function getOptionLabel(type, key) {
  if (type === 'chord') {
    const c = CHORD_TYPES[key];
    return c ? `${key === 'M' ? 'Maior' : key} — ${c.name}` : key;
  }
  if (type === 'scale') {
    return SCALES[key]?.name ?? key;
  }
  if (type === 'interval') {
    return key.name;
  }
  return String(key);
}

export default function EarTraining() {
  const [exerciseType, setExerciseType] = useState('chord');
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'wrong'
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const { playChord, playArpeggio, isLoading } = useAudio();

  const generateNext = useCallback(() => {
    const root = randomItem(NOTES);
    const octave = 4;
    let q;
    if (exerciseType === 'chord') {
      const correctKey = randomItem(CHORD_KEYS.slice(0, 12));
      const wrongPool = shuffleArray(CHORD_KEYS.filter(k => k !== correctKey)).slice(0, 3);
      const options = shuffleArray([correctKey, ...wrongPool]);
      q = { type: 'chord', root, octave, correct: correctKey, options, notes: getChordNotes(root, octave, correctKey) };
    } else if (exerciseType === 'scale') {
      const correctKey = randomItem(SCALE_KEYS);
      const wrongPool = shuffleArray(SCALE_KEYS.filter(k => k !== correctKey)).slice(0, 3);
      const options = shuffleArray([correctKey, ...wrongPool]);
      q = { type: 'scale', root, octave, correct: correctKey, options, notes: getScaleNotes(root, octave, correctKey) };
    } else {
      const correct = randomItem(INTERVALS);
      const wrongPool = shuffleArray(INTERVALS.filter(i => i.semitones !== correct.semitones)).slice(0, 3);
      const options = shuffleArray([correct, ...wrongPool]);
      q = { type: 'interval', root, octave, correct, options };
    }
    setQuestion(q);
    setSelected(null);
    setFeedback(null);
  }, [exerciseType]);

  useEffect(() => {
    generateNext();
  }, [exerciseType]);

  const handlePlay = useCallback(async () => {
    if (!question) return;
    if (question.type === 'chord') {
      await playChord(question.notes);
    } else if (question.type === 'scale') {
      await playArpeggio(question.notes, 0.18);
    } else {
      // Play two notes for interval
      const { noteToMidi, midiToNote: m2n } = await import('../utils/musicTheory.js');
      const rootMidi = noteToMidi(question.root, question.octave);
      const { note: n2, octave: o2 } = m2n(rootMidi + question.correct.semitones);
      await playArpeggio(
        [{ noteStr: `${question.root}${question.octave}` }, { noteStr: `${n2}${o2}` }],
        0.4
      );
    }
  }, [question, playChord, playArpeggio]);

  const handleAnswer = useCallback((option) => {
    if (feedback) return;
    setSelected(option);
    const correct = question?.correct;
    const isCorrect = exerciseType === 'interval'
      ? option.semitones === correct.semitones
      : option === correct;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setTotal(t => t + 1);
    if (isCorrect) {
      setScore(s => s + 1);
      setStreak(st => st + 1);
    } else {
      setStreak(0);
    }
  }, [feedback, question, exerciseType]);

  const highlightedNotes = question?.notes?.map(n => n.noteStr) ?? [];
  const noteColors = question?.notes ? buildNoteColorMap(question.notes) : {};

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.typeSelector}>
          {EXERCISE_TYPES.map(t => (
            <button
              key={t.id}
              className={`${styles.typeBtn} ${exerciseType === t.id ? styles.active : ''}`}
              onClick={() => setExerciseType(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className={styles.scoreBar}>
          <span className={styles.score}>✓ {score}/{total}</span>
          {streak >= 3 && <span className={styles.streak}>🔥 {streak} seguidos!</span>}
        </div>
      </div>

      <div className={styles.questionCard}>
        <p className={styles.questionText}>
          {EXERCISE_TYPES.find(t => t.id === exerciseType)?.description}
        </p>
        <div className={styles.questionNote}>
          Tônica: <strong>{question?.root ?? '—'}</strong>
        </div>
        <button className={styles.playBtn} onClick={handlePlay} disabled={isLoading || !question}>
          {isLoading ? '⏳' : '▶'} Tocar
        </button>
      </div>

      {feedback === 'correct' && (
        <div className={styles.pianoSection}>
          <Piano
            octaves={[3, 4, 5]}
            highlightedNotes={highlightedNotes}
            noteColors={noteColors}
          />
        </div>
      )}

      <div className={styles.optionsGrid}>
        {question?.options?.map((option, i) => {
          const label = getOptionLabel(exerciseType, option);
          const isSelected = exerciseType === 'interval'
            ? selected?.semitones === option.semitones
            : selected === option;
          const isCorrect = exerciseType === 'interval'
            ? option.semitones === question?.correct?.semitones
            : option === question?.correct;
          let cls = styles.optionBtn;
          if (isSelected && feedback === 'correct') cls += ` ${styles.correct}`;
          else if (isSelected && feedback === 'wrong') cls += ` ${styles.wrong}`;
          else if (!isSelected && feedback && isCorrect) cls += ` ${styles.showCorrect}`;
          return (
            <button key={i} className={cls} onClick={() => handleAnswer(option)}>
              {label}
            </button>
          );
        })}
      </div>

      {feedback && (
        <div className={`${styles.feedbackBanner} ${feedback === 'correct' ? styles.feedbackCorrect : styles.feedbackWrong}`}>
          {feedback === 'correct' ? '✅ Correto!' : `❌ Era: ${getOptionLabel(exerciseType, question?.correct)}`}
          <button className={styles.nextBtn} onClick={generateNext}>Próxima →</button>
        </div>
      )}
    </div>
  );
}
