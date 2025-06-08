"use server";

import * as z from "zod";

const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(10).max(500),
});

export type ContactFormState = {
  success: boolean;
  message?: string;
  error?: string | null;
  errors?: {
    name?: string[];
    email?: string[];
    subject?: string[];
    message?: string[];
  };
};

export async function submitContactForm(
  values: z.infer<typeof contactFormSchema>
): Promise<ContactFormState> {
  const validatedFields = contactFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
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
