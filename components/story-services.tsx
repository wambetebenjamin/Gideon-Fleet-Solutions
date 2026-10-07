'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Box, CheckCircle2, ChevronRight, Container, Plane, Snowflake, Truck, Warehouse } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const beats = [
  { title: 'A pickup with a plan.', place: '01 / COLLECTION', body: 'We collect from your warehouse or loading bay with the right vehicle, clear timing, and a waybill that stays with the load.', note: 'Collection point · Nairobi' },
  { title: 'Every load finds its lane.', place: '02 / NAIROBI HUB', body: 'At the Nairobi hub, consignments are checked, sorted, secured, and matched to the next leg before the vehicle rolls.', note: 'Sort & load · Nairobi hub' },
  { title: 'Across borders, with care.', place: '03 / REGIONAL TRANSIT', body: 'Our operations team coordinates route handoffs and clearance support, keeping customers informed while freight moves across the region.', note: 'Cross-border · East Africa' },
  { title: 'Right to the recipient.', place: '04 / LAST MILE', body: 'The final handover is part of the journey. We confirm the delivery point, update the waybill, and close the loop with your team.', note: 'Final handover · On site' },
];

const services = [
  { icon: Truck, title: 'Road Freight', body: 'Reliable full and part loads between city hubs, ports, and regional routes.', number: '01' },
  { icon: Plane, title: 'Air Freight Connections', body: 'Coordinated airport collections and time-sensitive connections for priority cargo.', number: '02' },
  { icon: Box, title: 'Last-Mile Delivery', body: 'Flexible delivery runs for e-commerce, retail, and business-to-business orders.', number: '03' },
  { icon: Snowflake, title: 'Refrigerated Transport', body: 'Temperature-aware handling for perishable and chilled consignments.', number: '04' },
  { icon: Container, title: 'Customs Clearance', body: 'Practical document coordination for cross-border movement and border handovers.', number: '05' },
  { icon: Warehouse, title: 'Fleet Leasing', body: 'Short- and long-term vehicle capacity for teams that need room to scale.', number: '06' },
];

export function StoryServices() {
  const [active, setActive] = useState(0);
  const storyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = storyRef.current;
    if (!root || !('IntersectionObserver' in window)) return;
    const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-story-beat]'));
    const observer = new IntersectionObserver((entries) => {
      const candidate = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (candidate) setActive(Number((candidate.target as HTMLElement).dataset.storyBeat));
    }, { rootMargin: '-34% 0px -42% 0px', threshold: [0.1, 0.25, 0.45, 0.65] });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className="story-section section-shell" id="story" aria-labelledby="story-title">
        <div className="story-pattern" aria-hidden="true"><span /><span /><span /></div>
        <div className="container">
          <div className="section-heading section-heading--story">
            <span className="eyebrow eyebrow--orange">One connected journey</span>
            <h2 id="story-title">From first pickup to <em>final mile.</em></h2>
            <p>Freight is a sequence of handoffs. We make every leg feel like part of one well-run route.</p>
          </div>
          <div className="story-layout" ref={storyRef}>
            <div className="story-visual-sticky" aria-hidden="true">
              <div className={`story-photo story-photo--${active + 1}`}>
                <Image src={active === 3 ? '/images/nairobi-last-mile.jpg' : active === 0 ? '/images/tanzania-freight-road.jpg' : '/images/tanzania-highway-truck.jpg'} alt="" width={500} height={333} loading="lazy" />
                <span className="story-image-shade" />
                <div className="story-location-tag"><span className="map-status-dot" /> {beats[active]?.note}</div>
                <svg className="story-path-overlay" viewBox="0 0 450 260"><path d="M35 221C92 199 93 139 167 157s84 57 127 10 58-82 119-124" /><circle cx="35" cy="221" r="5" /><circle cx="413" cy="43" r="5" /></svg>
                <div className="story-step-counter"><span>0{active + 1}</span><i /> 0{beats.length}</div>
                <span className="story-visual-word">ON THE<br />MOVE</span>
              </div>
            </div>
            <div className="story-beats">
              {beats.map((beat, index) => (
                <article key={beat.place} className={`story-beat ${active === index ? 'is-active' : ''}`} data-story-beat={index}>
                  <span className="story-beat__number">{beat.place}</span>
                  <h3>{beat.title}</h3>
                  <p>{beat.body}</p>
                  <span className="story-beat__route"><CheckCircle2 size={14} aria-hidden="true" /> {beat.note}</span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="services-section section-shell" id="services" aria-labelledby="services-title">
        <div className="services-pattern" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="container">
          <div className="services-topline"><span className="eyebrow eyebrow--orange">Our services</span><Link href="/#quote" className="text-link">Build a delivery plan <ArrowUpRight size={15} /></Link></div>
          <div className="section-heading section-heading--services"><h2 id="services-title">The right move for <em>every load.</em></h2><p>From a single parcel to a full truckload, choose the support your business needs today — and the capacity to grow tomorrow.</p></div>
          <div className="services-grid">
            {services.map((service) => {
              const Icon = service.icon;
              return <Link className="service-card" href="/#quote" key={service.number}>
                <div className="service-card__top"><span className="service-card__icon"><Icon size={22} strokeWidth={1.6} aria-hidden="true" /></span><span className="service-card__number">{service.number}</span></div>
                <h3>{service.title}</h3>
                <p>{service.body}</p>
                <span className="service-card__more">Explore service <ChevronRight size={15} aria-hidden="true" /></span>
              </Link>;
            })}
          </div>
        </div>
      </section>
    </>
  );
}
