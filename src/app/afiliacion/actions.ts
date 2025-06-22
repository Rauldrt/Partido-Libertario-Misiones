
"use server";

import * as z from "zod";

const affiliationFormSchema = z.object({
  fullName: z.string().min(3, { message: "El nombre completo es requerido." }),
  dni: z.string().regex(/^\d{7,8}$/, { message: "El DNI debe tener 7 u 8 dígitos." }),
  birthDate: z.date({
    required_error: "La fecha de nacimiento es requerida.",
  }),
  email: z.string().email({ message: "Correo electrónico inválido." }),
  phone: z.string().min(7, { message: "El teléfono es requerido." }),
  address: z.string().min(5, { message: "El domicilio es requerido." }),
  city: z.string().min(3, { message: "La localidad es requerida." }),
  postalCode: z.string().min(4, { message: "El código postal es requerido." }),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "Debes aceptar los principios del partido para afiliarte.",
  }),
});

export type AffiliationFormValues = z.infer<typeof affiliationFormSchema>;

export type AffiliationFormState = {
  success: boolean;
  message?: string;
  errors?: z.ZodIssue[];
};

export async function submitAffiliationForm(
  values: AffiliationFormValues
): Promise<AffiliationFormState> {

  const validatedFields = affiliationFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.issues,
      message: "Por favor, corrija los errores en el formulario.",
    };
  }

  // Simulate form submission to a database or external service
  console.log("Nueva solicitud de afiliación recibida:", validatedFields.data);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // In a real application, you would handle database errors here
  // try {
  //   await db.saveAffiliation(validatedFields.data);
  // } catch (e) {
  //   return {
  //     success: false,
  //     message: "Error al procesar la afiliación. Inténtelo de nuevo más tarde."
  //   }
  // }

  return {
    success: true,
    message: "¡Solicitud de afiliación enviada con éxito! Pronto nos pondremos en contacto.",
  };
}
