import React, { useState } from 'react';
import { CHORD_TYPES, SCALES, INTERVAL_NAMES, INTERVAL_SHORT, getNoteColor } from '../utils/musicTheory.js';
import styles from './Theory.module.css';

// How to read chord symbols — table data
const CHORD_READING_TABLE = [
  { symbol: 'C',       fullName: 'Dó maior',           howToSay: '"Dó"',                      meaning: 'Tríade maior' },
  { symbol: 'Cm',      fullName: 'Dó menor',            howToSay: '"Dó menor"',                meaning: 'Tríade menor' },
  { symbol: 'C7',      fullName: 'Dó dominante sétima', howToSay: '"Dó sete"',                 meaning: 'Acorde dominante' },
  { symbol: 'Cmaj7',   fullName: 'Dó maior sétima',     howToSay: '"Dó maior sete"',           meaning: 'Acorde de repouso' },
  { symbol: 'Cm7',     fullName: 'Dó menor sétima',     howToSay: '"Dó menor sete"',           meaning: 'Acorde menor com 7ª' },
  { symbol: 'CmMaj7',  fullName: 'Dó menor maior sétima',howToSay: '"Dó menor major sete"',   meaning: 'Som dramático/cinematográfico' },
  { symbol: 'Cdim',    fullName: 'Dó diminuto',         howToSay: '"Dó dim"',                  meaning: 'Tensão máxima' },
  { symbol: 'Cdim7',   fullName: 'Dó diminuto sétima',  howToSay: '"Dó dim sete"',             meaning: 'Tensão simétrica' },
  { symbol: 'Caug',    fullName: 'Dó aumentado',        howToSay: '"Dó aug" ou "Dó mais"',     meaning: 'Instabilidade harmônica' },
  { symbol: 'Csus2',   fullName: 'Dó suspensa 2',       howToSay: '"Dó sus dois"',             meaning: 'Abertura, sem terça' },
  { symbol: 'Csus4',   fullName: 'Dó suspensa 4',       howToSay: '"Dó sus quatro"',           meaning: 'Tensão sem terça' },
  { symbol: 'Cm7b5',   fullName: 'Dó semidiminuto',     howToSay: '"Dó menor sete bê cinco"',  meaning: 'ii° do jazz (m7♭5)' },
  { symbol: 'Cadd9',   fullName: 'Dó com nona',         howToSay: '"Dó add nine"',             meaning: 'Maior com nona, sem 7ª' },
  { symbol: 'C9',      fullName: 'Dó nona',             howToSay: '"Dó nine"',                 meaning: 'Dom7 + nona' },
  { symbol: 'C11',     fullName: 'Dó décima primeira',  howToSay: '"Dó eleven"',               meaning: 'Dom9 + décima primeira' },
  { symbol: 'C13',     fullName: 'Dó décima terceira',  howToSay: '"Dó thirteen"',             meaning: 'Acorde jazz completo' },
];

const INTERVALS_TABLE = [
  { semitones: 0,  symbol: '1',   name: 'Uníssono / Fundamental', from_c: 'C',  quality: 'Perfeito' },
  { semitones: 1,  symbol: 'b2',  name: 'Segunda menor',          from_c: 'C#', quality: 'Dissonante' },
  { semitones: 2,  symbol: '2',   name: 'Segunda maior',          from_c: 'D',  quality: 'Dissonante' },
  { semitones: 3,  symbol: 'b3',  name: 'Terça menor',            from_c: 'Eb', quality: 'Consonante' },
  { semitones: 4,  symbol: '3',   name: 'Terça maior',            from_c: 'E',  quality: 'Consonante' },
  { semitones: 5,  symbol: '4',   name: 'Quarta justa',           from_c: 'F',  quality: 'Perfeito' },
  { semitones: 6,  symbol: 'b5',  name: 'Quinta diminuta / Trítono', from_c: 'Gb', quality: 'Dissonante' },
  { semitones: 7,  symbol: '5',   name: 'Quinta justa',           from_c: 'G',  quality: 'Perfeito' },
  { semitones: 8,  symbol: '#5',  name: 'Sexta menor / Quinta aug.',from_c:'Ab', quality: 'Consonante' },
  { semitones: 9,  symbol: '6',   name: 'Sexta maior',            from_c: 'A',  quality: 'Consonante' },
  { semitones: 10, symbol: 'b7',  name: 'Sétima menor',           from_c: 'Bb', quality: 'Dissonante' },
  { semitones: 11, symbol: '7',   name: 'Sétima maior',           from_c: 'B',  quality: 'Dissonante' },
  { semitones: 12, symbol: '8',   name: 'Oitava',                 from_c: 'C',  quality: 'Perfeito' },
];

