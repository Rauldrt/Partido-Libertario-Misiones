
'use server';

import * as z from "zod";
import { addAfiliacionSubmission } from "@/lib/afiliacion-service";
import { getFormDefinition } from "@/lib/form-service";
import { buildZodSchema } from "@/lib/zod-schema-builder";
import { revalidatePath } from "next/cache";
import type { FormDefinition } from "@/lib/form-defs";

export type AfiliacionFormState = {
  success: boolean;
  message?: string;
  errors?: z.ZodIssue[];
};

export async function getAfiliacionFormDef(): Promise<FormDefinition> {
    return getFormDefinition('afiliacion');
}

export async function submitAfiliacionForm(
  values: Record<string, any>
): Promise<AfiliacionFormState> {
  try {
    const formDefinition = await getFormDefinition('afiliacion');
    const validationSchema = buildZodSchema(formDefinition.fields);
    const validatedFields = validationSchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.issues,
        message: "Por favor, corrija los errores en el formulario.",
      };
    }

    await addAfiliacionSubmission(validatedFields.data);
    revalidatePath('/admin/manage-afiliaciones');
    return {
      success: true,
      message: "¡Gracias por afiliarte! Tu solicitud ha sido enviada con éxito.",
    };
  } catch (error) {
     console.error("Error al guardar la afiliación:", error);
     return {
        success: false,
        message: "Ocurrió un error en el servidor. Por favor, intenta de nuevo más tarde.",
     };
  }
}
