
'use server';

import * as z from "zod";
import { addAfiliacionSubmission } from "@/lib/afiliacion-service";
import { getFormDefinition, buildZodSchema, type FormDefinition } from "@/lib/form-service";
import { revalidatePath } from "next/cache";

export type AfiliacionFormState = {
  success: boolean;
  message?: string;
  errors?: z.ZodIssue[];
};

export async function getAfiliacionFormDef(): Promise<FormDefinition> {
    return getFormDefinition('afiliacion');
}

// This function now dynamically builds a Zod schema from the form definition
async function getValidationSchema(): Promise<z.ZodObject<any, any, any>> {
  const formDefinition = await getFormDefinition('afiliacion');
  return buildZodSchema(formDefinition.fields);
}

export async function submitAfiliacionForm(
  values: Record<string, any>
): Promise<AfiliacionFormState> {
  const validationSchema = await getValidationSchema();
  const validatedFields = validationSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.issues,
      message: "Por favor, corrija los errores en el formulario.",
    };
  }

  try {
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
