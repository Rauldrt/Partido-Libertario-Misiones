
'use server';

import * as z from "zod";
import { addFiscalizacionSubmission } from "@/lib/fiscalizacion-service";
import { getFiscalizacionValidationSchema } from "@/lib/form-service";
import { revalidatePath } from "next/cache";

export type FiscalizacionFormState = {
  success: boolean;
  message?: string;
  errors?: z.ZodIssue[];
};

export async function submitFiscalizacionForm(
  values: z.infer<z.ZodObject<any>>
): Promise<FiscalizacionFormState> {
  const validationSchema = await getFiscalizacionValidationSchema();
  const validatedFields = validationSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.issues,
      message: "Por favor, corrija los errores en el formulario.",
    };
  }

  try {
    await addFiscalizacionSubmission(validatedFields.data);
    revalidatePath('/admin/manage-fiscales');
    return {
      success: true,
      message: "¡Inscripción para fiscalizar enviada con éxito! Gracias por tu compromiso.",
    };
  } catch (error) {
     console.error("Error al guardar la inscripción:", error);
     return {
        success: false,
        message: "Ocurrió un error en el servidor. Por favor, intenta de nuevo más tarde.",
     };
  }
}
