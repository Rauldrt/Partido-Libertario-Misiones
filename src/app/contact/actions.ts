
"use server";

import * as z from "zod";
import { addContactSubmission, contactFormSchema, type ContactFormValues } from "@/lib/contact-service";
import { revalidatePath } from "next/cache";

export type ContactFormState = {
  success: boolean;
  message?: string;
  errors?: z.ZodIssue[];
};

export async function submitContactForm(
  values: ContactFormValues
): Promise<ContactFormState> {
  const validatedFields = contactFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.issues,
      message: "Por favor, corrija los errores en el formulario.",
    };
  }

  try {
    await addContactSubmission(validatedFields.data);
    revalidatePath('/admin/manage-contact');
    return {
      success: true,
      message: "¡Gracias por tu mensaje! Nos pondremos en contacto con vos a la brevedad.",
    };
  } catch (error) {
     console.error("Error al guardar el mensaje de contacto:", error);
     return {
        success: false,
        message: "Ocurrió un error en el servidor. Por favor, intenta de nuevo más tarde.",
     };
  }
}
