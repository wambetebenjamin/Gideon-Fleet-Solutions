import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms for freight, last-mile delivery, fleet, and related services provided by Gideon Fleet Solutions in Kenya and East Africa.',
};

const sections = [
  ['freight-service-agreement', 'Freight Service Agreement'],
  ['liability-insurance', 'Liability and Insurance'],
  ['payment-terms', 'Payment Terms'],
  ['route-schedule-disclaimer', 'Route and Schedule Disclaimer'],
  ['governing-law-kenya', 'Governing Law Kenya'],
];

export default function TermsPage() {
  return (
    <div className="subpage-main legal-page">
      <div className="container legal-hero"><Link href="/"><ArrowLeft size={15} /> Back to home</Link><span className="eyebrow eyebrow--orange">Legal / 02</span><h1>Terms &amp; <em>Conditions.</em></h1><p>Last reviewed: 7 October 2026</p></div>
      <div className="container legal-layout">
        <aside className="legal-nav"><span>ON THIS PAGE</span>{sections.map(([id, label]) => <a href={`#${id}`} key={id}>{label}<ArrowUpRight size={12} /></a>)}</aside>
        <article className="legal-content">
          <p className="legal-lead">These terms describe the basis on which Gideon Fleet Solutions provides freight, last-mile delivery, fleet, and related logistics services. A written quotation, booking confirmation, or signed service agreement may include route-specific terms that supplement this page. If there is a conflict, the signed agreement for that shipment will apply to the extent permitted by law.</p>
          <section id="freight-service-agreement"><span className="legal-section-number">01</span><h2>Freight Service Agreement</h2><p>A service begins when Gideon Fleet Solutions accepts a booking or confirms a quotation in writing. The customer must provide accurate cargo descriptions, dimensions, weight, collection and delivery addresses, contact details, handling requirements, and any documents needed for the route. Cargo must be safely packed, correctly labelled, and ready at the agreed collection time.</p><p>Additional services such as storage, customs coordination, special handling, or redelivery must be agreed in writing and may incur additional charges.</p></section>
          <section id="liability-insurance"><span className="legal-section-number">02</span><h2>Liability and Insurance</h2><p>Responsibility for loss or damage is determined by the signed service agreement, applicable Kenyan law, and any applicable carriage conventions. Customers should declare the nature and value of goods accurately and arrange cargo insurance appropriate to the goods and journey. Where insurance is arranged through Gideon Fleet Solutions, the cover, exclusions, limits, and claims process will be set out in the applicable written confirmation.</p><p>Nothing in these terms excludes a liability that cannot lawfully be excluded or limited.</p></section>
          <section id="payment-terms"><span className="legal-section-number">03</span><h2>Payment Terms</h2><p>Rates, currency, payment timing, credit terms, taxes, and any surcharges are confirmed in the quotation or service agreement. Unless agreed otherwise in writing, invoices are payable by the due date shown. Late payment may affect future bookings or result in lawful recovery costs. Any disputed invoice should be raised promptly with the operations team and include the relevant reference.</p></section>
          <section id="route-schedule-disclaimer"><span className="legal-section-number">04</span><h2>Route and Schedule Disclaimer</h2><p>Quoted schedules and estimated arrival times are planning estimates, not guarantees, unless a written agreement expressly states otherwise. Traffic, weather, road conditions, border and customs procedures, security events, vehicle restrictions, and other circumstances outside our reasonable control may change a route or delivery window. We will use reasonable efforts to communicate material changes and coordinate the next available handover.</p></section>
          <section id="governing-law-kenya"><span className="legal-section-number">05</span><h2>Governing Law Kenya</h2><p>These terms and any non-contractual obligations arising from them are governed by the laws of Kenya, subject to any mandatory law that applies to a particular shipment. The parties will first try to resolve a service dispute in good faith through their named contacts. Nothing in this paragraph removes a right to bring a claim before a court or authority with proper jurisdiction.</p><p className="legal-small-print">This template is a general summary and should be reviewed by Gideon Fleet Solutions’ Kenyan legal adviser before production use.</p></section>
        </article>
      </div>
    </div>
  );
}