const HARMONIC_DEGREES = [
  { degree: 'I',    semitones: 0,  type: 'M',    function: 'Tônica',        description: 'Repouso, resolução' },
  { degree: 'ii',   semitones: 2,  type: 'm7',   function: 'Subdominante',  description: 'Tensão suave, prepara V' },
  { degree: 'iii',  semitones: 4,  type: 'm7',   function: 'Tônica',        description: 'Substitui I' },
  { degree: 'IV',   semitones: 5,  type: 'M',    function: 'Subdominante',  description: 'Movimento, afastamento' },
  { degree: 'V',    semitones: 7,  type: '7',    function: 'Dominante',     description: 'Tensão máxima, quer resolver em I' },
  { degree: 'vi',   semitones: 9,  type: 'm',    function: 'Tônica',        description: 'Substitui I, sonoridade melancólica' },
  { degree: 'vii°', semitones: 11, type: 'm7b5', function: 'Dominante',     description: 'Substitui V' },
];

const FUNCTION_COLORS = {
  'Tônica':       'var(--primary)',
  'Subdominante': 'var(--secondary)',
  'Dominante':    'var(--accent)',
};

const SECTIONS = [
  { id: 'cifras',      label: 'Como Ler Cifras' },
  { id: 'intervalos',  label: 'Intervalos' },
  { id: 'formacao',    label: 'Formação de Acordes' },
  { id: 'graus',       label: 'Graus e Funções' },
  { id: 'escalas',     label: 'Escalas e Modos' },
];

