
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NotificationEditorClient } from './NotificationEditorClient';

export default function ManageNotificationPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Notificación del Banner</CardTitle>
        <CardDescription>
          Configura la burbuja de notificación que aparece en la página de inicio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NotificationEditorClient />
      </CardContent>
    </Card>
  );
}
