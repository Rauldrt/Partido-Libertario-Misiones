
import HomePageClient from './HomePageClient';
import { LatestNews } from '@/components/LatestNews';
import { getBannerSlides, getMosaicTiles, getAccordionItems } from '@/lib/homepage-service';
import { EventsCarousel } from '@/components/EventsCarousel';
import { getNewsItems } from '@/lib/news-service';
import { SocialWidget } from '@/components/SocialWidget';

// This is a Server Component by default
export default async function HomePage() {
  const slides = await getBannerSlides();
  const tiles = await getMosaicTiles();
  const accordionItems = await getAccordionItems();
  const allItems = await getNewsItems();
  const events = allItems.filter(item => item.type === 'event' && item.published);

  return (
    // We render the Client Component and pass server components
    // as props. This is a powerful pattern in Next.js.
    <HomePageClient 
        slides={slides} 
        tiles={tiles}
        accordionItems={accordionItems}
        events={<EventsCarousel events={events} />}
        socialWidget={<SocialWidget />}
    >
      <LatestNews />
    </HomePageClient>
  );
}
