import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock3 } from 'lucide-react';
import { newsArticles } from '@/lib/news';

export const revalidate = 300;

export const metadata = {
  title: 'News & Fleet Updates',
  description: 'Road safety, route updates, and practical freight notes for East African businesses.',
  openGraph: {
    title: 'News & Fleet Updates | Gideon Fleet Solutions',
    description: 'Road safety, route updates, and practical freight notes for East African businesses.',
    type: 'website',
  },
};

export default function NewsIndexPage() {
  return (
    <div className="subpage-main news-index-page">
      <section className="subpage-hero">
        <div className="container"><Link className="back-link" href="/"><ArrowLeft size={15} /> Back to home</Link><span className="eyebrow eyebrow--orange">From the road</span><h1>News &amp; fleet <em>updates.</em></h1><p>Road safety, route expansions, and practical freight notes for businesses moving across East Africa.</p></div>
      </section>
      <section className="container news-index-grid" aria-label="News articles">
        {newsArticles.map((article, index) => <article className={`news-card ${index === 0 ? 'news-card--featured' : ''}`} key={article.slug}>
          <Link href={`/news/${article.slug}`} className="news-card__image"><Image src={article.image} alt={article.imageAlt} width={500} height={333} loading="lazy" /><span className="news-category">{article.category}</span><span className="news-arrow"><ArrowUpRight size={17} /></span></Link>
          <div className="news-card__body"><div className="news-meta"><span><CalendarDays size={13} /> {new Date(`${article.publishedAt}T12:00:00Z`).toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })}</span><span><Clock3 size={13} /> {article.readTime}</span></div><h2><Link href={`/news/${article.slug}`}>{article.title}</Link></h2><p>{article.excerpt}</p><Link className="news-read-link" href={`/news/${article.slug}`}>Read update <ArrowUpRight size={13} /></Link></div>
        </article>)}
      </section>
    </div>
  );
}
