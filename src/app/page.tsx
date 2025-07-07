import HomePageClient from './HomePageClient';
import { LatestNews } from '@/components/LatestNews';
import { getBannerSlides, getMosaicTiles } from '@/lib/homepage-service';

// This is a Server Component by default
export default async function HomePage() {
  const slides = await getBannerSlides();
  const tiles = await getMosaicTiles();

  return (
    // We render the Client Component and pass the Server Component
    // as a child prop. This is the recommended pattern.
    <HomePageClient slides={slides} tiles={tiles}>
      <LatestNews />
    </HomePageClient>
  );
}
