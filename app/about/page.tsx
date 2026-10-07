import type { Metadata } from 'next';
import { AboutSection } from '@/components/about-section';
import { StoryServices } from '@/components/story-services';

export const metadata: Metadata = {
  title: 'About',
  description: 'Meet a Nairobi-based freight, last-mile, and fleet management partner for East African roads.',
};

export default function AboutPage() {
  return <div className="subpage-main about-page"><div className="container subpage-intro"><span className="eyebrow eyebrow--orange">Who we are</span><h1>Nairobi roots. <em>East African reach.</em></h1><p>Freight and fleet solutions shaped around the businesses, people, and roads that connect our region.</p></div><AboutSection /><StoryServices /></div>;
}
