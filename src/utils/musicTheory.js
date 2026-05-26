export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const NOTE_NAMES_PT = {
  'C': 'Dó', 'C#': 'Dó#', 'D': 'Ré', 'D#': 'Ré#',
  'E': 'Mi', 'F': 'Fá', 'F#': 'Fá#', 'G': 'Sol',
  'G#': 'Sol#', 'A': 'Lá', 'A#': 'Lá#', 'B': 'Si',
};

export const ENHARMONIC = {
  'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb',
};

export const INTERVAL_NAMES = {
  0: '1 — Fundamental',
  1: 'b2 — Segunda menor',
  2: '2 — Segunda maior',
  3: 'b3 — Terça menor',
  4: '3 — Terça maior',
  5: '4 — Quarta justa',
  6: 'b5 — Quinta diminuta',
  7: '5 — Quinta justa',
  8: '#5 — Quinta aumentada',
  9: '6 — Sexta maior',
  10: 'b7 — Sétima menor',
  11: '7 — Sétima maior',
  12: '8 — Oitava',
  14: '9 — Nona maior',
  17: '11 — Décima primeira',
  21: '13 — Décima terceira',
};

export const INTERVAL_SHORT = {
  0: '1', 1: 'b2', 2: '2', 3: 'b3', 4: '3', 5: '4',
  6: 'b5', 7: '5', 8: '#5', 9: '6', 10: 'b7', 11: '7',
  12: '8', 14: '9', 17: '11', 21: '13',
};

export const CHORD_TYPES = {
  'M':      { intervals: [0, 4, 7],             name: 'Maior',             symbol: '',       category: 'Tríade',    description: 'Fundamental + Terça maior + Quinta justa' },
  'm':      { intervals: [0, 3, 7],             name: 'Menor',             symbol: 'm',      category: 'Tríade',    description: 'Fundamental + Terça menor + Quinta justa' },
  'aug':    { intervals: [0, 4, 8],             name: 'Aumentado',         symbol: 'aug',    category: 'Tríade',    description: 'Fundamental + Terça maior + Quinta aumentada' },
  'dim':    { intervals: [0, 3, 6],             name: 'Diminuto',          symbol: 'dim',    category: 'Tríade',    description: 'Fundamental + Terça menor + Quinta diminuta' },
  'sus2':   { intervals: [0, 2, 7],             name: 'Sus2',              symbol: 'sus2',   category: 'Tríade',    description: 'Fundamental + Segunda maior + Quinta justa' },
  'sus4':   { intervals: [0, 5, 7],             name: 'Sus4',              symbol: 'sus4',   category: 'Tríade',    description: 'Fundamental + Quarta justa + Quinta justa' },
  'maj7':   { intervals: [0, 4, 7, 11],         name: 'Maior 7',           symbol: 'maj7',   category: 'Tétrade',   description: 'Fundamental + Terça maior + Quinta justa + Sétima maior' },
  '7':      { intervals: [0, 4, 7, 10],         name: 'Dominante 7',       symbol: '7',      category: 'Tétrade',   description: 'Fundamental + Terça maior + Quinta justa + Sétima menor' },
  'm7':     { intervals: [0, 3, 7, 10],         name: 'Menor 7',           symbol: 'm7',     category: 'Tétrade',   description: 'Fundamental + Terça menor + Quinta justa + Sétima menor' },
  'mMaj7':  { intervals: [0, 3, 7, 11],         name: 'Menor Maior 7',     symbol: 'mMaj7',  category: 'Tétrade',   description: 'Fundamental + Terça menor + Quinta justa + Sétima maior' },
  'm7b5':   { intervals: [0, 3, 6, 10],         name: 'Semidiminuto',      symbol: 'm7b5',   category: 'Tétrade',   description: 'Fundamental + Terça menor + Quinta diminuta + Sétima menor' },
  'dim7':   { intervals: [0, 3, 6, 9],          name: 'Diminuto 7',        symbol: 'dim7',   category: 'Tétrade',   description: 'Fundamental + Terça menor + Quinta diminuta + Sétima diminuta' },
  'add9':   { intervals: [0, 4, 7, 14],         name: 'Add9',              symbol: 'add9',   category: 'Extensão',  description: 'Fundamental + Terça maior + Quinta justa + Nona (sem b7)' },
  'madd9':  { intervals: [0, 3, 7, 14],         name: 'Menor Add9',        symbol: 'madd9',  category: 'Extensão',  description: 'Fundamental + Terça menor + Quinta justa + Nona (sem b7)' },
  '9':      { intervals: [0, 4, 7, 10, 14],     name: 'Nona',              symbol: '9',      category: 'Extensão',  description: 'Dom7 + Nona maior' },
  '11':     { intervals: [0, 4, 7, 10, 14, 17], name: 'Décima Primeira',   symbol: '11',     category: 'Extensão',  description: 'Dom9 + Décima primeira justa' },
  '13':     { intervals: [0, 4, 7, 10, 14, 17, 21], name: 'Décima Terceira', symbol: '13',  category: 'Extensão',  description: 'Dom11 + Décima terceira maior' },
};

