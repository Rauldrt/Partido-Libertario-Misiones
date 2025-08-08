
import { getNotificationData } from '@/lib/notification-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NotificationEditorClient } from './NotificationEditorClient';

export default async function ManageNotificationPage() {
  const data = await getNotificationData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Notificación del Banner</CardTitle>
        <CardDescription>
          Configura la burbuja de notificación que aparece en la página de inicio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NotificationEditorClient initialData={data} />
      </CardContent>
    </Card>
  );
}
