import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock3 } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { ComponentType } from 'react';
import { newsArticles } from '@/lib/news';

export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };
type ArticleBody = { default: ComponentType };
const articleModules: Record<string, () => Promise<ArticleBody>> = {
  'road-safety-through-the-long-haul': () => import('../../../content/news/road-safety-through-the-long-haul.mdx'),
  'connecting-nairobi-to-the-coast': () => import('../../../content/news/connecting-nairobi-to-the-coast.mdx'),
  'cross-border-paperwork-checklist': () => import('../../../content/news/cross-border-paperwork-checklist.mdx'),
};

export function generateStaticParams() {
  return newsArticles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = newsArticles.find((item) => item.slug === slug);
  if (!article) return { title: 'News article not found' };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
      images: [{ url: article.image, alt: article.imageAlt, width: 1200, height: 630 }],
    },
  };
}

export default async function NewsArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = newsArticles.find((item) => item.slug === slug);
  const loadArticle = articleModules[slug];
  if (!article || !loadArticle) notFound();
  const ArticleContent = (await loadArticle()).default;

  return (
    <div className="subpage-main article-page">
      <section className="article-hero container">
        <Link className="back-link" href="/news"><ArrowLeft size={15} /> All updates</Link>
        <span className="eyebrow eyebrow--orange">{article.category}</span>
        <h1>{article.title}</h1>
        <p className="article-excerpt">{article.excerpt}</p>
        <div className="news-meta"><span><CalendarDays size={13} /> {new Date(`${article.publishedAt}T12:00:00Z`).toLocaleDateString('en-KE', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' })}</span><span><Clock3 size={13} /> {article.readTime}</span></div>
      </section>
      <div className="article-cover container"><Image src={article.image} alt={article.imageAlt} width={1200} height={700} priority /></div>
      <div className="container article-layout">
        <aside className="article-aside"><span className="article-aside-label">GIDEON / NOTES</span><p>Practical updates from our Nairobi operations team.</p><Link href="/tracking">Track a shipment <ArrowUpRight size={13} /></Link></aside>
        <article className="prose article-content"><ArticleContent /></article>
      </div>
      <div className="article-back container"><Link className="button button--outline" href="/news"><ArrowLeft size={15} /> More updates</Link><Link className="button button--primary" href="/#quote">Talk to our team <ArrowUpRight size={15} /></Link></div>
    </div>
  );
}
