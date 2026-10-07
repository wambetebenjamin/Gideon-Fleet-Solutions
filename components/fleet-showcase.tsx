'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, BarChart3, Check, ChevronLeft, ChevronRight, Clock3, Snowflake, Truck } from 'lucide-react';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';

const vehicles = [
  { type: 'Urban delivery van', capacity: 'Up to 1.5 tonnes', detail: 'Ideal for scheduled shop and home deliveries.', photo: '/images/nairobi-last-mile.jpg', alt: 'Last-mile delivery riders moving through a Nairobi street', refrigerated: false, tone: 'van' },
  { type: 'Pickup & light truck', capacity: 'Up to 3 tonnes', detail: 'Flexible collection for growing businesses.', photo: '/images/tanzania-highway-truck.jpg', alt: 'A freight vehicle on an open East African road', refrigerated: false, tone: 'pickup' },
  { type: 'Medium rigid truck', capacity: 'Up to 7 tonnes', detail: 'A strong fit for planned regional distribution.', photo: '/images/tanzania-freight-road.jpg', alt: 'Freight trucks on a rural road in Tanzania', refrigerated: false, tone: 'rigid' },
  { type: 'Curtainsider', capacity: 'Up to 14 tonnes', detail: 'Fast, practical loading for palletised freight.', photo: '/images/tanzania-freight-road.jpg', alt: 'Regional freight transport moving along a dusty road', refrigerated: false, tone: 'curtain' },
  { type: 'Refrigerated truck', capacity: 'Up to 10 tonnes', detail: 'Temperature-aware capacity for chilled goods.', photo: '/images/tanzania-highway-truck.jpg', alt: 'A long-distance truck travelling a regional highway', refrigerated: true, tone: 'cold' },
  { type: 'Prime mover & trailer', capacity: 'Up to 30 tonnes', detail: 'Reliable line-haul for high-volume consignments.', photo: '/images/tanzania-freight-road.jpg', alt: 'Heavy goods vehicles travelling a rural East African route', refrigerated: false, tone: 'prime' },
];

const volumeBars = [38, 54, 44, 77, 60, 88, 69];

