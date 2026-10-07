import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MapPin, PackageCheck, ShieldCheck } from 'lucide-react';

export function AboutSection() {
  return (
    <section className="about-section section-shell" id="about" aria-labelledby="about-title">
      <div className="container about-grid">
        <div className="about-photo-composition">
          <div className="about-photo-main"><Image src="/images/nairobi-last-mile.jpg" alt="Local delivery riders carrying a parcel through Nairobi" width={1000} height={750} loading="lazy" /><span className="about-photo-caption"><MapPin size={14} /> NAIROBI, KENYA</span></div>
          <div className="about-note-card"><span className="about-note-icon"><RouteIcon /></span><span><strong>One connected route.</strong><small>From collection to final handover.</small></span></div>
          <span className="about-photo-line" aria-hidden="true" />
        </div>
        <div className="about-copy">
          <span className="eyebrow eyebrow--orange">Local knowledge. Regional reach.</span>
          <h2 id="about-title">Moving business forward, <em>one careful handoff at a time.</em></h2>
          <p>Gideon Fleet Solutions is a Nairobi-based transport and logistics partner for the businesses that keep East Africa supplied. We connect road freight, last-mile delivery, fleet support, and route coordination through one dependable operations team.</p>
          <p>From e-commerce orders and retail restocks to construction materials and cross-border cargo, we plan around the load, the road, and the people waiting at the other end.</p>
          <div className="about-value-list"><div><span><PackageCheck size={17} /></span><strong>Visibility that helps</strong><small>Waybill updates and clear handovers.</small></div><div><span><ShieldCheck size={17} /></span><strong>Care through the journey</strong><small>Practical planning for every consignment.</small></div></div>
          <Link className="text-link" href="/#contact">Meet your operations team <ArrowUpRight size={15} /></Link>
        </div>
      </div>
    </section>
  );
}

function RouteIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 15c5-8 7 0 12-9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="2 3"/><circle cx="4" cy="15" r="2" fill="currentColor"/><path d="M13 6h3v3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
