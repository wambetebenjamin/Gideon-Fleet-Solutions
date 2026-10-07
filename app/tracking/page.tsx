import type { Metadata } from 'next';
import { TrackingBoard } from '@/components/tracking-board';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Track Your Shipment',
  description: 'Follow your Gideon Fleet consignment from pickup to delivery across East Africa.',
};

export default function TrackingPage() {
  return <div className="subpage-main tracking-page"><div className="container subpage-intro"><span className="eyebrow eyebrow--orange">Shipment visibility</span><h1>Know where your <em>freight is.</em></h1><p>Use the waybill number on your dispatch note to see the latest shipment update.</p></div><TrackingBoard /></div>;
}
