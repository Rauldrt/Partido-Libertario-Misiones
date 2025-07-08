
'use server';

import { z } from 'zod';
import { saveAllowedHosts, type HostPattern } from '@/lib/config-service';

const HostPatternSchema = z.object({
  protocol: z.literal('https'),
  hostname: z.string().min(1, 'El hostname es requerido.'),
  port: z.literal(''),
  pathname: z.literal('/**'),
});

const AllowedHostsSchema = z.array(HostPatternSchema);

export async function saveAllowedHostsAction(data: Omit<HostPattern, 'id'>[]) {
    const validation = AllowedHostsSchema.safeParse(data);

    if (!validation.success) {
        console.error(validation.error.issues);
        return { success: false, message: 'Datos inválidos. Por favor, revise todos los campos.' };
    }

    try {
        await saveAllowedHosts(validation.data);
        return { 
            success: true, 
            message: '¡Hosts guardados con éxito! Es necesario reiniciar la aplicación para que los cambios surtan efecto.' 
        };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}
