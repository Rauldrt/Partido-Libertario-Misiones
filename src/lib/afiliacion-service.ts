
import { getDb } from './firebase';
import { collection, getDocs, doc, addDoc, query, orderBy, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';
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
    { id: '1', name: 'fullName', label: 'Nombre y Apellido', type: 'text', placeholder: 'Javier G. Milei', required: true, order: 1, validationRegex: '', validationMessage: '' },
    { id: '2', name: 'dni', label: 'DNI (sin puntos)', type: 'number', placeholder: '22333444', required: true, order: 2, validationRegex: '^\\d{7,8}$', validationMessage: "El DNI debe tener 7 u 8 dígitos." },
    { id: '3', name: 'email', label: 'Correo Electrónico', type: 'email', placeholder: 'presidente@argentina.gob', required: true, order: 3, validationRegex: '', validationMessage: '' },
    { id: '4', name: 'phone', label: 'Teléfono', type: 'tel', placeholder: '011 4XXX XXXX', required: true, order: 4, validationRegex: '', validationMessage: '' },
    { id: '5', name: 'city', label: 'Localidad', type: 'text', placeholder: 'Posadas', required: true, order: 5, validationRegex: '', validationMessage: '' },
    { id: '6', name: 'address', label: 'Dirección', type: 'text', placeholder: 'Av. Corrientes 123', required: true, order: 6, validationRegex: '', validationMessage: '' },
];

const defaultContactoFields: FormField[] = [
    { id: 'c1', name: 'fullName', label: 'Nombre y Apellido', type: 'text', placeholder: 'John Doe', required: true, order: 1, validationRegex: '', validationMessage: '' },
    { id: 'c2', name: 'email', label: 'Correo Electrónico', type: 'email', placeholder: 'john.doe@example.com', required: true, order: 2, validationRegex: '', validationMessage: '' },
    { id: 'c3', name: 'message', label: 'Tu Mensaje', type: 'textarea', placeholder: 'Escribí acá tu consulta o propuesta...', required: true, order: 3, validationRegex: '', validationMessage: '' },
]


// --- Public Service Functions ---

export async function getFormDefinition(formId: 'afiliacion' | 'fiscalizacion' | 'contacto'): Promise<FormDefinition> {
    const docRef = doc(getFormDefCollection(), formId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data() as FormDefinition;
        data.fields.sort((a, b) => a.order - b.order);
        return data;
    } else {
        // Seed with default data if it doesn't exist
        console.log(`Seeding default form definition for '${formId}'.`);
        
        let defaultFields: FormField[] = [];
        if (formId === 'afiliacion') {
            defaultFields = defaultAfiliacionFields;
        } else if (formId === 'contacto') {
            defaultFields = defaultContactoFields;
        }
        
        const defaultFormDef: FormDefinition = { id: formId, fields: defaultFields };
        await setDoc(docRef, defaultFormDef);
        return defaultFormDef;
    }
}

export async function saveFormDefinition(formId: string, fields: FormField[]): Promise<void> {
    const docRef = doc(getFormDefCollection(), formId);
    const dataToSave: FormDefinition = {
        id: formId,
        fields: fields.map((field, index) => ({...field, order: index})) // Re-assign order based on array index
    }
    await setDoc(docRef, dataToSave);
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
