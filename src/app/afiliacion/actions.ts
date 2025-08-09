
"use server";

import * as z from "zod";
import { addAfiliacionSubmission } from "@/lib/afiliacion-service";
import { revalidatePath } from "next/cache";

export const afiliacionFormSchema = z.object({
  fullName: z.string().min(3, { message: "El nombre completo es requerido." }),
  dni: z.string().regex(/^\d{7,8}$/, { message: "El DNI debe tener 7 u 8 dígitos." }),
  email: z.string().email({ message: "Correo electrónico inválido." }),
  phone: z.string().min(7, { message: "El teléfono es requerido." }),
  city: z.string().min(3, { message: "La localidad es requerida." }),
  address: z.string().min(5, { message: "La dirección es requerida." }),
});

export type AfiliacionFormValues = z.infer<typeof afiliacionFormSchema>;

export type AfiliacionFormState = {
  success: boolean;
  message?: string;
  errors?: z.ZodIssue[];
};

export async function submitAfiliacionForm(
  values: AfiliacionFormValues
): Promise<AfiliacionFormState> {
  const validatedFields = afiliacionFormSchema.safeParse(values);

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
