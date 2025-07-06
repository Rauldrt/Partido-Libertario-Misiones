import HomePageClient from './HomePageClient';
import { LatestNews } from '@/components/LatestNews';

// This is a Server Component by default
export default function HomePage() {
  return (
    // We render the Client Component and pass the Server Component
    // as a child prop. This is the recommended pattern.
    <HomePageClient>
      <LatestNews />
    </HomePageClient>
  );
}