export default function Theory() {
  const [activeSection, setActiveSection] = useState('cifras');

  return (
    <div className={styles.container}>
      {/* Section tabs */}
      <div className={styles.sectionNav}>
        {SECTIONS.map(s => (
          <button
            key={s.id}
            className={`${styles.sectionBtn} ${activeSection === s.id ? styles.sectionActive : ''}`}
            onClick={() => setActiveSection(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* CIFRAS */}
      {activeSection === 'cifras' && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Como Ler Cifras</h2>
          <p className={styles.sectionIntro}>
            Uma cifra tem duas partes: a <strong>tônica</strong> (nota fundamental) e a <strong>qualidade</strong> (tipo do acorde).
            A nota raiz é sempre a letra maiúscula no início. O restante descreve o tipo.
          </p>

          <div className={styles.formula}>
            <span className={styles.formulaPart} style={{ color: 'var(--primary)' }}>C</span>
            <span className={styles.formulaPlus}>+</span>
            <span className={styles.formulaPart} style={{ color: 'var(--accent)' }}>maj7</span>
            <span className={styles.formulaArrow}>→</span>
            <span className={styles.formulaResult}>Dó maior sétima</span>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Símbolo</th>
                  <th>Nome completo</th>
                  <th>Como dizer</th>
                  <th>Uso</th>
                </tr>
              </thead>
              <tbody>
                {CHORD_READING_TABLE.map(row => (
                  <tr key={row.symbol}>
                    <td><span className={styles.chordSymbol}>{row.symbol}</span></td>
                    <td>{row.fullName}</td>
                    <td className={styles.howToSay}>{row.howToSay}</td>
                    <td className={styles.meaning}>{row.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.infoBox}>
            <strong>Dica:</strong> A nota pode ser natural (C, D, E...), sustenido (C#, F#...) ou bemol (Bb, Eb...).
            No Brasil, também se usam os nomes latinos: Dó, Ré, Mi, Fá, Sol, Lá, Si.
          </div>
        </section>
      )}

      {/* INTERVALOS */}
      {activeSection === 'intervalos' && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Intervalos Musicais</h2>
          <p className={styles.sectionIntro}>
            Um intervalo é a distância em semitons entre duas notas. São a base da construção de acordes, escalas e melodias.
          </p>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Semitons</th>
                  <th>Símbolo</th>
                  <th>Nome</th>
                  <th>De C</th>
                  <th>Qualidade</th>
                </tr>
              </thead>
              <tbody>
                {INTERVALS_TABLE.map(row => (
                  <tr key={row.semitones}>
                    <td>
                      <span
                        className={styles.intervalBadge}
                        style={{ background: `${getNoteColor(row.semitones)}22`, color: getNoteColor(row.semitones), borderColor: `${getNoteColor(row.semitones)}44` }}
                      >
                        {row.semitones}
                      </span>
                    </td>
                    <td>
                      <span className={styles.intervalSymbol} style={{ color: getNoteColor(row.semitones) }}>
                        {row.symbol}
                      </span>
                    </td>
                    <td>{row.name}</td>
                    <td className={styles.fromC}>{row.from_c}</td>
                    <td>
                      <span className={`${styles.qualityTag} ${styles['quality' + row.quality]}`}>
                        {row.quality}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* FORMACAO */}
      {activeSection === 'formacao' && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Formação de Acordes</h2>
          <p className={styles.sectionIntro}>
            Acordes são construídos empilhando intervalos a partir da tônica. Cada tipo tem uma "fórmula" de semitons.
          </p>

          {['Tríade', 'Tétrade', 'Extensão'].map(cat => {
            const catChords = Object.entries(CHORD_TYPES).filter(([, v]) => v.category === cat);
            return (
              <div key={cat} className={styles.categoryBlock}>
                <h3 className={styles.categoryTitle}>{cat}s</h3>
                <div className={styles.chordGrid}>
                  {catChords.map(([key, chord]) => (
                    <div key={key} className={styles.chordCard}>
                      <div className={styles.chordCardHeader}>
                        <span className={styles.chordCardSymbol}>
                          C{chord.symbol}
                        </span>
                        <span className={styles.chordCardName}>{chord.name}</span>
                      </div>
                      <p className={styles.chordCardDesc}>{chord.description}</p>
                      <div className={styles.intervalPills}>
                        {chord.intervals.map(interval => (
                          <span
                            key={interval}
                            className={styles.intervalPill}
                            style={{
                              background: `${getNoteColor(interval)}20`,
                              color: getNoteColor(interval),
                              borderColor: `${getNoteColor(interval)}50`,
                            }}
                          >
                            <span className={styles.pillSymbol}>{INTERVAL_SHORT[interval]}</span>
                            <span className={styles.pillSemitone}>+{interval}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* GRAUS */}
      {activeSection === 'graus' && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Graus e Funções Harmônicas</h2>
          <p className={styles.sectionIntro}>
            Na tonalidade maior, cada acorde tem um grau (I–VII) e uma função harmônica: <strong>Tônica</strong> (repouso),
            <strong> Subdominante</strong> (movimento) ou <strong>Dominante</strong> (tensão).
          </p>

          <div className={styles.functionLegend}>
            {Object.entries(FUNCTION_COLORS).map(([fn, color]) => (
              <div key={fn} className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: color }} />
                <span>{fn}</span>
              </div>
            ))}
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Grau</th>
                  <th>Em Dó</th>
                  <th>Tipo</th>
                  <th>Função</th>
                  <th>Descrição</th>
                </tr>
              </thead>
              <tbody>
                {HARMONIC_DEGREES.map(row => {
                  const noteNames = ['C','D','E','F','G','A','B','C'];
                  const noteIdx = [0,2,4,5,7,9,11];
                  const noteI = [0,2,4,5,7,9,11].indexOf(row.semitones);
                  const rootNote = ['C','D','E','F','G','A','B'][noteI] ?? 'C';
                  const color = FUNCTION_COLORS[row.function];
                  const chordDef = CHORD_TYPES[row.type];
                  return (
                    <tr key={row.degree}>
                      <td>
                        <span className={styles.degreeBadge} style={{ color, borderColor: color + '66', background: color + '18' }}>
                          {row.degree}
                        </span>
                      </td>
                      <td>
                        <span className={styles.chordSymbol}>{rootNote}{chordDef?.symbol ?? ''}</span>
                      </td>
                      <td className={styles.typeTag}>{row.type}</td>
                      <td>
                        <span className={styles.functionTag} style={{ color, background: color + '18' }}>
                          {row.function}
                        </span>
                      </td>
                      <td className={styles.meaning}>{row.description}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className={styles.infoBox}>
            <strong>Progressão ii–V–I</strong> (jazz): <code>Dm7 → G7 → Cmaj7</code> — o ciclo de tensão e resolução mais usado no jazz.
            O ii prepara o V, o V cria máxima tensão, e o I resolve.
          </div>
        </section>
      )}

      {/* ESCALAS */}
      {activeSection === 'escalas' && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Escalas e Modos</h2>
          <p className={styles.sectionIntro}>
            Uma escala é uma sequência de notas definida por intervalos. Os modos são "rotações" da escala maior —
            cada modo começa em um grau diferente.
          </p>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Escala</th>
                  <th>Fórmula (semitons)</th>
                  <th>Notas em Dó</th>
                  <th>Característica</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(SCALES).map(([key, scale]) => {
                  const noteNames = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
                  const notes = scale.intervals.map(i => noteNames[i % 12]).join(' · ');
                  const chars = {
                    major:         'Base da harmonia tonal ocidental',
                    naturalMinor:  'Sonoridade melancólica e expressiva',
                    harmonicMinor: '7ª maior cria tensão dramática',
                    melodicMinor:  'Usada no jazz e música clássica',
                    pentatonicMaj: 'Sem dissonâncias — ideal para solos',
                    pentatonicMin: 'Blues, rock, a escala mais popular',
                    blues:         'Pentatônica menor + nota blues (b5)',
                    dorian:        'Menor com 6ª maior — jazz/funk',
                    phrygian:      'Menor com 2ª menor — flamenco',
                    lydian:        'Maior com 4ª aumentada — etéreo',
                    mixolydian:    'Maior com 7ª menor — rock/blues',
                    locrian:       'Modo diminuto — instável',
                  };
                  return (
                    <tr key={key}>
                      <td><strong>{scale.name}</strong></td>
                      <td>
                        <span className={styles.formula2}>{scale.intervals.join(' — ')}</span>
                      </td>
                      <td className={styles.scaleNotes}>{notes}</td>
                      <td className={styles.meaning}>{chars[key] ?? ''}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className={styles.infoBox}>
            <strong>Modos gregos</strong> são obtidos tocando a escala maior a partir de cada grau:
            Dórico (2°), Frígio (3°), Lídio (4°), Mixolídio (5°), Eólio (6° = menor natural), Lócrio (7°).
          </div>
        </section>
      )}
    </div>
  );
}
