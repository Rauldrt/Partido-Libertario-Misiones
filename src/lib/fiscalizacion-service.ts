
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

// Default fields, only used for seeding if the definition doesn't exist in Firestore
const defaultFiscalizacionFields: FormField[] = [
    { id: '1', name: 'fullName', label: 'Nombre y Apellido', type: 'text', placeholder: 'Victoria Villarruel', required: true, order: 1, validationRegex: '', validationMessage: '' },
    { id: '2', name: 'dni', label: 'DNI (sin puntos)', type: 'number', placeholder: '22333444', required: true, order: 2, validationRegex: '^\\d{7,8}$', validationMessage: "El DNI debe tener 7 u 8 dígitos." },
    { id: '3', name: 'email', label: 'Correo Electrónico', type: 'email', placeholder: 'vpv@gmail.com', required: true, order: 3, validationRegex: '', validationMessage: '' },
    { id: '4', name: 'phone', label: 'Teléfono', type: 'tel', placeholder: '011 4XXX XXXX', required: true, order: 4, validationRegex: '', validationMessage: '' },
    { id: '5', name: 'city', label: 'Localidad donde fiscalizarías', type: 'text', placeholder: 'Posadas', required: true, order: 5, validationRegex: '', validationMessage: '' },
    { id: '6', name: 'availability', label: '¿Qué disponibilidad tenés para el día de la elección?', type: 'radio', required: true, order: 6, options: ['completa', 'parcial', 'indistinta'], validationRegex: '', validationMessage: '' },
    { id: '7', name: 'previousExperience', label: 'Ya tengo experiencia fiscalizando', type: 'checkbox', required: false, order: 7, placeholder: 'Marcá esta casilla si ya participaste como fiscal en elecciones anteriores.', validationRegex: '', validationMessage: '' },
    { id: '8', name: 'notes', label: 'Aclaraciones (Opcional)', type: 'textarea', required: false, order: 8, placeholder: 'Dejanos cualquier otra información que consideres relevante.', validationRegex: '', validationMessage: '' },
]


// Export a validation schema that is built dynamically.
// This is more of an example, as the server actions will build it on-the-fly.
export let fiscalizacionFormSchema = z.object({});
export const getFiscalizacionValidationSchema = async () => {
    const { getFormDefinition } = await import('./afiliacion-service');
    const definition = await getFormDefinition('fiscalizacion');
    const fields = definition.fields.length > 0 ? definition.fields : defaultFiscalizacionFields;
    return buildZodSchema(fields);
}
getFiscalizacionValidationSchema().then(schema => fiscalizacionFormSchema = schema);

export type FiscalizacionFormValues = z.infer<typeof fiscalizacionFormSchema>;

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
