
import HomePageClient from './HomePageClient';
import { LatestNews } from '@/components/LatestNews';
import { getBannerSlides, getMosaicTiles, getAccordionItems, getInfoSectionData } from '@/lib/homepage-service';
import { EventsCarousel } from '@/components/EventsCarousel';
import { getNewsItems } from '@/lib/news-service';
import { SocialWidget } from '@/components/SocialWidget';

export const revalidate = 60; // Revalidate data every 60 seconds

// This is a Server Component by default
export default async function HomePage() {
  const allSlides = await getBannerSlides();
  const tiles = await getMosaicTiles();
  const accordionItems = await getAccordionItems();
  const infoSectionData = await getInfoSectionData();
  const allItems = await getNewsItems();
  const events = allItems.filter(item => item.type === 'event' && item.published);

  // Filter out expired slides
  const now = new Date();
  const slides = allSlides.filter(slide => {
    if (!slide.expiresAt) return true; // Keep slides that don't have an expiration date
    // The date from the input is YYYY-MM-DD. We need to parse it correctly.
    // Appending T00:00:00 and specifying UTC ensures consistent parsing.
    const expiryDate = new Date(`${slide.expiresAt}T23:59:59Z`); // Consider the date to expire at the end of the day in UTC
    return expiryDate >= now;
  });

  return (
    // We render the Client Component and pass server components
    // as props. This is a powerful pattern in Next.js.
    <HomePageClient 
        slides={slides} 
        tiles={tiles}
        accordionItems={accordionItems}
        infoSectionData={infoSectionData}
        events={<EventsCarousel events={events} />}
        socialWidget={<SocialWidget />}
    >
      <LatestNews />
    </HomePageClient>
  );
}