export const SCALES = {
  'major':          { name: 'Maior',            intervals: [0, 2, 4, 5, 7, 9, 11] },
  'naturalMinor':   { name: 'Menor Natural',    intervals: [0, 2, 3, 5, 7, 8, 10] },
  'harmonicMinor':  { name: 'Menor Harmônica',  intervals: [0, 2, 3, 5, 7, 8, 11] },
  'melodicMinor':   { name: 'Menor Melódica',   intervals: [0, 2, 3, 5, 7, 9, 11] },
  'pentatonicMaj':  { name: 'Pentatônica Maior',intervals: [0, 2, 4, 7, 9] },
  'pentatonicMin':  { name: 'Pentatônica Menor',intervals: [0, 3, 5, 7, 10] },
  'blues':          { name: 'Blues',            intervals: [0, 3, 5, 6, 7, 10] },
  'dorian':         { name: 'Dórico',           intervals: [0, 2, 3, 5, 7, 9, 10] },
  'phrygian':       { name: 'Frígio',           intervals: [0, 1, 3, 5, 7, 8, 10] },
  'lydian':         { name: 'Lídio',            intervals: [0, 2, 4, 6, 7, 9, 11] },
  'mixolydian':     { name: 'Mixolídio',        intervals: [0, 2, 4, 5, 7, 9, 10] },
  'locrian':        { name: 'Lócrio',           intervals: [0, 1, 3, 5, 6, 8, 10] },
};

export const PROGRESSIONS = {
  'I-IV-V': {
    name: 'I — IV — V',
    romanNumerals: ['I', 'IV', 'V'],
    semitones: [0, 5, 7],
    types: ['M', 'M', 'M'],
    description: 'Progressão fundamental da música popular e rock',
    genre: 'Pop / Rock / Blues',
  },
  'I-V-vi-IV': {
    name: 'I — V — vi — IV',
    romanNumerals: ['I', 'V', 'vi', 'IV'],
    semitones: [0, 7, 9, 5],
    types: ['M', 'M', 'm', 'M'],
    description: 'A progressão pop mais popular do mundo (Canon)',
    genre: 'Pop',
  },
  'ii-V-I': {
    name: 'ii — V — I',
    romanNumerals: ['ii', 'V', 'I'],
    semitones: [2, 7, 0],
    types: ['m7', '7', 'maj7'],
    description: 'Progressão fundamental do jazz',
    genre: 'Jazz',
  },
  'I-vi-IV-V': {
    name: 'I — vi — IV — V',
    romanNumerals: ['I', 'vi', 'IV', 'V'],
    semitones: [0, 9, 5, 7],
    types: ['M', 'm', 'M', 'M'],
    description: 'Progressão dos anos 50 — doo-wop',
    genre: 'Oldies / Pop',
  },
  'I-IV-I-V': {
    name: 'I — IV — I — V',
    romanNumerals: ['I', 'IV', 'I', 'V'],
    semitones: [0, 5, 0, 7],
    types: ['7', '7', '7', '7'],
    description: 'Blues de 12 compassos (simplificado)',
    genre: 'Blues',
  },
  'vi-IV-I-V': {
    name: 'vi — IV — I — V',
    romanNumerals: ['vi', 'IV', 'I', 'V'],
    semitones: [9, 5, 0, 7],
    types: ['m', 'M', 'M', 'M'],
    description: 'Variação menor do pop',
    genre: 'Pop / Rock',
  },
  'iii-VI-ii-V': {
    name: 'iii — VI — ii — V',
    romanNumerals: ['iii', 'VI', 'ii', 'V'],
    semitones: [4, 9, 2, 7],
    types: ['m7', '7', 'm7', '7'],
    description: 'Ciclo de quintas — muito usado no jazz',
    genre: 'Jazz',
  },
  'I-bVII-IV': {
    name: 'I — bVII — IV',
    romanNumerals: ['I', 'bVII', 'IV'],
    semitones: [0, 10, 5],
    types: ['M', 'M', 'M'],
    description: 'Progressão modal — rock e funk',
    genre: 'Rock / Funk',
  },
};

