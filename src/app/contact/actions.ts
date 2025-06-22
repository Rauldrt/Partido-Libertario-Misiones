
"use server";

import * as z from "zod";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, ingrese un correo electrónico válido." }),
  subject: z.string().min(5, { message: "El asunto debe tener al menos 5 caracteres." }),
  message: z.string().min(10, { message: "El mensaje debe tener al menos 10 caracteres." }).max(500, { message: "El mensaje no puede exceder los 500 caracteres." }),
});

export type ContactFormState = {
  success: boolean;
  message?: string;
  errors?: z.ZodIssue[];
};

export async function submitContactForm(
  values: z.infer<typeof contactFormSchema>
): Promise<ContactFormState> {
  const validatedFields = contactFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.issues,
      message: "Por favor corrija los errores en el formulario.",
    };
  }

  // Simulate form submission
  console.log("Formulario de contacto recibido:", validatedFields.data);

  // In a real application, you would send an email, save to a database, etc.
  // For example:
  // try {
  //   await sendEmail({
  //     to: "partidolibertariomisiones@example.com",
  //     from: "noreply@example.com",
  //     subject: `Nuevo Mensaje: ${validatedFields.data.subject}`,
  //     html: `
  //       <p><strong>Nombre:</strong> ${validatedFields.data.name}</p>
  //       <p><strong>Email:</strong> ${validatedFields.data.email}</p>
  //       <p><strong>Mensaje:</strong></p>
  //       <p>${validatedFields.data.message}</p>
  //     `,
  //   });
  // } catch (error) {
  //   console.error("Error sending email:", error);
  //   return {
  //     success: false,
  //     error: "No se pudo enviar el mensaje. Inténtelo de nuevo más tarde.",
  //   };
  // }

  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    success: true,
    message: "¡Mensaje enviado con éxito!",
  };
}
