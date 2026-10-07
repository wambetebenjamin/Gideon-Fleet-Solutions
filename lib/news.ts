export type NewsArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime: string;
  image: string;
  imageAlt: string;
};

export const newsArticles: NewsArticle[] = [
  {
    slug: 'road-safety-through-the-long-haul',
    title: 'A safer long haul starts before the engine turns over',
    excerpt: 'How route reviews, driver rest windows, and practical checks make every East African delivery more dependable.',
    category: 'Road safety',
    publishedAt: '2026-10-02',
    readTime: '4 min read',
    image: '/images/tanzania-freight-road.jpg',
    imageAlt: 'Freight trucks moving along a rural East African road',
  },
  {
    slug: 'connecting-nairobi-to-the-coast',
    title: 'Planning the Nairobi-to-coast freight corridor',
    excerpt: 'A practical guide to collection windows, line-haul planning, and final handoffs along one of Kenya’s busiest freight routes.',
    category: 'Route updates',
    publishedAt: '2026-09-18',
    readTime: '3 min read',
    image: '/images/tanzania-highway-truck.jpg',
    imageAlt: 'A truck crossing an open East African highway',
  },
  {
    slug: 'cross-border-paperwork-checklist',
    title: 'Cross-border paperwork: a practical shipper checklist',
    excerpt: 'The key details to prepare for smoother customs handovers on regional freight routes.',
    category: 'Regulatory notes',
    publishedAt: '2026-09-04',
    readTime: '5 min read',
    image: '/images/rural-east-africa-route.jpg',
    imageAlt: 'A rural East African road with local transport',
  },
];
