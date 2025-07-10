
import { getReferentes } from '@/lib/referentes-service';
import { ReferentesPageClient } from './ReferentesPageClient';

export default async function ReferentesPage() {
  const referentes = await getReferentes();

  return <ReferentesPageClient initialReferentes={referentes} />;
}
