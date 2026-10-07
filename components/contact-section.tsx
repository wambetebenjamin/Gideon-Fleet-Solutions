import { Clock3, Mail, MapPin, MessageCircle, PhoneCall } from 'lucide-react';
import { ContactForm } from '@/components/forms';

const mapUrl = 'https://maps.google.com/maps?q=Nairobi%20Kenya&t=&z=12&ie=UTF8&iwloc=&output=embed';

export function ContactSection() {
  return (
    <section className="contact-section section-shell" id="contact" aria-labelledby="contact-title">
      <div className="container contact-grid">
        <div className="contact-info">
          <span className="eyebrow eyebrow--orange">Talk to operations</span>
          <h2 id="contact-title">A route, a question, <em>or a quick hello.</em></h2>
          <p>Tell us what needs to move. Our Nairobi team will help you find the right vehicle, route, and delivery plan.</p>
          <div className="contact-details">
            <a href="https://maps.google.com/?q=Nairobi,+Kenya" target="_blank" rel="noreferrer"><span><MapPin size={17} /></span><div><small>Nairobi HQ</small><strong>Nairobi, Kenya</strong></div></a>
            <a href="tel:+254112272061"><span><PhoneCall size={17} /></span><div><small>Call or WhatsApp</small><strong>+254 112 272 061</strong></div></a>
            <a href="mailto:hello@gideonfleet.co.ke"><span><Mail size={17} /></span><div><small>Email operations</small><strong>hello@gideonfleet.co.ke</strong></div></a>
            <div className="contact-hours"><span><Clock3 size={17} /></span><div><small>Operations desk</small><strong>Mon–Sat · 07:00–18:00 EAT</strong></div></div>
          </div>
          <a className="contact-whatsapp-link" href="https://wa.me/254112272061?text=Hello!%20I%20would%20like%20a%20freight%20quote%20from%20Gideon%20Fleet%20Solutions." target="_blank" rel="noreferrer"><MessageCircle size={17} /> Start a WhatsApp conversation</a>
          <div className="contact-map"><iframe src={mapUrl} title="Map showing Nairobi, Kenya" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
        </div>
        <div className="contact-form-wrap"><div className="contact-form-heading"><span className="contact-form-index">GFS / 01</span><h3>Send a message.</h3><p>We usually respond within one business day.</p></div><ContactForm /><span className="contact-privacy-note">Your details stay with Gideon Fleet Solutions and are used only to respond to this enquiry.</span></div>
      </div>
    </section>
  );
}
