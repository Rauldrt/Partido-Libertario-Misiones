
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormEditorClient } from './FormEditorClient';
import { FilePlus, GalleryHorizontal, Info, LayoutGrid, Link2, ListChecks, PanelsTopLeft, Rss, Server, Sparkles, Star, Type, Bell, UserCheck, ShieldCheckIcon, MessageSquare, Wrench } from 'lucide-react';
import Link from 'next/link';

export default function ManageFormsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle className="flex items-center gap-2">
                    <Wrench />
                    Gestionar Campos de Formularios
                </CardTitle>
                <CardDescription>
                Añadí, reordená, editá y eliminá los campos que aparecen en los formularios públicos del sitio.
                </CardDescription>
            </div>
             <Link href="/admin">
                <PanelsTopLeft />
            </Link>
        </div>
      </CardHeader>
      <CardContent>
        <FormEditorClient />
      </CardContent>
    </Card>
  );
}
