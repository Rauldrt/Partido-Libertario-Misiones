
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
      case 'tel':
      case 'text':
      case 'textarea':
        fieldSchema = z.string();
        break;
      case 'radio':
      case 'select':
        if (field.options && field.options.length > 0) {
          fieldSchema = z.enum(field.options as [string, ...string[]]);
        } else {
          fieldSchema = z.string(); // Fallback to string if no options
        }
        break;
      default:
        fieldSchema = z.string();
    }
    
    // Apply required/optional constraints first
    if (field.required) {
        if (field.type === 'checkbox') {
            fieldSchema = fieldSchema.refine(val => val === true, {
                message: `${field.label} es requerido.`
            });
        } else if (field.type === 'text' || field.type === 'textarea' || field.type === 'tel' || field.type === 'number' || field.type === 'email') {
             fieldSchema = fieldSchema.min(1, { message: `${field.label} es requerido.` });
        } else if ((field.type === 'radio' || field.type === 'select')) {
             fieldSchema = fieldSchema.refine(val => val !== undefined && val !== null && val !== '', {
                message: `${field.label} es requerido.`
            });
        }
    } else {
        fieldSchema = fieldSchema.optional();
    }

    if(field.validationRegex && fieldSchema instanceof z.ZodString) {
        try {
            const regex = new RegExp(field.validationRegex);
            fieldSchema = fieldSchema.regex(regex, { message: field.validationMessage || "Formato inválido."});
        } catch (e) {
            console.error("Invalid regex in form definition:", field.validationRegex)
        }
    }
    
    schemaShape[field.name] = fieldSchema;
  });

  return z.object(schemaShape);
};
