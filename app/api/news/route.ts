import { NextResponse } from 'next/server';
import { newsArticles } from '@/lib/news';

export const revalidate = 300;

export async function GET() {
  return NextResponse.json({ articles: newsArticles });
}
