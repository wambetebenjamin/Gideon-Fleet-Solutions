'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Box, Map, Truck } from 'lucide-react';
import { PointerEvent, useEffect, useRef, useState } from 'react';
import { GooeyBlob } from '@/components/gooey-blob';
import { WordmarkGraphic } from '@/components/brand-mark';

const effects = [
  { id: 'route', title: 'Routes that connect', note: 'Quiet line-art route motion.' },
  { id: 'wordmark', title: 'A name on the move', note: 'Our wordmark, drawn from the road.' },
  { id: 'morph', title: 'One shipment, many shapes', note: 'Parcel to vehicle to destination.' },
  { id: 'driver', title: 'People move freight', note: 'A wave from the Gideon crew.' },
  { id: 'container', title: 'Capacity, made visible', note: 'A container built from simple layers.' },
  { id: 'collage', title: 'Grounded in the region', note: 'Roads, yards, and real journeys.' },
  { id: 'goo', title: 'A little room to move', note: 'A bounded liquid transition.' },
  { id: 'warehouse', title: 'Ready at the hub', note: 'The warehouse assembles as you arrive.' },
  { id: 'doodle', title: 'A route takes shape', note: 'Hand-drawn marks guide the way.' },
  { id: 'sprite', title: 'Loading in progress', note: 'A small stop-motion dispatch.' },
];

function useOnceVisible<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!('IntersectionObserver' in window)) { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

function WordmarkCard() {
  const { ref, visible } = useOnceVisible<HTMLDivElement>();
  return <div className="effect-visual effect-wordmark" ref={ref}>{visible ? <WordmarkGraphic className="effect-wordmark-svg" storageKey="gideon-fleet-gallery-wordmark" /> : <span className="wordmark-placeholder">GIDEON</span>}<small>FLEET SOLUTIONS</small></div>;
}

function MorphIcon() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const reducedMotionRef = useRef(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      reducedMotionRef.current = query.matches;
      setReducedMotion(query.matches);
      if (query.matches) svgRef.current?.pauseAnimations();
    };
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const start = () => {
    if (reducedMotionRef.current) return;
    const svg = svgRef.current;
    const animation = svg?.querySelector('animate');
    if (animation && 'beginElement' in animation) (animation as SVGAnimateElement).beginElement();
    svg?.unpauseAnimations();
  };
  const stop = () => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.pauseAnimations();
    svg.setCurrentTime(0);
  };
  const shapes = [
    'M50 14 C66 14 82 27 82 42 C82 59 67 75 50 75 C33 75 18 59 18 42 C18 27 34 14 50 14 C50 14 50 14 50 14 C50 14 50 14 50 14 C50 14 50 14 50 14 Z',
    'M16 38 C16 32 20 28 26 28 C36 28 47 28 57 28 C61 28 62 33 62 39 C62 42 64 43 68 43 C74 43 78 45 81 50 C84 54 86 59 86 63 C86 68 82 71 77 71 C70 71 64 71 57 71 C45 71 33 71 25 71 C19 71 16 67 16 62 C16 54 16 45 16 38 C16 38 16 38 16 38 C16 38 16 38 16 38 Z',
    'M50 10 C68 10 82 24 82 42 C82 57 68 75 57 86 C54 89 52 91 50 91 C48 91 46 89 43 86 C32 75 18 57 18 42 C18 24 32 10 50 10 C50 10 50 10 50 10 C50 10 50 10 50 10 Z',
  ];
  return <svg ref={svgRef} viewBox="0 0 100 100" aria-hidden="true" onPointerEnter={start} onPointerLeave={stop} onFocus={start} onBlur={stop} tabIndex={0}>
    <path d={shapes[0]} fill="#fdae5c">{!reducedMotion && <animate attributeName="d" dur="3.6s" repeatCount="indefinite" values={shapes.join(';')} />}</path>
    <circle cx="50" cy="45" r="8" fill="#fffaf1" className="morph-center" />
    <path d="M18 78h64" stroke="#001D38" strokeWidth="3" strokeLinecap="round" />
  </svg>;
}

