'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, PackageCheck, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';

const HeroTruck = dynamic(() => import('@/components/hero-truck').then((module) => module.HeroTruck), {
  ssr: false,
  loading: () => <div className="hero-truck hero-truck--loading" aria-hidden="true"><div className="truck-loading-mark"><Truck size={52} strokeWidth={1.1} /></div></div>,
});

const headlineWords = ['Move', 'East', 'Africa', 'Forward.'];

// Brand photos that cross-fade behind the hero copy (decorative, so alt text is empty).
const backdropPhotos = [
  '/images/tanzania-freight-road.jpg',
  '/images/rural-east-africa-route.jpg',
  '/images/nairobi-last-mile.jpg',
  '/images/tanzania-highway-truck.jpg',
];

function AnimatedCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setCount(value); return; }
    const start = performance.now();
    let frame = 0;
    const update = (now: number) => {
      const progress = Math.min(1, (now - start) / 850);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.round(value * eased));
      if (progress < 1) frame = window.requestAnimationFrame(update);
    };
    frame = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(frame);
  }, [value]);
  return <>{String(count).padStart(2, '0')}</>;
}

function StaggeredHeadline() {
  let index = 0;
  return (
    <h1 className="hero-title">
      <span className="sr-only">Move East Africa Forward.</span>
      <span className="hero-title__visual" aria-hidden="true">
        {headlineWords.map((word, wordIndex) => (
          <span className="hero-title__word" key={word}>
            {Array.from(word).map((character) => {
              const delay = index++ * 24;
              return <span className="hero-letter" style={{ animationDelay: `${delay}ms` }} key={`${word}-${delay}`}>{character}</span>;
            })}
            {wordIndex < headlineWords.length - 1 && <span className="hero-space">&nbsp;</span>}
          </span>
        ))}
      </span>
    </h1>
  );
}

export function HeroSection() {
  const [enable3D, setEnable3D] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 769px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnable3D(desktop.matches && !reduced.matches);
    update();
    desktop.addEventListener('change', update);
    reduced.addEventListener('change', update);
    return () => {
      desktop.removeEventListener('change', update);
      reduced.removeEventListener('change', update);
    };
  }, []);

  return (
    <section className="hero-section" id="top" aria-labelledby="hero-title">
      <div className="hero-gradient" aria-hidden="true" />
      <div className="hero-photos" aria-hidden="true">
        {backdropPhotos.map((src, index) => (
          <div className="hero-photo" style={{ animationDelay: `${index * 6}s` }} key={src}>
            <Image src={src} alt="" fill sizes="100vw" priority={index === 0} />
          </div>
        ))}
      </div>
      <div className="hero-grid container">
        <div className="hero-copy">
          <div className="hero-kicker">FREIGHT THAT MOVES US <span className="hero-kicker-divider" /> <span className="glitch-word" data-text="FLEET">FLEET</span></div>
          <StaggeredHeadline />
          <p className="hero-subcopy">Freight, last-mile delivery, and fleet management solutions built for East African roads.</p>
          <div className="hero-actions">
            <Link className="button button--primary" href="/#quote">Get a Quote <ArrowUpRight size={17} aria-hidden="true" /></Link>
            <Link className="button button--outline" href="/tracking"><span className="button-icon"><PackageCheck size={17} aria-hidden="true" /></span> Track Your Shipment <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          <div className="hero-proof-row">
            <div className="hero-proof"><span className="live-signal" aria-hidden="true"><i /></span><span><strong aria-hidden="true"><AnimatedCounter value={4} /></strong> core service pillars, one connected plan.<span className="sr-only">Four connected service pillars: road freight, last-mile delivery, fleet support, and route coordination.</span></span></div>
          </div>
          <a className="hero-scroll" href="#story"><span>See how it moves</span><ArrowDown size={15} aria-hidden="true" /></a>
        </div>
        <div className="hero-visual-wrap">
          {enable3D ? <HeroTruck /> : <div className="hero-truck hero-truck--poster hero-truck--static" role="img" aria-label="Freight trucks moving along a rural East African road"><Image className="hero-truck__poster" src="/images/tanzania-freight-road.jpg" alt="" width={500} height={333} priority /></div>}
        </div>
      </div>
    </section>
  );
}
