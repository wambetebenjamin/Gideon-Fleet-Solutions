'use client';

import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { useEffect, useState } from 'react';

const quotes = [
  { quote: 'We know what is moving, who is looking after it, and when it should arrive. That clarity has made our weekly deliveries easier to plan.', firstName: 'Amina', industry: 'Retail' },
  { quote: 'The team understands that a missed handover affects the whole production day. Updates come early, and there is always someone to call.', firstName: 'David', industry: 'Manufacturing' },
  { quote: 'We needed a partner who could keep local deliveries and regional freight in one conversation. The service feels joined up from pickup to proof of delivery.', firstName: 'Njeri', industry: 'E-commerce' },
];

const partnerSectors = ['E-COMMERCE', 'IMPORT & EXPORT', 'MANUFACTURING', 'RETAIL', 'CONSTRUCTION', 'COLD CHAIN'];

export function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(media.matches);
    const change = () => setReduced(media.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % quotes.length), 6000);
    return () => window.clearInterval(timer);
  }, [paused, reduced]);

  const changeQuote = (direction: number) => setActive((current) => (current + direction + quotes.length) % quotes.length);
  const current = quotes[active];

  return (
    <section className="testimonial-section section-shell" aria-labelledby="testimonial-title">
      <div className="container testimonial-grid">
        <div className="testimonial-intro"><span className="eyebrow eyebrow--orange">The people we move for</span><h2 id="testimonial-title">Trust travels <em>both ways.</em></h2><p>Good freight is built on clear communication. Here’s what business teams value in a partner.</p><div className="testimonial-controls"><button type="button" aria-label="Previous testimonial" onClick={() => changeQuote(-1)}><ArrowLeft size={17} /></button><button type="button" aria-label="Next testimonial" onClick={() => changeQuote(1)}><ArrowRight size={17} /></button><span>0{active + 1} <i>/</i> 0{quotes.length}</span></div></div>
        <div className="testimonial-card" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setPaused(false); }}>
          <span className="testimonial-quote-mark"><Quote size={22} fill="currentColor" /></span>
          <p className="testimonial-quote" aria-live="polite" key={active}>{current.quote}</p>
          <div className="testimonial-person"><span className="testimonial-avatar" aria-hidden="true">{current.firstName.charAt(0)}</span><div><strong>{current.firstName}</strong><small>{current.industry}</small></div><span className="testimonial-verified">Illustrative copy</span></div>
          <div className="testimonial-progress" aria-hidden="true"><span style={{ width: `${((active + 1) / quotes.length) * 100}%` }} /></div>
        </div>
      </div>
      <div className="industry-strip"><div className="container industry-strip__inner"><span className="industry-strip__label">Built for teams in</span><div className={`industry-marquee ${paused ? 'is-paused' : ''}`}><div className="industry-track">{[...partnerSectors, ...partnerSectors].map((sector, index) => <span key={`${sector}-${index}`}><i />{sector}</span>)}</div></div></div></div>
      <p className="testimonial-disclaimer container">Client perspectives shown for illustration; verified customer stories can be added with approval.</p>
    </section>
  );
}