export const INTERVAL_COLORS = {
  0:  '#6366f1',
  1:  '#f43f5e',
  2:  '#22d3ee',
  3:  '#f59e0b',
  4:  '#10b981',
  5:  '#a78bfa',
  6:  '#ef4444',
  7:  '#06b6d4',
  8:  '#f97316',
  9:  '#84cc16',
  10: '#eab308',
  11: '#ec4899',
  12: '#6366f1',
  14: '#38bdf8',
  17: '#c084fc',
  21: '#d946ef',
};

export function noteToMidi(note, octave) {
  const idx = NOTES.indexOf(note);
  if (idx === -1) return null;
  return (octave + 1) * 12 + idx;
}

export function midiToNote(midi) {
  const noteIndex = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  return { note: NOTES[noteIndex], octave };
}

export function getChordNotes(rootNote, rootOctave, chordType) {
  const rootMidi = noteToMidi(rootNote, rootOctave);
  if (rootMidi === null) return [];
  const chord = CHORD_TYPES[chordType];
  if (!chord) return [];
  return chord.intervals.map(interval => {
    const { note, octave } = midiToNote(rootMidi + interval);
    return { note, octave, noteStr: `${note}${octave}`, interval };
  });
}

export function getScaleNotes(rootNote, rootOctave, scaleType) {
  const rootMidi = noteToMidi(rootNote, rootOctave);
  if (rootMidi === null) return [];
  const scale = SCALES[scaleType];
  if (!scale) return [];
  const notes = scale.intervals.map(interval => {
    const { note, octave } = midiToNote(rootMidi + interval);
    return { note, octave, noteStr: `${note}${octave}`, interval };
  });
  // Add octave note
  const { note, octave } = midiToNote(rootMidi + 12);
  notes.push({ note, octave, noteStr: `${note}${octave}`, interval: 12 });
  return notes;
}

export function getProgressionChords(rootNote, rootOctave, progressionId) {
  const prog = PROGRESSIONS[progressionId];
  if (!prog) return [];
  return prog.semitones.map((semitone, i) => {
    const { note, octave } = midiToNote(noteToMidi(rootNote, rootOctave) + semitone);
    const type = prog.types[i];
    const chord = CHORD_TYPES[type];
    return {
      root: note,
      octave,
      type,
      notes: getChordNotes(note, octave, type),
      romanNumeral: prog.romanNumerals[i],
      displayName: `${note}${chord?.symbol || ''}`,
    };
  });
}

export function getNoteColor(interval) {
  return INTERVAL_COLORS[interval] ?? '#94a3b8';
}

export function buildNoteColorMap(chordNotes) {
  const map = {};
  chordNotes.forEach(({ noteStr, interval }) => {
    map[noteStr] = getNoteColor(interval);
  });
  return map;
}

export function buildNoteIntervalMap(chordNotes) {
  const map = {};
  chordNotes.forEach(({ noteStr, interval }) => {
    map[noteStr] = INTERVAL_SHORT[interval] ?? String(interval);
  });
  return map;
}

export function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
