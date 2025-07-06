
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getNewsItems } from '@/lib/news-service';
import { NewsCard } from '@/components/NewsCard';
import { Button } from '@/components/ui/button';

export async function LatestNews() {
  const allNews = await getNewsItems();
  const latestNews = allNews.slice(0, 3);

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {latestNews.map((item) => (
          <NewsCard key={item.id} {...item} />
        ))}
      </div>
      <div className="text-center mt-12">
        <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
          <Link href="/news">Ver Todas las Noticias <ArrowRight className="ml-2 h-5 w-5" /></Link>
        </Button>
      </div>
    </>
  );
}
