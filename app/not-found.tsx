import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { GooeyBlob } from '@/components/gooey-blob';

export default function NotFound() {
  return (
    <div className="error-page error-page--404">
      <div className="container error-page__inner">
        <div className="error-art"><GooeyBlob id="not-found-goo" className="not-found-goo" /><span className="error-art-label">GFS / ROUTE 404</span><span className="error-art-number">404</span></div>
        <div className="error-copy"><span className="eyebrow eyebrow--orange">Off the route</span><h1>This route could <em>not be found.</em></h1><p>The address may have changed, or this delivery never had a stop here.</p><Link href="/" className="button button--primary"><ArrowLeft size={15} /> Return to Homepage <ArrowUpRight size={14} /></Link><span className="error-route-note"><i /> We’ll get you back on track.</span></div>
      </div>
    </div>
  );
}
