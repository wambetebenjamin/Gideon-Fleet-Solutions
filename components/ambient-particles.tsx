'use client';

import { useEffect, useState } from 'react';

const particles = [
  { x: '4%', y: '17%', delay: '-4s', size: 7 }, { x: '12%', y: '62%', delay: '-9s', size: 4 },
  { x: '22%', y: '28%', delay: '-12s', size: 5 }, { x: '37%', y: '77%', delay: '-2s', size: 6 },
  { x: '48%', y: '14%', delay: '-11s', size: 4 }, { x: '61%', y: '64%', delay: '-7s', size: 7 },
  { x: '72%', y: '24%', delay: '-3s', size: 5 }, { x: '84%', y: '76%', delay: '-14s', size: 4 },
  { x: '93%', y: '34%', delay: '-5s', size: 6 }, { x: '32%', y: '43%', delay: '-15s', size: 3 },
  { x: '78%', y: '52%', delay: '-8s', size: 3 }, { x: '54%', y: '86%', delay: '-1s', size: 4 },
];

export function AmbientParticles() {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const update = () => setPaused(document.visibilityState !== 'visible');
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  return (
    <div className={`ambient-particles ${paused ? 'is-paused' : ''}`} aria-hidden="true">
      {particles.map((particle, index) => (
        <span
          key={index}
          style={{ '--x': particle.x, '--y': particle.y, '--delay': particle.delay, '--particle-size': `${particle.size}px` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