export function DriverMascot() {
  return <svg className="driver-mascot" viewBox="0 0 170 145" aria-hidden="true" focusable="false">
    <ellipse cx="84" cy="130" rx="52" ry="7" fill="#d9e5e3" />
    <path d="M45 70h74v48H45z" fill="#ff5e13" stroke="#001D38" strokeWidth="3" />
    <path d="M58 78h49v24H58z" fill="#fff4df" />
    <path d="M57 103h51v16H57z" fill="#001D38" />
    <circle cx="84" cy="43" r="22" fill="#8e5637" stroke="#001D38" strokeWidth="3" />
    <path d="M61 42c2-21 40-31 48-7-12-6-29-9-48 7Z" fill="#001D38" />
    <path d="M67 51c9 4 22 4 33 0" stroke="#fff0d8" strokeWidth="2" strokeLinecap="round" />
    <circle cx="77" cy="43" r="2" fill="#001D38" /><circle cx="92" cy="43" r="2" fill="#001D38" />
    <path className="mascot-arm" d="M118 80c10-8 12-20 10-31" stroke="#8e5637" strokeWidth="9" strokeLinecap="round" />
    <path className="mascot-hand" d="M126 49c-8-8 2-16 7-8 1-10 12-7 9 1 8-5 12 4 4 9" fill="#8e5637" stroke="#001D38" strokeWidth="2" strokeLinecap="round" />
    <circle cx="54" cy="121" r="10" fill="#001D38" /><circle cx="112" cy="121" r="10" fill="#001D38" />
    <circle cx="54" cy="121" r="4" fill="#fdae5c" /><circle cx="112" cy="121" r="4" fill="#fdae5c" />
  </svg>;
}

function ContainerArt() {
  const ref = useRef<HTMLDivElement>(null);
  const tilt = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const rx = ((event.clientY - rect.top) / rect.height - 0.5) * -7;
    const ry = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
    ref.current?.style.setProperty('--tilt-x', `${rx}deg`);
    ref.current?.style.setProperty('--tilt-y', `${ry}deg`);
  };
  const reset = () => {
    ref.current?.style.setProperty('--tilt-x', '0deg');
    ref.current?.style.setProperty('--tilt-y', '0deg');
  };
  return <div className="container-art-stage" onPointerMove={tilt} onPointerLeave={reset}>
    <div ref={ref} className="container-art" aria-hidden="true">
      <span className="container-face container-face--front">{Array.from({ length: 7 }, (_, i) => <i key={i} />)}</span>
      <span className="container-face container-face--side"><i /><i /><i /></span>
      <span className="container-face container-face--top" />
      <span className="container-art-label">GFS · CARGO</span>
    </div>
  </div>;
}

function WarehouseArt() {
  const { ref, visible } = useOnceVisible<HTMLDivElement>();
  return <div className={`warehouse-art ${visible ? 'is-assembled' : ''}`} ref={ref} role="img" aria-label="Isometric warehouse assembles piece by piece">
    <div className="iso-scene">
      <div className="iso-floor" />
      <div className="iso-wall iso-wall--back" />
      <div className="iso-wall iso-wall--side" />
      <div className="iso-roof" />
      <div className="iso-door" />
      <div className="iso-window" />
      <div className="iso-box iso-box--a" /><div className="iso-box iso-box--b" /><div className="iso-box iso-box--c" />
      <div className="iso-pallet" />
    </div>
  </div>;
}

function DoodleArt() {
  return <svg className="doodle-art" viewBox="0 0 260 150" role="img" aria-label="Hand-drawn route arrows and truck sketch">
    <path className="doodle-route" d="M23 113C57 79 81 123 110 93s47-62 79-39 35 55 52 29" />
    <path className="doodle-arrow" d="m229 72 13 10-16 7" />
    <path className="doodle-truck" d="M56 72h56v28H56zM112 82h23l15 18h-38zM66 101a8 8 0 1 0 16 0 8 8 0 0 0-16 0Zm59 0a8 8 0 1 0 16 0 8 8 0 0 0-16 0Z" />
    <path className="doodle-road-mark" d="M200 24h17M200 31h17M29 35h14M29 42h14" />
    <circle cx="181" cy="116" r="3" /><circle cx="26" cy="74" r="2" />
  </svg>;
}

