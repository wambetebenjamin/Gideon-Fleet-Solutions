import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How Gideon Fleet Solutions uses necessary and optional cookies on this website.',
};

export default function CookiePolicyPage() {
  return (
    <div className="subpage-main legal-page">
      <div className="container legal-hero"><Link href="/"><ArrowLeft size={15} /> Back to home</Link><span className="eyebrow eyebrow--orange">Legal / 03</span><h1>Cookie <em>Policy.</em></h1><p>Last reviewed: 7 October 2026</p></div>
      <div className="container legal-layout"><aside className="legal-nav"><span>ON THIS PAGE</span><a href="#cookie-categories">Cookie categories<ArrowUpRight size={12} /></a><a href="#manage-preferences">Manage your preferences<ArrowUpRight size={12} /></a><a href="#third-party-services">Third-party services<ArrowUpRight size={12} /></a><a href="#cookie-contact">Contact<ArrowUpRight size={12} /></a></aside><article className="legal-content">
        <p className="legal-lead">Cookies and similar technologies help this site work, remember your choices, protect forms from abuse, and—only when you choose—help us understand how the site is used.</p>
        <section id="cookie-categories"><span className="legal-section-number">01</span><h2>Cookie categories</h2><p><strong>Necessary</strong> cookies support basic functions such as remembering your privacy choice and maintaining a secure site. They are always on.</p><p><strong>Functional</strong> cookies can remember preferences such as shipment lookups. <strong>Analytics</strong> cookies help measure site use. <strong>Marketing</strong> cookies may support relevant communications. Optional categories remain off until you give consent.</p></section>
        <section id="manage-preferences"><span className="legal-section-number">02</span><h2>Manage your preferences</h2><p>You can accept all categories, keep only necessary cookies, or choose optional categories using the site banner. Your selection is stored in this browser. You can clear local storage or browser cookies to reset it, then make a new choice.</p><Link className="button button--primary" href="/?cookie-settings=open">Review cookie preferences</Link></section>
        <section id="third-party-services"><span className="legal-section-number">03</span><h2>Third-party services</h2><p>Google reCAPTCHA may process technical data to reduce spam and abuse when you use a form. Google Maps may load map content when a map is displayed. Optional analytics or marketing services will be enabled only after consent and will be listed here before launch.</p></section>
        <section id="cookie-contact"><span className="legal-section-number">04</span><h2>Contact</h2><p>Questions about cookies or personal data? Read our <Link href="/legal/privacy-policy">Privacy Policy</Link> or contact <a href="mailto:hello@gideonfleet.co.ke">hello@gideonfleet.co.ke</a>.</p></section>
      </article></div>
    </div>
  );
}
