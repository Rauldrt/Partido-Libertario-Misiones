
"use client";

import React, { useState, useTransition } from 'react';
import type { InfoSectionData } from '@/lib/homepage-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { saveInfoSectionDataAction } from './actions';
import { Loader2, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export function InfoSectionEditorClient({ initialData }: { initialData: InfoSectionData }) {
  const [data, setData] = useState<InfoSectionData>(initialData);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleInputChange = (field: keyof InfoSectionData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    startTransition(async () => {
      const result = await saveInfoSectionDataAction(data);
      if (result.success) {
        toast({
          title: "¡Éxito!",
          description: result.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message,
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Título Principal</Label>
        <Input 
          id="title" 
          value={data.title} 
          onChange={(e) => handleInputChange('title', e.target.value)} 
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Subtítulo / Descripción</Label>
        <Textarea 
          id="description" 
          value={data.description} 
          onChange={(e) => handleInputChange('description', e.target.value)} 
          disabled={isPending}
          rows={3}
        />
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSaveChanges} disabled={isPending} size="lg">
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}