function EffectVisual({ id }: { id: string }) {
  const { ref, visible } = useOnceVisible<HTMLDivElement>();
  const [playing, setPlaying] = useState(false);
  return (
    <div className={`effect-visual effect-visual--${id} ${visible ? 'is-visible' : ''}`} ref={ref} onMouseEnter={() => setPlaying(true)} onMouseLeave={() => setPlaying(false)} onFocus={() => setPlaying(true)} onBlur={() => setPlaying(false)}>
      {id === 'route' && <svg viewBox="0 0 280 150" role="img" aria-label="Delivery route animation">
        <path className="route-map-roads" d="M0 38C55 42 68 103 115 93s69-68 118-52 33 48 54 58M-4 118c52-17 86-20 106-47s56-16 78 3 53 32 104 3M46-6c9 35-10 61 15 96s15 46 9 65M206-2c-4 38 18 59 12 91s-2 44 12 65" />
        <path className="route-map-line" d="M44 105C82 100 84 77 125 75s54 19 77-4 17-35 34-38" />
        <circle className="route-map-pulse" cx="44" cy="105" r="7" /><circle className="route-map-destination" cx="236" cy="33" r="6" />
        <Truck className="route-map-truck" x={118} y={54} size={19} strokeWidth={1.7} />
      </svg>}
      {id === 'wordmark' && <WordmarkCard />}
      {id === 'morph' && <MorphIcon />}
      {id === 'driver' && <div className="mascot-wrap"><DriverMascot /></div>}
      {id === 'container' && <ContainerArt />}
      {id === 'collage' && <div className="route-collage" aria-hidden="true">
        <Image src="/images/tanzania-freight-road.jpg" alt="" width={500} height={333} loading="lazy" />
        <span className="collage-road collage-road--one" /><span className="collage-road collage-road--two" /><span className="collage-grain" />
        <span className="collage-caption"><Map size={12} /> TANZANIA · ROUTE 04</span>
      </div>}
      {id === 'goo' && <GooeyBlob id="gallery-goo" className={playing ? 'is-playing' : ''} />}
      {id === 'warehouse' && <WarehouseArt />}
      {id === 'doodle' && <DoodleArt />}
      {id === 'sprite' && <div className="sprite-scene" role="img" aria-label="Stop-motion truck loading boxes"><span className="sprite-truck" /><span className="sprite-label">PACK · SECURE · GO</span></div>}
    </div>
  );
}

export function EffectsGallery() {
  return (
    <section className="effects-section section-shell" id="approach" aria-labelledby="effects-title">
      <div className="container">
        <div className="effects-heading section-heading section-heading--split">
          <div><span className="eyebrow eyebrow--orange">How we work</span><h2 id="effects-title">Small details. <em>Long distances.</em></h2></div>
          <p>A fleet is more than vehicles. It’s people, planning, and a promise that every delivery matters.</p>
        </div>
        <div className="effects-grid">
          {effects.map((effect, index) => (
            <article className={`effect-card effect-card--${effect.id}`} key={effect.id} tabIndex={0} aria-labelledby={`effect-title-${effect.id}`}>
              <div className="effect-card__visual"><EffectVisual id={effect.id} /></div>
              <div className="effect-card__text"><div className="effect-card__title-row"><span className="effect-card__index">0{index + 1}</span><h3 id={`effect-title-${effect.id}`}>{effect.title}</h3><ArrowUpRight className="effect-card__arrow" size={15} aria-hidden="true" /></div><p>{effect.note}</p></div>
            </article>
          ))}
        </div>
        <div className="effects-footnote"><span className="effects-footnote__icon"><Box size={17} /></span><p>Designed for real loads, regional routes, and the next delivery waiting to happen.</p><Link href="/#quote" className="text-link">Let’s move <ArrowUpRight size={14} /></Link></div>
      </div>
    </section>
  );
}
