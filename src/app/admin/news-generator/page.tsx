
"use client";

import React, { useState, useEffect } from 'react';
import { NewsCard } from '@/components/NewsCard';
import type { NewsCardData, NewsLink } from '@/lib/news-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dna, FilePlus, Loader2, Save, Trash2, Plus, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateNewsFromUrl } from '@/ai/flows/generate-news-from-url-flow';
import { format } from 'date-fns';
import { getNewsItemForEditAction, saveNewsItemAction } from './actions';
import { useSearchParams } from 'next/navigation';
import { EmbedDisplay } from '@/components/EmbedDisplay';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const getEmptyNewsItem = (): Partial<NewsCardData> => ({
  title: 'Título del Contenido',
  date: format(new Date(), 'dd/MM/yyyy'),
  summary: 'Este es un resumen breve. Atrae al lector para que haga clic y lea más.',
  imageUrl: 'https://placehold.co/600x400.png',
  imageHint: 'keyword1 keyword2',
  type: 'news',
  content: 'Este es el contenido completo. Puede ser más largo y detallado que el resumen.',
  youtubeVideoId: '',
  embedCode: '',
  published: true, // Default to true for new items
  links: [],
  // id should be undefined for new items
});

export default function NewsGeneratorPage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditing = !!editId;

  const [newsData, setNewsData] = useState<Partial<NewsCardData>>(getEmptyNewsItem());
  const [aiUrl, setAiUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing); // Start in loading state if editing
  const { toast } = useToast();
  
  useEffect(() => {
    if (editId) {
      setIsLoading(true);
      getNewsItemForEditAction(editId)
        .then(result => {
          if (result.success && result.data) {
            setNewsData({
                ...result.data,
                links: result.data.links || [], // Ensure links is always an array
            });
          } else {
            toast({
              variant: 'destructive',
              title: 'Error al cargar',
              description: result.message || 'No se pudo encontrar el contenido para editar.',
            });
          }
        })
        .finally(() => setIsLoading(false));
    } else {
      setNewsData(getEmptyNewsItem());
      setIsLoading(false);
    }
  }, [editId, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewsData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof NewsCardData) => (value: string) => {
    setNewsData(prev => ({ ...prev, [name]: value as any }));
  };
  
  const handleLinkChange = (index: number, field: keyof NewsLink, value: string) => {
    setNewsData(prev => {
        const newLinks = [...(prev.links || [])];
        newLinks[index] = { ...newLinks[index], [field]: value };
        return { ...prev, links: newLinks };
    });
  };

  const handleAddLink = () => {
    setNewsData(prev => ({
        ...prev,
        links: [...(prev.links || []), { title: '', url: '' }]
    }));
  };

  const handleRemoveLink = (index: number) => {
    setNewsData(prev => ({
        ...prev,
        links: (prev.links || []).filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Filter out empty links before saving
    const dataToSave: Partial<NewsCardData> = { 
        ...newsData,
        links: newsData.links?.filter(link => link.title && link.url)
    };
    if (!isEditing) {
      delete dataToSave.id;
    }

    const result = await saveNewsItemAction(dataToSave);
    if (result.success) {
      toast({
        title: '¡Éxito!',
        description: result.message,
      });
      if (!isEditing) {
        setNewsData(getEmptyNewsItem());
        setAiUrl('');
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Error al Guardar',
        description: result.message || 'No se pudo guardar el contenido.',
      });
    }
    setIsSaving(false);
  };
  
  const handleAiGenerate = async () => {
    if (!aiUrl) {
      toast({
        variant: 'destructive',
        title: 'URL Requerida',
        description: 'Por favor, ingrese una URL para generar el contenido.',
      });
      return;
    }
    
    setIsGenerating(true);
    try {
      const result = await generateNewsFromUrl({ url: aiUrl });
      setNewsData(prev => ({
        ...prev, // Keep ID and other fields if editing
        title: result.title,
        summary: result.summary,
        content: result.summary,
        imageHint: result.imageHint,
        imageUrl: result.imageUrl || 'https://placehold.co/600x400.png',
        youtubeVideoId: result.youtubeVideoId || '',
        embedCode: result.embedCode || '',
        type: result.youtubeVideoId ? 'event' : 'news',
      }));
       toast({
        title: '¡Contenido Generado!',
        description: 'La IA ha creado una base para tu contenido. Revisa y ajusta los detalles.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error de Generación',
        description: (error as Error).message || 'No se pudo generar el contenido desde la URL.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const previewData: NewsCardData = {
    id: newsData.id || 'preview-id',
    linkUrl: newsData.linkUrl || `/news/${newsData.id || 'preview-id'}`,
    published: newsData.published ?? true,
    title: newsData.title || '',
    date: newsData.date || '',
    summary: newsData.summary || '',
    imageUrl: newsData.imageUrl || '',
    imageHint: newsData.imageHint || '',
    type: newsData.type || 'news',
    content: newsData.content || '',
    youtubeVideoId: newsData.youtubeVideoId || '',
    embedCode: newsData.embedCode || '',
    order: 0,
  }

  if (isLoading) {
    return (
        <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-lg">Cargando contenido para editar...</p>
        </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{isEditing ? 'Editar Contenido' : 'Crear Contenido'}</CardTitle>
          <CardDescription>
            {isEditing 
                ? 'Modificá los detalles del contenido y guardá los cambios.' 
                : 'Usá las pestañas para crear una noticia o evento manualmente o con ayuda de la IA.'
            }
        </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="manual">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual"><FilePlus className="mr-2 h-4 w-4" />Manual</TabsTrigger>
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
              <Accordion type="single" collapsible className="w-full">
                 <AccordionItem value="item-1">
                    <AccordionTrigger>Opciones Avanzadas</AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="embedCode">Código de Inserción (Opcional)</Label>
                            <Textarea id="embedCode" name="embedCode" value={newsData.embedCode || ''} onChange={handleInputChange} placeholder="<blockquote class='instagram-media' ...>...</blockquote>" className="font-mono text-xs" />
                            <p className="text-xs text-muted-foreground">
                                Si rellenás esto, se mostrará en lugar del contenido principal, la imagen y el video de YouTube.
                            </p>
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
                    </AccordionContent>
                 </AccordionItem>
                 <AccordionItem value="item-2">
                    <AccordionTrigger>Enlaces Adjuntos (Opcional)</AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                        {(newsData.links || []).map((link, index) => (
                             <div key={index} className="flex items-end gap-2 p-3 border rounded-md bg-muted/50">
                                 <div className="grid grid-cols-2 gap-2 flex-grow">
                                    <div className="space-y-1 col-span-2 sm:col-span-1">
                                        <Label htmlFor={`link-title-${index}`}>Título del Enlace</Label>
                                        <Input id={`link-title-${index}`} value={link.title} onChange={(e) => handleLinkChange(index, 'title', e.target.value)} placeholder="Ej: Ver en La Nación" />
                                    </div>
                                    <div className="space-y-1 col-span-2 sm:col-span-1">
                                        <Label htmlFor={`link-url-${index}`}>URL del Enlace</Label>
                                        <Input id={`link-url-${index}`} value={link.url} onChange={(e) => handleLinkChange(index, 'url', e.target.value)} placeholder="https://www.lanacion.com.ar/..." />
                                    </div>
                                 </div>
                                 <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveLink(index)}>
                                     <Trash2 className="h-4 w-4" />
                                 </Button>
                             </div>
                        ))}
                        <Button type="button" variant="outline" onClick={handleAddLink} className="w-full">
                            <Plus className="mr-2 h-4 w-4" />Añadir Enlace
                        </Button>
                    </AccordionContent>
                 </AccordionItem>
              </Accordion>
            </TabsContent>
            <TabsContent value="ai" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="ai-url">URL del Artículo o Video de YouTube</Label>
                <div className="flex gap-2">
                  <Input id="ai-url" placeholder="https://ejemplo.com/noticia" value={aiUrl} onChange={(e) => setAiUrl(e.target.value)} />
                  <Button onClick={handleAiGenerate} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Dna className="h-4 w-4" />}
                    <span className="ml-2 hidden sm:inline">Generar</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Pegá el link de un artículo, video de YouTube o publicación de red social y la IA generará el contenido.</p>
              </div>
               <p className="font-body text-sm text-center bg-accent/20 p-3 rounded-md border border-accent">
                  La IA completará los campos de la pestaña "Manual". ¡Revisalos y ajústalos antes de guardar!
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="space-y-6 sticky top-24">
         <Card className="shadow-lg">
           <CardHeader>
              <CardTitle>Vista Previa</CardTitle>
              <CardDescription>
                {previewData.embedCode 
                    ? 'Así se verá el contenido insertado en la página del artículo.'
                    : 'Así se verá la tarjeta en la página de noticias.'
                }
              </CardDescription>
           </CardHeader>
            <CardContent>
                {previewData.embedCode ? (
                    <div className="border rounded-md p-2 bg-muted/30">
                        <EmbedDisplay embedCode={previewData.embedCode} />
                    </div>
                ) : (
                    <NewsCard {...previewData} />
                )}
            </CardContent>
         </Card>
         <Button className="w-full" onClick={handleSave} disabled={isSaving}>
           {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
           {isEditing ? 'Guardar Cambios' : 'Guardar Contenido'}
         </Button>
         <div className="text-sm text-muted-foreground p-4 border rounded-md bg-card">
              <p className="font-bold text-card-foreground">¿Cómo agregar o editar el contenido?</p>
              <p>1. Ajustá los datos usando el editor o la IA.</p>
              <p>2. Hacé clic en "{isEditing ? 'Guardar Cambios' : 'Guardar Contenido'}".</p>
              <p>3. El contenido se guardará y será visible (o no) según su estado.</p>
              <p>4. Podés gestionar su visibilidad desde "Gestionar Contenido".</p>
         </div>
      </div>
    </div>
  );
}
