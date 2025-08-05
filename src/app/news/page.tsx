
import { getNewsItems } from '@/lib/news-service';
import NewsPageClient from './NewsPageClient';
import { getPageHeaderData } from '@/lib/page-headers-service';
import { notFound } from 'next/navigation';

export const revalidate = 60; // Revalidate data every 60 seconds

export default async function NewsPage() {
  const allItems = await getNewsItems();
  const newsItems = allItems.filter(item => item.published);
  const headerData = await getPageHeaderData('news');

  if (!headerData) {
    notFound();
  }
  
  return <NewsPageClient newsItems={newsItems} headerData={headerData} />;
}
