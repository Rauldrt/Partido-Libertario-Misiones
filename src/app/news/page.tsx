
import { getNewsItems } from '@/lib/news-service';
import NewsPageClient from './NewsPageClient';

// This is now a server component responsible for fetching data.
export default async function NewsPage() {
  const newsItems = await getNewsItems();
  
  // The client component handles the rendering and user interactions.
  return <NewsPageClient newsItems={newsItems} />;
}
