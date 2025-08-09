
'use server';

import * as z from "zod";
import { addAfiliacionSubmission, getFormDefinition, FormDefinition } from "@/lib/afiliacion-service";
import { revalidatePath } from "next/cache";

export type AfiliacionFormState = {
  success: boolean;
  message?: string;
  errors?: z.ZodIssue[];
};


// This function now dynamically builds a Zod schema from the form definition
async function getValidationSchema(): Promise<z.ZodObject<any, any, any>> {
  const formDefinition = await getFormDefinition();
  const schema = z.object(
    Object.fromEntries(
      formDefinition.fields.map(field => {
        let fieldSchema: z.ZodTypeAny = z.string(); // Default to string

        if (field.type === 'email') {
          fieldSchema = z.string().email({ message: "Correo electrónico inválido." });
        }
        
        if (field.type === 'number') {
           fieldSchema = z.string().regex(/^\d+$/, { message: "Debe ser un número." });
        }

        if (field.required) {
          fieldSchema = fieldSchema.min(1, { message: `${field.label} es requerido.` });
        } else {
          fieldSchema = fieldSchema.optional();
        }

        if(field.validationRegex) {
            try {
                const regex = new RegExp(field.validationRegex);
                fieldSchema = (fieldSchema as z.ZodString).regex(regex, { message: field.validationMessage || "Formato inválido."});
            } catch (e) {
                console.error("Invalid regex in form definition:", field.validationRegex)
            }
        }
        
        return [field.name, fieldSchema];
      })
    )
  );
  return schema;
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
