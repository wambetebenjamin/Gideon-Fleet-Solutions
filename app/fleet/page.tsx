import type { Metadata } from 'next';
import { FleetShowcase } from '@/components/fleet-showcase';

export const revalidate = 300;
export const metadata: Metadata = {
  title: 'Fleet Solutions',
  description: 'Choose regional road freight capacity, last-mile delivery vehicles, and refrigerated transport for your business.',
};

export default function FleetPage() {
  return <div className="subpage-main fleet-page"><div className="container subpage-intro"><span className="eyebrow eyebrow--orange">Vehicle capacity</span><h1>A fleet that meets <em>the moment.</em></h1><p>Book a single vehicle, plan a regular route, or talk with our team about dedicated capacity.</p></div><FleetShowcase /></div>;
}
