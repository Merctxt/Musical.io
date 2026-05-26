import React, { useState, useCallback, useEffect, useRef } from 'react';
import { NOTES, CHORD_TYPES, SCALES, getChordNotes, getScaleNotes, randomItem, shuffleArray, buildNoteColorMap } from '../utils/musicTheory.js';
import { useAudio } from '../hooks/useAudio.js';
import Piano from './Piano.jsx';
import styles from './GameMode.module.css';

const CHORD_KEYS_EASY = ['M', 'm', '7', 'm7', 'maj7', 'dim'];
const CHORD_KEYS_MEDIUM = Object.keys(CHORD_TYPES).slice(0, 12);
const CHORD_KEYS_HARD = Object.keys(CHORD_TYPES);
const SCALE_KEYS = Object.keys(SCALES);

const MAX_LIVES = 3;
const POINTS_BASE = 100;
const TIME_BONUS_MAX = 50;
const QUESTION_TIME = 15;

function generateGameQuestion(difficulty) {
  const root = randomItem(NOTES);
  const octave = 4;
  const chordPool = difficulty === 'easy' ? CHORD_KEYS_EASY
    : difficulty === 'medium' ? CHORD_KEYS_MEDIUM
    : CHORD_KEYS_HARD;

  const isScale = difficulty !== 'easy' && Math.random() > 0.6;
  if (isScale) {
    const correct = randomItem(SCALE_KEYS);
    const wrong = shuffleArray(SCALE_KEYS.filter(k => k !== correct)).slice(0, 3);
    return {
      type: 'scale',
      root, octave,
      correct,
      options: shuffleArray([correct, ...wrong]),
      notes: getScaleNotes(root, octave, correct),
    };
  }

  const correct = randomItem(chordPool);
  const wrong = shuffleArray(chordPool.filter(k => k !== correct)).slice(0, 3);
  return {
    type: 'chord',
    root, octave,
    correct,
    options: shuffleArray([correct, ...wrong]),
    notes: getChordNotes(root, octave, correct),
  };
}

function getOptionLabel(q, opt) {
  if (q.type === 'chord') {
    const c = CHORD_TYPES[opt];
    return c ? (opt === 'M' ? 'Maior' : opt) : opt;
  }
  return SCALES[opt]?.name ?? opt;
}

function getOptionFullLabel(q, opt) {
  if (q.type === 'chord') {
    const c = CHORD_TYPES[opt];
    return c ? `${q.root}${c.symbol}  —  ${c.name}` : opt;
  }
  return `${q.root} ${SCALES[opt]?.name ?? opt}`;
}

const DIFFICULTY_LABELS = { easy: 'Fácil', medium: 'Médio', hard: 'Difícil' };

