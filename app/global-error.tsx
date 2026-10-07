'use client';

import './globals.css';
import { RefreshCw } from 'lucide-react';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-KE">
      <body>
        <main className="error-page error-page--500">
          <div className="container error-page__inner"><div className="error-art"><span className="error-art-label">GFS / SYSTEM STATUS</span><span className="error-art-number">500</span></div><div className="error-copy"><span className="eyebrow eyebrow--orange">A brief service interruption</span><h1>Our system is temporarily down. <em>Your shipment data is safe.</em></h1><p>We’re checking the connection on our side. Please try again.</p><button className="button button--primary" type="button" onClick={reset}><RefreshCw size={15} /> Try Again</button><a className="error-phone" href="https://wa.me/254112272061">WhatsApp: +254 112 272 061</a></div></div>
        </main>
      </body>
    </html>
  );
}
