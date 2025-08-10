
'use server';

import { getDb } from './firebase';
import { collection, getDocs, doc, addDoc, query, orderBy, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';
import * as z from "zod";
import type { FormField } from './afiliacion-service';

// Now uses the same dynamic schema builder logic as afiliacion
const buildZodSchema = (fields: FormField[]) => {
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
    
    // For radio groups, ensure the value is one of the options
    if (field.type === 'radio' && field.options) {
        fieldSchema = z.enum(field.options as [string, ...string[]], {
            required_error: `${field.label} es requerido.`
        })
    }

    schemaShape[field.name] = fieldSchema;
  });
  return z.object(schemaShape);
};

export async function getFiscalizacionValidationSchema() {
    const { getFormDefinition } = await import('./afiliacion-service');
    const definition = await getFormDefinition('fiscalizacion');
    return buildZodSchema(definition.fields);
}

export type FiscalizacionFormValues = z.infer<Awaited<ReturnType<typeof getFiscalizacionValidationSchema>>>;

export interface FiscalizacionSubmission extends FiscalizacionFormValues {
    id: string;
    createdAt: Date;
}

const getFiscalizacionCollection = () => {
  const db = getDb();
  if (!db) {
    throw new Error("Firestore is not initialized.");
  }
  return collection(db, 'fiscalizaciones');
};

const fromFirestore = (doc: any): FiscalizacionSubmission => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(), // Convert Firestore Timestamp to Date
    };
};

export async function addFiscalizacionSubmission(submission: FiscalizacionFormValues): Promise<void> {
    const fiscalizacionCollection = getFiscalizacionCollection();
    await addDoc(fiscalizacionCollection, {
        ...submission,
        createdAt: serverTimestamp(),
    });
}

export async function getFiscalizacionSubmissions(): Promise<FiscalizacionSubmission[]> {
    const fiscalizacionCollection = getFiscalizacionCollection();
    const q = query(fiscalizacionCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return [];
    }
    
    return snapshot.docs.map(fromFirestore);
}
