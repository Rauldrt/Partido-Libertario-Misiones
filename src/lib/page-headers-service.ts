
'use server';

import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';

const PageHeaderSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string(),
});

export type PageHeaderData = z.infer<typeof PageHeaderSchema>;

export type PageHeadersData = {
  [key: string]: PageHeaderData;
};

const filePath = path.join(process.cwd(), 'data', 'page-headers.json');

const defaultData: PageHeadersData = {
    news: {
      title: 'Noticias y Eventos',
      description: 'Mantenete al tanto de las últimas novedades y próximos encuentros del Partido Libertario de Misiones.',
      icon: 'Newspaper',
    },
    about: {
      title: 'Quiénes Somos',
      description: 'El Partido Libertario de Misiones es un espacio de ciudadanos comprometidos con las ideas de la libertad, la república y la prosperidad.',
      icon: 'Users',
    },
    referentes: {
      title: 'Nuestros Referentes',
      description: 'Conocé a las personas que lideran e inspiran nuestro movimiento en la provincia de Misiones.',
      icon: 'Star',
    },
    contact: {
      title: 'Ponete en Contacto',
      description: 'Estamos para escucharte. Envianos tu consulta, propuesta o sumate a nuestro equipo.',
      icon: 'MessageSquare',
    }
};


async function readData(): Promise<PageHeadersData> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const items = JSON.parse(data);
    return items;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    console.error(`Failed to read data from ${filePath}:`, error);
    throw new Error(`Could not retrieve items from ${filePath}.`);
  }
}

async function writeData(data: PageHeadersData): Promise<void> {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error(`Failed to write data to ${filePath}:`, error);
        throw new Error(`Could not save items to ${filePath}.`);
    }
}

export async function getAllPageHeaders(): Promise<PageHeadersData> {
  return readData();
}

export async function getPageHeaderData(pageKey: string): Promise<PageHeaderData | undefined> {
    const allData = await readData();
    return allData[pageKey];
}

export async function saveAllPageHeaders(data: PageHeadersData): Promise<void> {
    const PageHeadersSchema = z.record(z.string(), PageHeaderSchema);
    const validation = PageHeadersSchema.safeParse(data);

    if (!validation.success) {
        console.error(validation.error.issues);
        throw new Error('Datos de encabezados inválidos.');
    }

    await writeData(validation.data);
}
