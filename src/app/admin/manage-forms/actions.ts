
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { FormFieldSchema, saveFormDefinition, getFormDefinition, type FormDefinition } from '@/lib/afiliacion-service';

const FormDefinitionUpdateSchema = z.object({
  id: z.string(),
  fields: z.array(FormFieldSchema)
})

export async function saveFormDefinitionAction(data: FormDefinition) {
  const validation = FormDefinitionUpdateSchema.safeParse(data);
  if (!validation.success) {
    console.error(validation.error.issues);
    return { success: false, message: 'Datos inválidos.' };
  }

  try {
    await saveFormDefinition(validation.data.id, validation.data.fields);
    revalidatePath(`/afiliacion`);
    revalidatePath(`/fiscalizacion`);
    revalidatePath(`/contact`);
    revalidatePath(`/admin/manage-forms`);
    return { success: true, message: `¡Formulario '${validation.data.id}' guardado con éxito!` };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function getFormDefinitionAction(formId: 'afiliacion' | 'fiscalizacion') {
    try {
        const definition = await getFormDefinition(formId);
        return { success: true, definition };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}
