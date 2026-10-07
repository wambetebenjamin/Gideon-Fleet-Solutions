import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Gideon Fleet Solutions handles shipment, location, driver, and website data in line with Kenya’s Data Protection Act, 2019.',
};

const sections = [
  ['shipment-data', 'Shipment Data'],
  ['gps-tracking-data', 'GPS Tracking Data'],
  ['driver-data', 'Driver Data'],
  ['analytics-partners', 'Analytics Partners'],
  ['your-rights', 'Your Rights'],
  ['data-retention', 'Data Retention'],
  ['contact', 'Contact'],
];

export default function PrivacyPolicyPage() {
  return (
    <div className="subpage-main legal-page">
      <div className="container legal-hero"><Link href="/"><ArrowLeft size={15} /> Back to home</Link><span className="eyebrow eyebrow--orange">Legal / 01</span><h1>Privacy <em>Policy.</em></h1><p>Last reviewed: 7 October 2026</p></div>
      <div className="container legal-layout">
        <aside className="legal-nav"><span>ON THIS PAGE</span>{sections.map(([id, label]) => <a href={`#${id}`} key={id}>{label}<ArrowUpRight size={12} /></a>)}</aside>
        <article className="legal-content">
          <p className="legal-lead">Gideon Fleet Solutions respects your privacy. This policy explains how we collect and use information when you request freight services, track a shipment, contact our team, or apply to join our fleet network. We handle personal data in accordance with the Kenya Data Protection Act, 2019 and applicable regulations.</p>
          <section id="shipment-data"><span className="legal-section-number">01</span><h2>Shipment Data</h2><p>When you request a quote, book a service, or use a waybill, we may collect contact details, origin and destination, cargo description, weight and volume, delivery instructions, proof-of-delivery details, and communications with our operations team. We use this information to prepare quotations, coordinate transport, provide updates, complete delivery, handle queries, and meet contractual or legal obligations.</p><p>Please do not submit sensitive personal information that is not necessary to arrange the shipment. We may share relevant shipment details with drivers, carriers, customs agents, insurers, and delivery partners only to coordinate the requested service.</p></section>
          <section id="gps-tracking-data"><span className="legal-section-number">02</span><h2>GPS Tracking Data</h2><p>For active deliveries, vehicle location and route progress may be used to provide shipment updates, plan handovers, protect cargo, and respond to operational issues. Access to live location is limited to authorised operations staff and service partners who need it for the journey. Location information is not used to track visitors to this website.</p></section>
          <section id="driver-data"><span className="legal-section-number">03</span><h2>Driver Data</h2><p>Driver and fleet-partner applications may include a name, contact details, vehicle information, driving history, driving licence, vehicle logbook, and related correspondence. Application documents are intended for secure review by our fleet team. They are not displayed publicly. Do not upload documents belonging to another person unless you are authorised to do so.</p></section>
          <section id="analytics-partners"><span className="legal-section-number">04</span><h2>Analytics Partners</h2><p>We may use essential hosting and security services, Google reCAPTCHA to help prevent abuse, Google Maps to display map content, and analytics tools only when enabled through your cookie preferences. These providers may process technical information such as browser, device, and request data under their own privacy terms. Optional analytics and marketing cookies remain off unless you consent.</p><p>Our cookie controls allow you to revisit preferences. See the <Link href="/legal/cookie-policy">Cookie Policy</Link> for the categories used on this site.</p></section>
          <section id="your-rights"><span className="legal-section-number">05</span><h2>Your Rights</h2><p>Subject to applicable law, you may request access to your personal data, correction of inaccurate information, deletion where appropriate, restriction or objection to certain processing, or a copy of information you provided. You may also withdraw consent where processing is based on consent. We may need to verify your identity and may retain information required for an active contract or legal obligation.</p><p>To make a request or raise a concern, contact us using the details below. You may also contact the Office of the Data Protection Commissioner in Kenya.</p></section>
          <section id="data-retention"><span className="legal-section-number">06</span><h2>Data Retention</h2><p>We keep information for as long as it is needed to provide the requested service, maintain shipment and financial records, resolve disputes, meet statutory requirements, and protect our legitimate business interests. Retention periods depend on the data type and legal requirements. When information is no longer needed, we take reasonable steps to delete or securely anonymise it.</p></section>
          <section id="contact"><span className="legal-section-number">07</span><h2>Contact</h2><p>For privacy questions or data requests, contact Gideon Fleet Solutions, Nairobi, Kenya.</p><p><a href="mailto:hello@gideonfleet.co.ke">hello@gideonfleet.co.ke</a><br /><a href="tel:+254112272061">+254 112 272 061</a></p><p className="legal-small-print">This policy describes intended website and service practices and should be reviewed by Gideon Fleet Solutions’ privacy representative and Kenyan counsel before production use.</p></section>
        </article>
      </div>
    </div>
  );
}
