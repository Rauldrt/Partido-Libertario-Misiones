
"use client";

import React, { useState, useEffect } from 'react';
import { getPublicImages } from '@/lib/gallery-service';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface ImageGalleryProps {
  onImageSelect: (src: string) => void;
}

export function ImageGallery({ onImageSelect }: ImageGalleryProps) {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const imagePaths = await getPublicImages();
      setImages(imagePaths);
    } catch (err) {
      setError('No se pudieron cargar las imágenes de la galería.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4">Cargando galería...</p>
      </div>
    );
  }

  if (error) {
    return (
       <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error al Cargar</AlertTitle>
          <AlertDescription>
              {error}
              <Button variant="secondary" size="sm" onClick={fetchImages} className="mt-4">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reintentar
              </Button>
          </AlertDescription>
        </Alert>
    );
  }
  
  if (images.length === 0) {
    return (
       <Alert>
          <AlertTitle>Galería Vacía</AlertTitle>
          <AlertDescription>
              No se encontraron imágenes en la carpeta `public` del proyecto. Subí tus imágenes a esa carpeta para poder seleccionarlas desde aquí.
          </AlertDescription>
        </Alert>
    );
  }


  return (
    <ScrollArea className="h-full">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 p-1">
        {images.map((src) => (
          <button
            key={src}
            className="aspect-square relative rounded-md overflow-hidden group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={() => onImageSelect(src)}
          >
            <img
              src={src}
              alt={`Imagen de la galería: ${src}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-xs text-center p-1 break-all">{src.split('/').pop()}</span>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
