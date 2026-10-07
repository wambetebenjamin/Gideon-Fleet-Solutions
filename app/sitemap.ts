import type { MetadataRoute } from 'next';
import { newsArticles } from '@/lib/news';

export const revalidate = 300;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://gideonfleet.co.ke').replace(/\/$/, '');
  const pages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/fleet`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tracking`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/legal/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/legal/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/legal/cookie-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ...newsArticles.map((article) => ({
      url: `${baseUrl}/news/${article.slug}`,
      lastModified: new Date(`${article.publishedAt}T12:00:00Z`),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
  return pages;
}
