import Link from 'next/link';
import { ArrowUpRight, MapPin, PhoneCall, Route, Truck } from 'lucide-react';
import { BrandMark } from '@/components/brand-mark';
import { NewsletterForm } from '@/components/forms';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top container">
        <div className="footer-brand-column">
          <BrandMark compact />
          <p>Freight, last-mile delivery, and fleet management for the people moving East Africa forward.</p>
          <a className="footer-contact-link" href="https://wa.me/254112272061" target="_blank" rel="noreferrer"><PhoneCall size={16} aria-hidden="true" /> +254 112 272 061</a>
          <a className="footer-contact-link" href="https://maps.google.com/?q=Nairobi,+Kenya" target="_blank" rel="noreferrer"><MapPin size={16} aria-hidden="true" /> Nairobi, Kenya</a>
        </div>
        <div className="footer-links-column">
          <h2>Services</h2>
          <Link href="/#services">Road freight <ArrowUpRight size={13} /></Link>
          <Link href="/#services">Last-mile delivery <ArrowUpRight size={13} /></Link>
          <Link href="/#services">Cold-chain transport <ArrowUpRight size={13} /></Link>
          <Link href="/#services">Customs clearance <ArrowUpRight size={13} /></Link>
        </div>
        <div className="footer-links-column">
          <h2>Explore</h2>
          <Link href="/tracking"><Route size={14} /> Track a shipment</Link>
          <Link href="/fleet"><Truck size={14} /> Fleet solutions</Link>
          <Link href="/news">News & updates</Link>
          <Link href="/#contact">Contact operations</Link>
        </div>
        <div className="footer-newsletter-column">
          <h2>From the road</h2>
          <p>Get practical route notes and fleet updates — no noise, just useful dispatches.</p>
          <NewsletterForm />
        </div>
      </div>
      <div className="footer-bottom container">
        <p>© {new Date().getFullYear()} Gideon Fleet Solutions. Nairobi, Kenya.</p>
        <nav aria-label="Legal links"><Link href="/legal/privacy-policy">Privacy Policy</Link><Link href="/legal/terms">Terms</Link><Link href="/legal/cookie-policy">Cookie Policy</Link></nav>
        <span className="footer-route-mark" aria-hidden="true">NAI <i>→</i> E.A.</span>
      </div>
    </footer>
  );
}
