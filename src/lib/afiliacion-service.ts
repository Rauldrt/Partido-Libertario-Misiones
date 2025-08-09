import { getDb } from './firebase';
import { collection, getDocs, doc, addDoc, query, orderBy, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';
import { z } from 'zod';

// Defines a single field in a form
export const FormFieldSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  label: z.string().min(1),
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

// Represents a user's submission for a form
export interface AfiliacionSubmission {
    id: string;
    createdAt: Date;
    [key: string]: any; // To hold dynamic form fields
}

// --- Firestore Collection References ---
const getAfiliacionCollection = () => {
  const db = getDb();
  if (!db) throw new Error("Firestore is not initialized.");
  return collection(db, 'afiliaciones');
};

const getFormDefCollection = () => {
    const db = getDb();
    if (!db) throw new Error("Firestore is not initialized.");
    return collection(db, 'form-definitions');
};


// --- Helper Functions ---
const fromFirestore = (doc: any): AfiliacionSubmission => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(), // Convert Firestore Timestamp to Date
    };
};

const defaultAfiliacionFields: FormField[] = [
    { id: '1', name: 'fullName', label: 'Nombre y Apellido', type: 'text', placeholder: 'Javier G. Milei', required: true, order: 1 },
    { id: '2', name: 'dni', label: 'DNI (sin puntos)', type: 'number', placeholder: '22333444', required: true, order: 2, validationRegex: '^\\d{7,8}$', validationMessage: "El DNI debe tener 7 u 8 dígitos." },
    { id: '3', name: 'email', label: 'Correo Electrónico', type: 'email', placeholder: 'presidente@argentina.gob', required: true, order: 3 },
    { id: '4', name: 'phone', label: 'Teléfono', type: 'tel', placeholder: '011 4XXX XXXX', required: true, order: 4 },
    { id: '5', name: 'city', label: 'Localidad', type: 'text', placeholder: 'Posadas', required: true, order: 5 },
    { id: '6', name: 'address', label: 'Dirección', type: 'text', placeholder: 'Av. Corrientes 123', required: true, order: 6 },
];

// --- Public Service Functions ---

export async function getFormDefinition(): Promise<FormDefinition> {
    const docRef = doc(getFormDefCollection(), 'afiliacion');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        // Sort fields by order
        const data = docSnap.data() as FormDefinition;
        data.fields.sort((a, b) => a.order - b.order);
        return data;
    } else {
        // Seed with default data if it doesn't exist
        console.log("Seeding default form definition for 'afiliacion'.");
        const defaultFormDef: FormDefinition = { id: 'afiliacion', fields: defaultAfiliacionFields };
        await setDoc(docRef, defaultFormDef);
        return defaultFormDef;
    }
}

export async function addAfiliacionSubmission(submission: Record<string, any>): Promise<void> {
    const afiliacionCollection = getAfiliacionCollection();
    await addDoc(afiliacionCollection, {
        ...submission,
        createdAt: serverTimestamp(),
    });
}

export async function getAfiliacionSubmissions(): Promise<AfiliacionSubmission[]> {
    const afiliacionCollection = getAfiliacionCollection();
    const q = query(afiliacionCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return [];
    }
    
    return snapshot.docs.map(fromFirestore);
}
