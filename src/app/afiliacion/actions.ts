
'use server';

import * as z from "zod";
import { addAfiliacionSubmission, getFormDefinition, FormField } from "@/lib/afiliacion-service";
import { revalidatePath } from "next/cache";

export type AfiliacionFormState = {
  success: boolean;
  message?: string;
  errors?: z.ZodIssue[];
};

// This function now dynamically builds a Zod schema from the form definition
async function getValidationSchema(): Promise<z.ZodObject<any, any, any>> {
  const formDefinition = await getFormDefinition('afiliacion');
  
  const schemaShape = Object.fromEntries(
      formDefinition.fields.map(field => {
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
        
        if (field.type === 'radio' && field.options) {
             fieldSchema = z.enum(field.options as [string, ...string[]], {
                required_error: `${field.label} es requerido.`
            })
        }

        return [field.name, fieldSchema];
      })
    );

  return z.object(schemaShape);
}

export async function submitAfiliacionForm(
  values: Record<string, any>
): Promise<AfiliacionFormState> {
  const validationSchema = await getValidationSchema();
  const validatedFields = validationSchema.safeParse(values);

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
