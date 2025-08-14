
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BannerEditorClient } from './BannerEditorClient';

export default function ManageBannerPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Banner de Inicio</CardTitle>
        <CardDescription>
          Añade, elimina, reordena y edita las diapositivas del carrusel principal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BannerEditorClient />
      </CardContent>
    </Card>
  );
}

    