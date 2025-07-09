import HomePageClient from './HomePageClient';
import { LatestNews } from '@/components/LatestNews';
import { getBannerSlides, getMosaicTiles } from '@/lib/homepage-service';
import { EventsCarousel } from '@/components/EventsCarousel';

// This is a Server Component by default
export default async function HomePage() {
  const slides = await getBannerSlides();
  const tiles = await getMosaicTiles();

  return (
    // We render the Client Component and pass server components
    // as props. This is a powerful pattern in Next.js.
    <HomePageClient 
        slides={slides} 
        tiles={tiles}
        events={<EventsCarousel />}
    >
      <LatestNews />
    </HomePageClient>
  );
}
