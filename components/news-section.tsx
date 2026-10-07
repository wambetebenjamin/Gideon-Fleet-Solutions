import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, CalendarDays, Clock3 } from 'lucide-react';
import { newsArticles } from '@/lib/news';

export function NewsSection() {
  return (
    <section className="news-section section-shell" id="news" aria-labelledby="news-title">
      <div className="container">
        <div className="news-heading section-heading section-heading--split"><div><span className="eyebrow eyebrow--orange">News from the road</span><h2 id="news-title">Useful notes for <em>moving well.</em></h2></div><Link href="/news" className="text-link">All fleet updates <ArrowUpRight size={15} /></Link></div>
        <div className="news-grid">
          {newsArticles.map((article, index) => (
            <article key={article.slug} className={`news-card ${index === 0 ? 'news-card--featured' : ''}`}>
              <Link href={`/news/${article.slug}`} className="news-card__image"><Image src={article.image} alt={article.imageAlt} width={500} height={333} loading="lazy" /><span className="news-category">{article.category}</span><span className="news-arrow"><ArrowUpRight size={17} /></span></Link>
              <div className="news-card__body"><div className="news-meta"><span><CalendarDays size={13} /> {new Date(`${article.publishedAt}T12:00:00Z`).toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })}</span><span><Clock3 size={13} /> {article.readTime}</span></div><h3><Link href={`/news/${article.slug}`}>{article.title}</Link></h3><p>{article.excerpt}</p><Link className="news-read-link" href={`/news/${article.slug}`}>Read update <ArrowUpRight size={13} /></Link></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
