import { ArrowRight, BadgeCheck, ClipboardCheck, Globe2, ShieldCheck } from 'lucide-react';
import { QuoteForm, PartnerForm } from '@/components/forms';
import { DriverMascot } from '@/components/effects-gallery';

export function QuoteSection() {
  return (
    <section className="quote-section section-shell" id="quote" aria-labelledby="quote-title">
      <div className="container quote-grid">
        <div className="quote-copy">
          <span className="eyebrow eyebrow--light">Plan the next move</span>
          <h2 id="quote-title">Tell us what’s <em>on the move.</em></h2>
          <p>Share your route and cargo details. Our team will come back with a practical freight quote and the right capacity for your delivery.</p>
          <div className="quote-assurances">
            <div><span><ShieldCheck size={17} /></span><p><strong>Careful by design</strong><small>Clear handling from dispatch through delivery.</small></p></div>
            <div><span><ClipboardCheck size={17} /></span><p><strong>One reference to follow</strong><small>Your request and updates stay connected.</small></p></div>
            <div><span><Globe2 size={17} /></span><p><strong>Built for East Africa</strong><small>Regional routes, local knowledge.</small></p></div>
          </div>
          <div className="quote-promise"><BadgeCheck size={16} /> A real response from our Nairobi operations team.</div>
        </div>
        <QuoteForm />
      </div>
    </section>
  );
}

export function PartnerSection() {
  return (
    <section className="partner-section section-shell" id="partners" aria-labelledby="partner-title">
      <div className="container">
        <div className="partner-cta-band">
          <div className="partner-cta-copy"><span className="eyebrow eyebrow--light">Join the network</span><h2 id="partner-title">Good roads are built <em>together.</em></h2><p>Join the Gideon Fleet Network as a driver or owner. Bring your experience; we’ll bring dependable work and a team to back you.</p><a className="button button--light" href="#partner-application">Apply to join <ArrowRight size={16} /></a></div>
          <div className="partner-cta-art"><span className="partner-orbit partner-orbit--one" /><span className="partner-orbit partner-orbit--two" /><DriverMascot /><span className="partner-wave-note">See you on the road <i>↗</i></span></div>
          <span className="partner-cta-route" aria-hidden="true">ROUTE / 06 · NETWORK</span>
        </div>
        <div className="partner-form-grid" id="partner-application"><div className="partner-form-copy"><span className="eyebrow eyebrow--orange">Apply to partner</span><h3>A partnership that <em>keeps moving.</em></h3><p>Share a few details about you and your vehicle. Our fleet team will review the application and follow up.</p><div className="partner-benefits"><span><i /> Flexible route opportunities</span><span><i /> Clear dispatch communication</span><span><i /> Regional support team</span></div></div><PartnerForm /></div>
      </div>
    </section>
  );
}
