
import { z } from 'zod';

// Defines a single field in a form
export const FormFieldSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'El nombre del campo es requerido.'),
  label: z.string().min(1, 'La etiqueta es requerida.'),
  type: z.enum(['text', 'email', 'tel', 'number', 'textarea', 'checkbox', 'radio', 'select']),
  placeholder: z.string().optional(),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(), // For radio/select
  order: z.number().int(),
  validationRegex: z.string().optional(),
  validationMessage: z.string().optional(),
});

// Defines a whole form
export const FormDefinitionSchema = z.object({
    id: z.string(),
    fields: z.array(FormFieldSchema)
});

export type FormField = z.infer<typeof FormFieldSchema>;
export type FormDefinition = z.infer<typeof FormDefinitionSchema>;

// A generic interface for any form submission
export interface FormSubmission {
    id: string;
    createdAt: Date;
    [key: string]: any; // To hold dynamic form fields
}

// Schema for the standard Contact Form
export const contactFormSchema = z.object({
  fullName: z.string().min(3, { message: "El nombre completo es requerido." }),
  email: z.string().email({ message: "Correo electrónico inválido." }),
  message: z.string().min(10, { message: "El mensaje debe tener al menos 10 caracteres." }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
