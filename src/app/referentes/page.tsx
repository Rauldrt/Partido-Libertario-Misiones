
import { getReferentes } from '@/lib/referentes-service';
import { ReferentesPageClient } from './ReferentesPageClient';
import { getPageHeaderData } from '@/lib/page-headers-service';
import { notFound } from 'next/navigation';

export default async function ReferentesPage() {
  const referentes = await getReferentes();
  const headerData = await getPageHeaderData('referentes');

  if (!headerData) {
    notFound();
  }

  return <ReferentesPageClient initialReferentes={referentes} headerData={headerData} />;
}