export function FleetDashboard() {
  const [coldTracking, setColdTracking] = useState(true);
  const [clock, setClock] = useState('');
  const availability = 87;

  useEffect(() => {
    const format = () => setClock(new Intl.DateTimeFormat('en-KE', { timeZone: 'Africa/Nairobi', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()));
    format();
    const timer = window.setInterval(format, 30000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <aside className="fleet-dashboard" aria-label="Illustrative fleet operations dashboard">
      <div className="dashboard-heading"><div><span className="eyebrow eyebrow--orange">Illustrative dashboard</span><h3>Fleet status, at a glance.</h3></div><span className="dashboard-live dashboard-live--sample"><i /> SAMPLE DATA</span></div>
      <div className="dashboard-grid">
        <div className="dashboard-availability">
          <div className="availability-ring" style={{ '--availability': `${availability}%` } as React.CSSProperties}><span><strong>{availability}%</strong><small>available</small></span></div>
          <p>Fleet availability</p>
        </div>
        <button className={`dashboard-toggle ${coldTracking ? 'is-on' : ''}`} type="button" aria-pressed={coldTracking} onClick={() => setColdTracking((value) => !value)}>
          <span className="dashboard-toggle__icon"><Snowflake size={18} /></span><span><small>Cold chain</small><strong>{coldTracking ? 'Tracking on' : 'Tracking off'}</strong></span><span className="toggle-track"><i /></span>
        </button>
        <div className="dashboard-clock"><span className="dashboard-small-label"><Clock3 size={14} /> NAIROBI TIME</span><strong>{clock || '08:42'}</strong><small>EAT · UTC+3</small></div>
        <div className="dashboard-chart"><div className="dashboard-chart__top"><span><BarChart3 size={14} /> WEEKLY VOLUME</span><strong>+12.8%</strong></div><div className="bar-chart" aria-label="Weekly delivery volume trend" role="img">{volumeBars.map((bar, index) => <span key={index} style={{ height: `${bar}%` }} className={index === 5 ? 'is-highlighted' : ''}><i /></span>)}</div><div className="bar-labels"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div></div>
      </div>
      <p className="dashboard-footnote">Sample figures only · Nairobi clock updates every 30 seconds; connect the fleet feed before launch</p>
    </aside>
  );
}

export function FleetShowcase() {
  const railRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [coldAvailability, setColdAvailability] = useState(vehicles.map((vehicle) => vehicle.refrigerated));
  const [readingMode, setReadingMode] = useState(false);
  const [page, setPage] = useState(0);
  const flipbookRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReadingMode(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const navigateRail = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const cards = railRef.current?.querySelectorAll<HTMLElement>('.vehicle-card');
    if (!cards?.length) return;
    const focused = Array.from(cards).indexOf(document.activeElement as HTMLElement);
    const next = Math.min(cards.length - 1, Math.max(0, focused + (event.key === 'ArrowRight' ? 1 : -1)));
    cards[next]?.focus();
    cards[next]?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
  };

  const scrollRail = (direction: number) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    railRef.current?.scrollBy({ left: direction * 340, behavior: reduce ? 'auto' : 'smooth' });
  };

  const movePage = (next: number) => setPage((current) => Math.max(0, Math.min(3, current + next)));
  const flipbookKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); movePage(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); movePage(-1); }
  };

  return (
    <section className="fleet-section section-shell" id="fleet" aria-labelledby="fleet-title">
      <div className="container">
        <div className="section-heading section-heading--split fleet-heading">
          <div><span className="eyebrow eyebrow--orange">The right vehicle for the job</span><h2 id="fleet-title">A dependable fleet. <em>Ready for your route.</em></h2></div>
          <p>Choose dedicated capacity, book a single run, or build a regular delivery contract around your busy days.</p>
        </div>
        <div className="fleet-rail-header"><span className="fleet-viewer-label"><Truck size={15} /> Six vehicle types</span><div className="fleet-rail-controls"><button type="button" aria-label="Previous vehicles" onClick={() => scrollRail(-1)}><ArrowLeft size={16} /></button><button type="button" aria-label="Next vehicles" onClick={() => scrollRail(1)}><ArrowRight size={16} /></button></div></div>
        <div className="vehicle-rail" ref={railRef} tabIndex={0} onKeyDown={navigateRail} aria-label="Six vehicle types; use the arrow keys to move between vehicles">
          {vehicles.map((vehicle, index) => (
            <article className={`vehicle-card ${selected === index ? 'is-selected' : ''}`} key={vehicle.type} tabIndex={0} aria-label={`${vehicle.type}, ${vehicle.capacity}`}>
              <div className={`vehicle-image vehicle-image--${vehicle.tone}`}>
                <Image src={vehicle.photo} alt={vehicle.alt} width={500} height={333} loading="lazy" />
                <span className="vehicle-number">0{index + 1}</span><span className="vehicle-image-chip"><i /> ON REQUEST</span>
                <span className="vehicle-icon-badge"><Truck size={17} /></span>
              </div>
              <div className="vehicle-card__body"><div className="vehicle-card__type"><span className="vehicle-overline">GIDEON FLEET</span><h3>{vehicle.type}</h3></div><p className="vehicle-capacity">{vehicle.capacity}</p><p className="vehicle-detail">{vehicle.detail}</p>
                <button type="button" className={`vehicle-cooling ${coldAvailability[index] ? 'is-active' : ''}`} aria-pressed={coldAvailability[index]} onClick={() => { setSelected(index); setColdAvailability((current) => current.map((value, item) => item === index ? !value : value)); }}><Snowflake size={14} /> Refrigeration {coldAvailability[index] ? 'available' : 'not available'} <span>{coldAvailability[index] && <Check size={12} />}</span></button>
                <Link className="vehicle-book-link" href="/#quote">Book This Vehicle <ArrowUpRight size={14} /></Link>
              </div>
            </article>
          ))}
        </div>
        <p className="fleet-availability-note">Vehicle types and capacities are indicative. Operations confirms vehicle and refrigeration availability when you enquire.</p>
        <FleetDashboard />

        <div className="brochure-section">
          <div className="brochure-copy"><span className="eyebrow eyebrow--orange">Take the quick tour</span><h3>Our services, <em>in a few pages.</em></h3><p>Explore the Gideon Fleet service brochure. Turn a page or switch to text reading mode.</p><button type="button" className="brochure-mode-toggle" aria-pressed={readingMode} onClick={() => setReadingMode((value) => !value)}>{readingMode ? 'Open page-flip view' : 'Read as plain text'} <ArrowUpRight size={14} /></button></div>
          <div className={`brochure-viewer ${readingMode ? 'is-reading' : ''}`} ref={flipbookRef} tabIndex={0} onKeyDown={flipbookKeys} aria-label="Gideon Fleet services brochure. Use the arrow keys to turn pages.">
            <div className="brochure-book">
              <div className={`brochure-page brochure-page--left ${page % 2 === 1 && !readingMode ? 'page-turn-back' : ''}`}>
                {page > 0 && <><span className="brochure-page-number">0{page}</span><h4>{['Built around your cargo', 'A route planned well', 'A fleet for every load'][page - 1]}</h4><p>{['Road freight, customs support, and last-mile delivery work together under one plan.', 'From dispatch to handover, our team keeps the next move clear.', 'Vehicle capacity that flexes with the rhythm of your operation.'][page - 1]}</p></>}
              </div>
              <div className={`brochure-page brochure-page--right ${!readingMode ? 'page-turn-front' : ''}`}>
                {page < 3 && <><span className="brochure-page-number">0{page + 1}</span><span className="brochure-page-mark"><Truck size={26} /></span><h4>{['Make room to move', 'Stay close to the route', 'Deliver with confidence'][page]}</h4><p>{['Freight, last-mile, and fleet solutions for businesses across East Africa.', 'Live waybill updates and a Nairobi team ready to support your journey.', 'Talk with our team about a delivery contract built for your business.'][page]}</p></>}
              </div>
            </div>
            {readingMode && <div className="brochure-reading-text"><p><strong>Gideon Fleet Solutions</strong> — freight, last-mile delivery, and fleet management built for East African roads.</p><p>Road freight · Air freight connections · Refrigerated transport · Customs clearance · Fleet leasing</p></div>}
            <div className="brochure-controls"><button type="button" aria-label="Previous brochure page" onClick={() => movePage(-1)} disabled={page === 0}><ChevronLeft size={16} /></button><span className="sr-only" aria-live="polite">Page {page + 1} of 4</span><span aria-hidden="true">0{page + 1} <i>/</i> 04</span><button type="button" aria-label="Next brochure page" onClick={() => movePage(1)} disabled={page === 3}><ChevronRight size={16} /></button></div>
          </div>
          <span className="brochure-key-hint"><ChevronLeft size={12} /><ChevronRight size={12} /> Use arrow keys to turn pages</span>
        </div>
      </div>
    </section>
  );
}