export default function GameMode() {
  const [phase, setPhase] = useState('menu'); // menu | playing | gameover
  const [difficulty, setDifficulty] = useState('easy');
  const [question, setQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [combo, setCombo] = useState(0);
  const [highScores, setHighScores] = useState(() => {
    try { return JSON.parse(localStorage.getItem('musical_io_scores') ?? '{}'); } catch { return {}; }
  });
  const timerRef = useRef(null);
  const { playChord, playArpeggio, isLoading } = useAudio();

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const nextQuestion = useCallback(() => {
    const q = generateGameQuestion(difficulty);
    setQuestion(q);
    setSelected(null);
    setFeedback(null);
    setTimeLeft(QUESTION_TIME);
  }, [difficulty]);

  const handleTimeout = useCallback(() => {
    if (selected) return;
    setFeedback('timeout');
    setLives(l => {
      const newLives = l - 1;
      if (newLives <= 0) {
        clearTimer();
        setTimeout(() => setPhase('gameover'), 1200);
      }
      return newLives;
    });
    setCombo(0);
  }, [selected, clearTimer]);

  useEffect(() => {
    if (phase !== 'playing' || feedback) return;
    clearTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearTimer();
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return clearTimer;
  }, [phase, question, feedback, clearTimer, handleTimeout]);

  const startGame = useCallback(() => {
    setScore(0);
    setLives(MAX_LIVES);
    setQuestionsAnswered(0);
    setCombo(0);
    setPhase('playing');
    const q = generateGameQuestion(difficulty);
    setQuestion(q);
    setSelected(null);
    setFeedback(null);
    setTimeLeft(QUESTION_TIME);
  }, [difficulty]);

  const handlePlay = useCallback(async () => {
    if (!question) return;
    if (question.type === 'chord') await playChord(question.notes);
    else await playArpeggio(question.notes, 0.18);
  }, [question, playChord, playArpeggio]);

  const handleAnswer = useCallback((opt) => {
    if (feedback || !question) return;
    clearTimer();
    setSelected(opt);
    const isCorrect = opt === question.correct;
    if (isCorrect) {
      const timeBonus = Math.round((timeLeft / QUESTION_TIME) * TIME_BONUS_MAX);
      const comboMultiplier = 1 + combo * 0.1;
      const pts = Math.round((POINTS_BASE + timeBonus) * comboMultiplier);
      setScore(s => s + pts);
      setCombo(c => c + 1);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
      setCombo(0);
      setLives(l => {
        const newL = l - 1;
        if (newL <= 0) {
          clearTimer();
          setTimeout(() => setPhase('gameover'), 1200);
        }
        return newL;
      });
    }
    setQuestionsAnswered(q => q + 1);
  }, [feedback, question, timeLeft, combo, clearTimer]);

  const handleNext = useCallback(() => {
    if (lives <= 0) { setPhase('gameover'); return; }
    nextQuestion();
  }, [lives, nextQuestion]);

  const saveScore = useCallback(() => {
    const key = difficulty;
    const existing = highScores[key] ?? 0;
    if (score > existing) {
      const updated = { ...highScores, [key]: score };
      setHighScores(updated);
      localStorage.setItem('musical_io_scores', JSON.stringify(updated));
    }
  }, [score, difficulty, highScores]);

  useEffect(() => {
    if (phase === 'gameover') saveScore();
  }, [phase, saveScore]);

  const highlightedNotes = feedback && question?.notes ? question.notes.map(n => n.noteStr) : [];
  const noteColors = feedback && question?.notes ? buildNoteColorMap(question.notes) : {};

  // --- MENU ---
  if (phase === 'menu') {
    return (
      <div className={styles.container}>
        <div className={styles.menuCard}>
          <div className={styles.menuIcon}>🎵</div>
          <h2 className={styles.menuTitle}>Modo Jogo</h2>
          <p className={styles.menuSubtitle}>Teste seus conhecimentos em teoria musical. Identifique acordes e escalas contra o relógio!</p>

          <div className={styles.difficultySection}>
            <label>Dificuldade</label>
            <div className={styles.diffBtns}>
              {Object.entries(DIFFICULTY_LABELS).map(([d, label]) => (
                <button
                  key={d}
                  className={`${styles.diffBtn} ${difficulty === d ? styles.active : ''} ${styles[d]}`}
                  onClick={() => setDifficulty(d)}
                >
                  {label}
                  <span className={styles.diffDesc}>
                    {d === 'easy' ? 'Tríades + 7as' : d === 'medium' ? '+ Escalas' : 'Extensões'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.highScores}>
            {Object.entries(DIFFICULTY_LABELS).map(([d, label]) => (
              <div key={d} className={styles.hsItem}>
                <span>{label}</span>
                <span className={styles.hsScore}>{highScores[d] ?? 0} pts</span>
              </div>
            ))}
          </div>

          <button className={styles.startBtn} onClick={startGame}>
            ▶ Iniciar Jogo
          </button>
        </div>
      </div>
    );
  }

  // --- GAME OVER ---
  if (phase === 'gameover') {
    const isNewRecord = score > 0 && score >= (highScores[difficulty] ?? 0);
    return (
      <div className={styles.container}>
        <div className={styles.gameoverCard}>
          <div className={styles.gameoverIcon}>{isNewRecord ? '🏆' : '🎯'}</div>
          <h2>{isNewRecord ? 'Novo Recorde!' : 'Fim de Jogo'}</h2>
          <div className={styles.finalScore}>{score} pts</div>
          <p className={styles.finalStats}>{questionsAnswered} perguntas — dificuldade: {DIFFICULTY_LABELS[difficulty]}</p>
          {isNewRecord && <p className={styles.newRecord}>Novo recorde pessoal! 🎉</p>}
          <div className={styles.gameoverBtns}>
            <button className={styles.playAgainBtn} onClick={startGame}>▶ Jogar Novamente</button>
            <button className={styles.menuBtn} onClick={() => setPhase('menu')}>Menu</button>
          </div>
        </div>
      </div>
    );
  }

  // --- PLAYING ---
  const timePercent = (timeLeft / QUESTION_TIME) * 100;
  const isUrgent = timeLeft <= 5;

  return (
    <div className={styles.container}>
      {/* HUD */}
      <div className={styles.hud}>
        <div className={styles.hudItem}>
          <span className={styles.hudLabel}>Pontos</span>
          <span className={styles.hudValue}>{score}</span>
        </div>
        <div className={styles.hudItem}>
          <span className={styles.hudLabel}>Vidas</span>
          <span className={styles.hudValue}>{'❤️'.repeat(lives)}{'🖤'.repeat(MAX_LIVES - lives)}</span>
        </div>
        {combo >= 2 && (
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>Combo</span>
            <span className={`${styles.hudValue} ${styles.comboValue}`}>×{combo}</span>
          </div>
        )}
        <div className={styles.hudItem}>
          <span className={styles.hudLabel}>Respondidas</span>
          <span className={styles.hudValue}>{questionsAnswered}</span>
        </div>
      </div>

      {/* Timer */}
      <div className={styles.timerBar}>
        <div
          className={`${styles.timerFill} ${isUrgent ? styles.timerUrgent : ''}`}
          style={{ width: `${timePercent}%` }}
        />
        <span className={`${styles.timerNum} ${isUrgent ? styles.timerNumUrgent : ''}`}>{timeLeft}s</span>
      </div>

      {/* Question */}
      <div className={styles.questionCard}>
        <div className={styles.qType}>
          {question?.type === 'chord' ? '🎹 Qual é este acorde?' : '🎼 Qual é esta escala?'}
        </div>
        <div className={styles.qRoot}>
          Tônica: <strong>{question?.root}</strong>
        </div>
        <button className={styles.qPlayBtn} onClick={handlePlay} disabled={isLoading}>
          {isLoading ? '⏳' : '▶'} Tocar
        </button>
      </div>

      {/* Show piano on feedback */}
      {feedback && (
        <div className={styles.pianoReveal}>
          <Piano octaves={[3, 4, 5]} highlightedNotes={highlightedNotes} noteColors={noteColors} />
        </div>
      )}

      {/* Options */}
      <div className={styles.optionsGrid}>
        {question?.options?.map((opt, i) => {
          const isSelected = selected === opt;
          const isCorrect = opt === question.correct;
          let cls = styles.opt;
          if (isSelected && feedback === 'correct') cls += ` ${styles.optCorrect}`;
          else if (isSelected && (feedback === 'wrong' || feedback === 'timeout')) cls += ` ${styles.optWrong}`;
          else if (!isSelected && feedback && isCorrect) cls += ` ${styles.optReveal}`;
          return (
            <button key={i} className={cls} onClick={() => handleAnswer(opt)}>
              <span className={styles.optMain}>{getOptionFullLabel(question, opt)}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`${styles.feedbackBar} ${feedback === 'correct' ? styles.fbCorrect : styles.fbWrong}`}>
          <span>
            {feedback === 'correct' ? `✅ +${Math.round(POINTS_BASE * (1 + combo * 0.1))} pts${combo > 1 ? ` (×${combo} combo!)` : ''}` :
             feedback === 'timeout' ? '⏰ Tempo esgotado!' :
             `❌ Era: ${getOptionFullLabel(question, question.correct)}`}
          </span>
          <button className={styles.nextBtn} onClick={handleNext}>
            {lives <= 0 ? 'Ver Resultado' : 'Próxima →'}
          </button>
        </div>
      )}
    </div>
  );
}
