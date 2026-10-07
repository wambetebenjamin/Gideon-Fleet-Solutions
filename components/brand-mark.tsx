'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'gideon-fleet-wordmark-drawn';
const animationsInProgress = new Set<string>();

type WordmarkGraphicProps = {
  replayToken?: number;
  className?: string;
  compact?: boolean;
  storageKey?: string;
};

export function WordmarkGraphic({ replayToken = 0, className = '', compact = false, storageKey = STORAGE_KEY }: WordmarkGraphicProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>('[data-draw]'));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let persisted = false;
    try { persisted = replayToken === 0 && window.localStorage.getItem(storageKey) === '1'; } catch { /* Keep the logo visible when storage is unavailable. */ }
    const anotherInstanceIsDrawing = animationsInProgress.has(storageKey);
    const shouldDraw = !persisted && !reduced && !anotherInstanceIsDrawing;

    paths.forEach((path, index) => {
      if (!shouldDraw) {
        path.style.strokeDasharray = 'none';
        path.style.strokeDashoffset = '0';
        path.style.transition = 'none';
        return;
      }
      let length = 0;
      try { length = path.getTotalLength(); } catch { length = 0; }
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      path.style.transition = `stroke-dashoffset 620ms cubic-bezier(.2,.75,.2,1) ${index * 55}ms`;
    });

    if (!shouldDraw) {
      if (reduced) {
        try { window.localStorage.setItem(storageKey, '1'); } catch { /* Storage is optional. */ }
      }
      return;
    }

    animationsInProgress.add(storageKey);
    const frame = window.requestAnimationFrame(() => paths.forEach((path) => { path.style.strokeDashoffset = '0'; }));
    const finish = window.setTimeout(() => {
      try { window.localStorage.setItem(storageKey, '1'); } catch { /* Storage is optional. */ }
      animationsInProgress.delete(storageKey);
    }, 1040);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(finish);
      animationsInProgress.delete(storageKey);
    };
  }, [replayToken, storageKey]);

  return (
    <svg
      aria-hidden="true"
      className={`brand-wordmark ${compact ? 'brand-wordmark--compact' : ''} ${className}`}
      ref={svgRef}
      viewBox="0 0 202 50"
      role="presentation"
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.2">
        <path data-draw d="M25 11H14c-4 0-6 2.4-6 6.6v15.8c0 3.7 2.3 6.1 6 6.1h13V27H17" />
        <path data-draw d="M37 11h18M46 11v28M37 39h18" />
        <path data-draw d="M65 11v28h10c10 0 14-5 14-14s-4-14-14-14H65z" />
        <path data-draw d="M99 11h20M99 11v28h20M99 25h16" />
        <path data-draw d="M130 18c0-4.4 2.5-7 7-7h10c4.7 0 7 2.6 7 7v14c0 4.6-2.3 7-7 7h-10c-4.5 0-7-2.4-7-7V18z" />
        <path data-draw d="M164 39V11l22 28V11" />
      </g>
      <text x="2" y="49" className="brand-wordmark__caption">FLEET SOLUTIONS</text>
    </svg>
  );
}

type BrandMarkProps = {
  className?: string;
  compact?: boolean;
};

export function BrandMark({ className = '', compact = false }: BrandMarkProps) {
  const pathname = usePathname();
  const [replayToken, setReplayToken] = useState(0);

  return (
    <Link
      href="/"
      className={`brand-link ${className}`}
      aria-label="Gideon Fleet Solutions Home"
      onClick={(event) => {
        if (pathname === '/') {
          event.preventDefault();
          try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* The logo still replays for this session. */ }
          setReplayToken((token) => token + 1);
        }
      }}
    >
      <WordmarkGraphic replayToken={replayToken} compact={compact} />
      <span className="sr-only">Gideon Fleet Solutions Home</span>
    </Link>
  );
}
