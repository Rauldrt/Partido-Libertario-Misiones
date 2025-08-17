
"use client";

import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2, Server } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getAdminSdkStatus } from '@/lib/actions/getAdminSdkStatus';

export function AdminSdkStatus() {
  const [isSdkActive, setIsSdkActive] = useState<boolean | null>(null);

  useEffect(() => {
    getAdminSdkStatus().then((status) => {
      setIsSdkActive(status.isActive);
    });
  }, []);

  if (isSdkActive === null) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="secondary" className="text-xs sm:text-sm">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              SDK Admin
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Verificando estado del SDK...</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          {isSdkActive ? (
            <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm">
              <CheckCircle className="mr-2 h-4 w-4" />
              SDK Admin Activo
            </Badge>
          ) : (
            <Badge variant="destructive" className="text-xs sm:text-sm">
              <XCircle className="mr-2 h-4 w-4" />
              SDK Admin Inactivo
            </Badge>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isSdkActive
              ? "El SDK de Administrador está conectado y puede leer/escribir en Firestore."
              : "El SDK de Administrador no está inicializado. Revisa las variables de entorno del servidor."}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
