'use client';

import { useEffect, useState } from 'react';
import { WordmarkGraphic } from '@/components/brand-mark';

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [skipVisible, setSkipVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [announceLoaded, setAnnounceLoaded] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(query.matches);
    const start = performance.now();
    const duration = 1180;
    const ticker = window.setInterval(() => {
      const next = Math.min(100, Math.round(((performance.now() - start) / duration) * 100));
      setProgress(next);
      if (next >= 100) {
        window.clearInterval(ticker);
        setAnnounceLoaded(true);
        window.setTimeout(() => setVisible(false), 180);
      }
    }, 48);
    const skipTimer = window.setTimeout(() => setSkipVisible(true), 3000);
    return () => {
      window.clearInterval(ticker);
      window.clearTimeout(skipTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="preloader" aria-hidden="false">
      {skipVisible && <button className="preloader-skip" type="button" onClick={() => { setAnnounceLoaded(true); setVisible(false); }}>Skip intro</button>}
      <div className="preloader-inner">
        <WordmarkGraphic className="preloader-wordmark" />
        <div className="preloader-truck" aria-hidden="true">
          <svg viewBox="0 0 148 48" role="presentation">
            <path d="M7 13h82v23H7z" fill="currentColor" />
            <path d="M89 21h24l21 16H89z" fill="#FDAE5C" />
            <path d="M97 24h13l12 10H97z" fill="#e4f0f4" />
            <path d="M2 35h137v5H2z" fill="currentColor" />
            <circle cx="34" cy="39" r="8" fill="#001D38" /><circle cx="34" cy="39" r="3" fill="#fff" />
            <circle cx="111" cy="39" r="8" fill="#001D38" /><circle cx="111" cy="39" r="3" fill="#fff" />
            <path d="M15 19h66M16 25h66M16 31h66" stroke="#fff" strokeWidth="2" opacity=".5" />
          </svg>
        </div>
        <div className="preloader-progress" role="progressbar" aria-label="Loading Gideon Fleet Solutions" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
          <span style={{ width: `${progress}%` }} />
        </div>
        {reducedMotion && <span className="preloader-percent">{progress}%</span>}
        <p className="preloader-note">{announceLoaded ? 'Site loaded' : 'Preparing your route'}</p>
      </div>
      <span className="sr-only" role="status" aria-live="polite">{announceLoaded ? 'Site loaded' : 'Loading Gideon Fleet Solutions'}</span>
    </div>
  );
}
