import React, { useState, lazy, Suspense } from 'react';
import { IconPiano, IconChord, IconScale, IconEar, IconProgressions, IconMetronome, IconTheory } from './components/Icons.jsx';
import styles from './App.module.css';

const ChordBuilder  = lazy(() => import('./components/ChordBuilder.jsx'));
const ScaleExplorer = lazy(() => import('./components/ScaleExplorer.jsx'));
const Progressions  = lazy(() => import('./components/Progressions.jsx'));
const PianoFree     = lazy(() => import('./components/PianoFree.jsx'));
const Metronome     = lazy(() => import('./components/Metronome.jsx'));
const Theory        = lazy(() => import('./components/Theory.jsx'));

const TABS = [
  { id: 'piano',       label: 'Piano',       Icon: IconPiano,        description: 'Piano livre' },
  { id: 'acordes',     label: 'Acordes',     Icon: IconChord,        description: 'Formação de acordes' },
  { id: 'escalas',     label: 'Escalas',     Icon: IconScale,        description: 'Explorador de escalas' },
  { id: 'progressoes', label: 'Progressões', Icon: IconProgressions, description: 'Progressões harmônicas' },
  { id: 'metronomo',   label: 'Metrônomo',   Icon: IconMetronome,    description: 'Metrônomo interativo' },
  { id: 'teoria',      label: 'Teoria',      Icon: IconTheory,       description: 'Teoria musical' },
];

function Loader() {
  return (
    <div className={styles.loader}>
      <div className={styles.loaderSpinner} />
      <span>Carregando...</span>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('piano');
  const [menuOpen, setMenuOpen] = useState(false);

  const currentTab = TABS.find(t => t.id === activeTab);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <IconPiano size={20} />
          <span className={styles.logoText}>musical<span className={styles.logoDot}>.io</span></span>
        </div>

        <nav className={styles.nav}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`${styles.navBtn} ${activeTab === tab.id ? styles.navActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
              title={tab.description}
            >
              <tab.Icon size={16} />
              <span className={styles.navLabel}>{tab.label}</span>
            </button>
          ))}
        </nav>

        <button
          className={styles.menuToggle}
          onClick={() => setMenuOpen(m => !m)}
          aria-label="Menu"
        >
          {menuOpen
            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6"  x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          }
        </button>
      </header>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`${styles.mobileNavBtn} ${activeTab === tab.id ? styles.mobileNavActive : ''}`}
              onClick={() => { setActiveTab(tab.id); setMenuOpen(false); }}
            >
              <tab.Icon size={18} />
              <span>{tab.label}</span>
              <span className={styles.mobileDesc}>{tab.description}</span>
            </button>
          ))}
        </div>
      )}

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <span className={styles.pageIcon}>{currentTab && <currentTab.Icon size={26} />}</span>
          <div>
            <h1 className={styles.pageTitle}>{currentTab?.label}</h1>
            <p className={styles.pageDesc}>{currentTab?.description}</p>
          </div>
        </div>

        <div className={styles.content}>
          <Suspense fallback={<Loader />}>
            {activeTab === 'piano'       && <PianoFree />}
            {activeTab === 'acordes'     && <ChordBuilder />}
            {activeTab === 'escalas'     && <ScaleExplorer />}
            {activeTab === 'progressoes' && <Progressions />}
            {activeTab === 'metronomo'   && <Metronome />}
            {activeTab === 'teoria'      && <Theory />}
          </Suspense>
        </div>
      </main>

      <footer className={styles.footer}>
        <span>Musical.io — Teoria Musical Interativa</span>
      </footer>
    </div>
  );
}
