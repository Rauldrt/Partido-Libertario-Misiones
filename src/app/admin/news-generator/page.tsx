
"use client";

import React, { useState } from 'react';
import { NewsCard, type NewsCardData } from '@/components/NewsCard';
import { Section } from '@/components/ui/Section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clipboard, Dna, FileText, Link as LinkIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateNewsFromUrl } from '@/ai/flows/generate-news-from-url-flow';
import { format } from 'date-fns';

const EMPTY_NEWS_ITEM: Partial<NewsCardData> = {
  id: 'new-id',
  title: 'Título de la Noticia',
  date: format(new Date(), 'dd de MMMM, yyyy'),
  summary: 'Este es un resumen breve de la noticia. Atrae al lector para que haga clic y lea más.',
  imageUrl: 'https://placehold.co/600x400.png',
  imageHint: 'keyword1 keyword2',
  linkUrl: '/news/new-id',
  type: 'news',
  content: 'Este es el contenido completo del artículo de la noticia. Puede ser más largo y detallado que el resumen.',
  youtubeVideoId: '',
};

export default function NewsGeneratorPage() {
  const [newsData, setNewsData] = useState<Partial<NewsCardData>>(EMPTY_NEWS_ITEM);
  const [aiUrl, setAiUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewsData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof NewsCardData) => (value: string) => {
    setNewsData(prev => ({ ...prev, [name]: value }));
  };

  const handleCopyToClipboard = () => {
    const cleanData = { ...newsData };
    // Ensure required fields are not empty
    for (const key in cleanData) {
        if (cleanData[key as keyof NewsCardData] === '') {
            delete cleanData[key as keyof NewsCardData];
        }
    }
    const dataString = JSON.stringify(cleanData, null, 2);
    navigator.clipboard.writeText(dataString);
    toast({
      title: '¡Copiado!',
      description: 'Los datos de la noticia se han copiado al portapapeles.',
    });
  };
  
  const handleAiGenerate = async () => {
    if (!aiUrl) {
      toast({
        variant: 'destructive',
        title: 'URL Requerida',
        description: 'Por favor, ingrese una URL para generar la noticia.',
      });
      return;
    }
    
    setIsGenerating(true);
    try {
      const result = await generateNewsFromUrl({ url: aiUrl });
      setNewsData(prev => ({
        ...EMPTY_NEWS_ITEM,
        title: result.title,
        summary: result.summary,
        content: result.summary,
        imageHint: result.imageHint,
        linkUrl: aiUrl,
        imageUrl: result.imageUrl || EMPTY_NEWS_ITEM.imageUrl,
      }));
       toast({
        title: '¡Noticia Generada!',
        description: 'La IA ha creado una base para tu noticia. Revisa y ajusta los detalles.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error de Generación',
        description: (error as Error).message || 'No se pudo generar la noticia desde la URL.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Section id="news-generator" className="py-10">
      <div className="text-center mb-12">
        <FileText className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Generador de Noticias</h1>
        <p className="font-body text-xl text-muted-foreground mt-2">
          Creá o generá noticias para el sitio de forma rápida y sencilla.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Editor de Noticias</CardTitle>
            <CardDescription>Usá las pestañas para crear una noticia manually o con ayuda de la IA.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="manual">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual"><FileText className="mr-2 h-4 w-4" />Manual</TabsTrigger>
                <TabsTrigger value="ai"><Dna className="mr-2 h-4 w-4" />Potenciado por IA</TabsTrigger>
              </TabsList>
              <TabsContent value="manual" className="space-y-4 pt-4">
                 <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input id="title" name="title" value={newsData.title || ''} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha</Label>
                  <Input id="date" name="date" value={newsData.date || ''} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="summary">Resumen</Label>
                  <Textarea id="summary" name="summary" value={newsData.summary || ''} onChange={handleInputChange} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="content">Contenido (Opcional)</Label>
                  <Textarea id="content" name="content" value={newsData.content || ''} onChange={handleInputChange} placeholder="El contenido completo del artículo..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">URL de Imagen</Label>
                    <Input id="imageUrl" name="imageUrl" value={newsData.imageUrl || ''} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageHint">Sugerencia de Imagen</Label>
                    <Input id="imageHint" name="imageHint" value={newsData.imageHint || ''} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtubeVideoId">ID Video de YouTube (Opcional)</Label>
                  <Input id="youtubeVideoId" name="youtubeVideoId" value={newsData.youtubeVideoId || ''} onChange={handleInputChange} placeholder="Ej: YXlz1K6o_ps" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select name="type" onValueChange={handleSelectChange('type')} value={newsData.type || 'news'}>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="news">Noticia</SelectItem>
                        <SelectItem value="event">Evento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
              </TabsContent>
              <TabsContent value="ai" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="ai-url">URL del Artículo</Label>
                  <div className="flex gap-2">
                    <Input id="ai-url" placeholder="https://ejemplo.com/noticia" value={aiUrl} onChange={(e) => setAiUrl(e.target.value)} />
                    <Button onClick={handleAiGenerate} disabled={isGenerating}>
                      {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Dna className="h-4 w-4" />}
                      <span className="ml-2 hidden sm:inline">Generar</span>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Pegá el link de una noticia y la IA generará un título, resumen, imagen y sugerencia de imagen.</p>
                </div>
                 <p className="font-body text-sm text-center bg-accent/20 p-3 rounded-md border border-accent">
                    La IA completará los campos de la pestaña "Manual". ¡Revisalos y ajústalos antes de usar!
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6 sticky top-24">
           <Card className="shadow-lg">
             <CardHeader>
                <CardTitle>Vista Previa</CardTitle>
                <CardDescription>Así se verá la noticia en la página.</CardDescription>
             </CardHeader>
              <CardContent>
                 <NewsCard {...newsData as NewsCardData} />
              </CardContent>
           </Card>
           <Button className="w-full" onClick={handleCopyToClipboard}>
             <Clipboard className="mr-2 h-4 w-4" />
             Copiar Datos para `data.ts`
           </Button>
           <div className="text-sm text-muted-foreground p-4 border rounded-md bg-card">
                <p className="font-bold text-card-foreground">¿Cómo agregar la noticia?</p>
                <p>1. Ajustá los datos usando el editor.</p>
                <p>2. Hacé clic en el botón "Copiar Datos".</p>
                <p>3. Abrí el archivo <code className="bg-muted px-1 rounded-sm text-card-foreground">src/lib/data.ts</code>.</p>
                <p>4. Pegá el objeto copiado dentro del array <code className="bg-muted px-1 rounded-sm text-card-foreground">mockNewsItems</code>.</p>
                <p>5. Asegurate de que el <code className="bg-muted px-1 rounded-sm text-card-foreground">id</code> y <code className="bg-muted px-1 rounded-sm text-card-foreground">linkUrl</code> sean únicos.</p>
           </div>
        </div>
      </div>
    </Section>
  );
}
