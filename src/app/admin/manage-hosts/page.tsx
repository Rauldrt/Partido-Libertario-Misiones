
import { getAllowedHosts } from '@/lib/config-service';
import { HostManagerClient } from './HostManagerClient';

export default async function ManageHostsPage() {
  const hosts = await getAllowedHosts();

  return <HostManagerClient initialHosts={hosts} />;
}
