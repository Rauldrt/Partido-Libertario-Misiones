
"use client";

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles, Bot, Loader2, Dna, ClipboardCopy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateNewsFromUrl, type GenerateNewsOutput } from '@/ai/flows/generate-news-from-url-flow';
import { Label } from '@/components/ui/label';

export default function AiAssistantPage() {
  const [url, setUrl] = useState('');
  const [isGenerating, startTransition] = useTransition();
  const [result, setResult] = useState<GenerateNewsOutput | null>(null);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!url) {
      toast({
        variant: 'destructive',
        title: 'URL Requerida',
        description: 'Por favor, ingrese una URL para generar el contenido.',
      });
      return;
    }

    setResult(null);
    startTransition(async () => {
      try {
        const generatedResult = await generateNewsFromUrl({ url });
        setResult(generatedResult);
        toast({
          title: '¡Borrador Generado!',
          description: 'El asistente ha creado una base para tu contenido.',
        });
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Error de Generación',
          description: (error as Error).message || 'No se pudo generar el contenido desde la URL.',
        });
      }
    });
  };

  const handleCopyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        description: `"${fieldName}" copiado al portapapeles.`,
      });
    }, (err) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo copiar el texto.',
      });
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <Sparkles className="h-8 w-8 mr-3 text-primary" />
          Asistente de Contenido IA
        </h1>
        <p className="text-muted-foreground mt-2">
          Tu centro de inteligencia para la creación y optimización de contenido.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            Generador de Borradores
          </CardTitle>
          <CardDescription>
            Pegá el link de un artículo, video de YouTube o publicación de red social y la IA generará un borrador de contenido.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="url"
              placeholder="https://ejemplo.com/noticia-o-video"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              disabled={isGenerating}
            />
            <Button onClick={handleGenerate} disabled={isGenerating} className="min-w-[150px]">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Dna className="mr-2 h-4 w-4" />
                  Generar Borrador
                </>
              )}
            </Button>
          </div>

          {isGenerating && (
            <div className="text-center p-8 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">El asistente está analizando la URL y generando el contenido. Esto puede tardar unos segundos...</p>
            </div>
          )}

          {result && (
            <Card className="bg-muted/30">
                <CardHeader>
                    <CardTitle>Borrador Generado</CardTitle>
                    <CardDescription>Revisá el contenido y usalo como base para tus publicaciones.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Título Sugerido</Label>
                        <div className="flex items-center gap-2">
                            <p className="p-3 bg-background rounded-md border w-full text-sm">{result.title}</p>
                            <Button variant="outline" size="icon" onClick={() => handleCopyToClipboard(result.title, 'Título')}>
                                <ClipboardCopy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label>Resumen Sugerido</Label>
                         <div className="flex items-start gap-2">
                            <p className="p-3 bg-background rounded-md border w-full text-sm">{result.summary}</p>
                            <Button variant="outline" size="icon" onClick={() => handleCopyToClipboard(result.summary, 'Resumen')}>
                                <ClipboardCopy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label>Sugerencia para Imagen</Label>
                         <div className="flex items-center gap-2">
                            <p className="p-3 bg-background rounded-md border w-full text-sm font-mono">{result.imageHint}</p>
                            <Button variant="outline" size="icon" onClick={() => handleCopyToClipboard(result.imageHint, 'Sugerencia de imagen')}>
                                <ClipboardCopy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
          )}

          <Alert>
            <Bot className="h-4 w-4" />
            <AlertTitle>Próximos Pasos</AlertTitle>
            <AlertDescription>
              <p>Este es solo el comienzo. En el futuro, este asistente podrá:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Mantener una conversación y recordar el contexto.</li>
                <li>Sugerir mejoras para artículos ya publicados.</li>
                <li>Generar imágenes para acompañar las noticias.</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
