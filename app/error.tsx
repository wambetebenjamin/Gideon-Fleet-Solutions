'use client';

import { useEffect } from 'react';
import { ArrowRight, MessageCircle, RefreshCw } from 'lucide-react';
import { GooeyBlob } from '@/components/gooey-blob';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('Gideon Fleet page error'); }, []);
  return (
    <div className="error-page error-page--500">
      <div className="container error-page__inner">
        <div className="error-art"><GooeyBlob id="system-error-goo" className="not-found-goo" /><span className="error-art-label">GFS / SYSTEM STATUS</span><span className="error-art-number">500</span></div>
        <div className="error-copy"><span className="eyebrow eyebrow--orange">A brief service interruption</span><h1>Our system is temporarily down. <em>Your shipment data is safe.</em></h1><p>We’re checking the connection on our side. Please try again, or talk directly with the Nairobi operations team.</p><div className="error-actions"><button className="button button--primary" type="button" onClick={reset}><RefreshCw size={15} /> Try Again <ArrowRight size={15} /></button><a className="button button--outline" href="https://wa.me/254112272061?text=Hello%2C%20I%20need%20help%20with%20a%20shipment%20from%20Gideon%20Fleet%20Solutions." target="_blank" rel="noreferrer"><MessageCircle size={16} /> WhatsApp support</a></div><a className="error-phone" href="tel:+254112272061">+254 112 272 061</a></div>
      </div>
    </div>
  );
}
