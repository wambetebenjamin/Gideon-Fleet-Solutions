import type { Metadata } from 'next';
import { ContactSection } from '@/components/contact-section';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact the Gideon Fleet Nairobi operations team about freight, last-mile delivery, or fleet partnerships.',
};

export default function ContactPage() {
  return <div className="subpage-main contact-page"><div className="container subpage-intro"><span className="eyebrow eyebrow--orange">We are here to help</span><h1>Talk with <em>our team.</em></h1><p>Tell us where your freight needs to go. We’ll help plan the next move.</p></div><ContactSection /></div>;
}
