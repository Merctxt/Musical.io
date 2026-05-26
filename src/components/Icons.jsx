const props = (size) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.75',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
});

export function IconPiano({ size = 18 }) {
  return (
    <svg {...props(size)}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <line x1="7"  y1="4" x2="7"  y2="14" />
      <line x1="12" y1="4" x2="12" y2="14" />
      <line x1="17" y1="4" x2="17" y2="14" />
      <rect x="4.5" y="4"  width="2.5" height="7" rx="0.5" fill="currentColor" stroke="none" />
      <rect x="9.5" y="4"  width="2.5" height="7" rx="0.5" fill="currentColor" stroke="none" />
      <rect x="14.5" y="4" width="2.5" height="7" rx="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconChord({ size = 18 }) {
  return (
    <svg {...props(size)}>
      <circle cx="6.5" cy="17.5" r="2" fill="currentColor" stroke="none" />
      <line x1="8.5" y1="17.5" x2="8.5" y2="6" />
      <circle cx="14" cy="14.5" r="2" fill="currentColor" stroke="none" />
      <line x1="16" y1="14.5" x2="16" y2="3" />
      <line x1="8.5" y1="6" x2="16" y2="3" />
      <line x1="3" y1="21" x2="21" y2="21" />
    </svg>
  );
}

export function IconScale({ size = 18 }) {
  return (
    <svg {...props(size)}>
      <line x1="2"  y1="19" x2="22" y2="19" strokeWidth="1.2" />
      <line x1="2"  y1="14" x2="22" y2="14" strokeWidth="1.2" />
      <line x1="2"  y1="9"  x2="22" y2="9"  strokeWidth="1.2" />
      <circle cx="4"  cy="19" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="8"  cy="16.5" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="16" cy="11.5" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="20" cy="9"  r="1.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconEar({ size = 18 }) {
  return (
    <svg {...props(size)}>
      <path d="M3 14a9 9 0 0 1 18 0" />
      <rect x="1.5" y="13" width="4"  height="7" rx="2" />
      <rect x="18.5" y="13" width="4" height="7" rx="2" />
    </svg>
  );
}

export function IconProgressions({ size = 18 }) {
  return (
    <svg {...props(size)}>
      <path d="M17 3l3 3-3 3" />
      <path d="M20 6H8a4 4 0 0 0-4 4" />
      <path d="M7 21l-3-3 3-3" />
      <path d="M4 18h12a4 4 0 0 0 4-4" />
    </svg>
  );
}

export function IconMetronome({ size = 18 }) {
  return (
    <svg {...props(size)}>
      <polygon points="6,22 18,22 15,4 9,4" />
      <line x1="12" y1="22" x2="12" y2="4" strokeWidth="1.2" />
      <line x1="8"  y1="10" x2="16" y2="10" strokeWidth="1.2" />
      <line x1="12" y1="4"  x2="17.5" y2="15" strokeWidth="1.75" />
      <circle cx="17.5" cy="15" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconTheory({ size = 18 }) {
  return (
    <svg {...props(size)}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <circle cx="11" cy="13" r="1.5" fill="currentColor" stroke="none" />
      <line x1="12.5" y1="13" x2="12.5" y2="8" />
      <line x1="12.5" y1="8"  x2="15"  y2="9" />
    </svg>
  );
}
