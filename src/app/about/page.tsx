
import { getPageHeaderData } from '@/lib/page-headers-service';
import { notFound } from 'next/navigation';
import { AboutPageClient } from './AboutPageClient';

export default async function AboutPage() {
  const headerData = await getPageHeaderData('about');
  if (!headerData) {
    notFound();
  }

  return <AboutPageClient headerData={headerData} />;
}
