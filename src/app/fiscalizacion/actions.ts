
"use server";

import * as z from "zod";
import { addFiscalizacionSubmission } from "@/lib/fiscalizacion-service";
import { revalidatePath } from "next/cache";

export const fiscalizacionFormSchema = z.object({
  fullName: z.string().min(3, { message: "El nombre completo es requerido." }),
  dni: z.string().regex(/^\d{7,8}$/, { message: "El DNI debe tener 7 u 8 dígitos." }),
  email: z.string().email({ message: "Correo electrónico inválido." }),
  phone: z.string().min(7, { message: "El teléfono es requerido." }),
  city: z.string().min(3, { message: "La localidad es requerida." }),
  previousExperience: z.boolean().default(false),
  availability: z.enum(["completa", "parcial", "indistinta"], {
    required_error: "Debe seleccionar una disponibilidad.",
  }),
  notes: z.string().max(300, { message: "Las notas no pueden exceder los 300 caracteres." }).optional(),
});

export type FiscalizacionFormValues = z.infer<typeof fiscalizacionFormSchema>;

export type FiscalizacionFormState = {
  success: boolean;
  message?: string;
  errors?: z.ZodIssue[];
};

export async function submitFiscalizacionForm(
  values: FiscalizacionFormValues
): Promise<FiscalizacionFormState> {
  const validatedFields = fiscalizacionFormSchema.safeParse(values);

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
