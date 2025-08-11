
import { z } from 'zod';
import type { FormField } from './form-defs';

export const buildZodSchema = (fields: FormField[]) => {
  const schemaShape: Record<string, z.ZodTypeAny> = {};
  
  fields.forEach(field => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
        case 'email':
            fieldSchema = z.string().email({ message: "Correo electrónico inválido." });
            break;
        case 'checkbox':
            fieldSchema = z.boolean().default(false);
            break;
        case 'number':
             fieldSchema = z.string().min(1, { message: `${field.label} es requerido.` });
             break;
        case 'tel':
        default:
            fieldSchema = z.string();
    }
    
    if (field.required && field.type !== 'checkbox') {
        fieldSchema = fieldSchema.min(1, { message: `${field.label} es requerido.` });
    }

    if (field.required && field.type === 'checkbox') {
        fieldSchema = fieldSchema.refine(val => val === true, {
            message: `${field.label} es requerido.`
        });
    }

    if(field.validationRegex) {
        try {
            const regex = new RegExp(field.validationRegex);
            fieldSchema = (fieldSchema as z.ZodString).regex(regex, { message: field.validationMessage || "Formato inválido."});
        } catch (e) {
            console.error("Invalid regex in form definition:", field.validationRegex)
        }
    }
    
    if (!field.required) {
        fieldSchema = fieldSchema.optional();
    }

    if ((field.type === 'radio' || field.type === 'select') && field.options && field.options.length > 0) {
        fieldSchema = z.enum(field.options as [string, ...string[]], {
            required_error: `${field.label} es requerido.`
        });
    }
    
    schemaShape[field.name] = fieldSchema;
  });

  return z.object(schemaShape);
};
