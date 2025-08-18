
'use server';

import { getAdminDb } from './firebase-admin';
import { collection, doc, setDoc, getDoc, type CollectionReference } from 'firebase/firestore';
import type { FormDefinition, FormField } from './form-defs';
import fs from 'fs/promises';
import path from 'path';

// --- Default Form Definitions ---
const defaultAfiliacionFields: FormField[] = [
    { id: '1', name: 'fullName', label: 'Nombre y Apellido', type: 'text', placeholder: 'Javier G. Milei', required: true, order: 1, validationRegex: '', validationMessage: '' },
    { id: '2', name: 'dni', label: 'DNI (sin puntos)', type: 'tel', placeholder: '22333444', required: true, order: 2, validationRegex: '^\\d{7,8}$', validationMessage: "El DNI debe tener 7 u 8 dígitos." },
    { id: '3', name: 'email', label: 'Correo Electrónico', type: 'email', placeholder: 'presidente@argentina.gob', required: true, order: 3, validationRegex: '', validationMessage: '' },
    { id: '4', name: 'phone', label: 'Teléfono', type: 'tel', placeholder: '011 4XXX XXXX', required: true, order: 4, validationRegex: '', validationMessage: '' },
    { id: '5', name: 'city', label: 'Localidad', type: 'text', placeholder: 'Posadas', required: true, order: 5, validationRegex: '', validationMessage: '' },
    { id: '6', name: 'address', label: 'Dirección', type: 'text', placeholder: 'Av. Corrientes 123', required: true, order: 6, validationRegex: '', validationMessage: '' },
];

const defaultContactoFields: FormField[] = [
    { id: 'c1', name: 'fullName', label: 'Nombre y Apellido', type: 'text', placeholder: 'John Doe', required: true, order: 1, validationRegex: '', validationMessage: '' },
    { id: 'c2', name: 'email', label: 'Correo Electrónico', type: 'email', placeholder: 'john.doe@example.com', required: true, order: 2, validationRegex: '', validationMessage: '' },
    { id: 'c3', name: 'message', label: 'Tu Mensaje', type: 'textarea', placeholder: 'Escribí acá tu consulta o propuesta...', required: true, order: 3, validationRegex: '', validationMessage: '' },
];

const defaultFiscalizacionFields: FormField[] = [
    { id: 'f1', name: 'fullName', label: 'Nombre y Apellido', type: 'text', placeholder: 'Victoria Villarruel', required: true, order: 1, validationRegex: '', validationMessage: '' },
    { id: 'f2', name: 'dni', label: 'DNI (sin puntos)', type: 'tel', placeholder: '22333444', required: true, order: 2, validationRegex: '^\\d{7,8}$', validationMessage: "El DNI debe tener 7 u 8 dígitos." },
    { id: 'f3', name: 'email', label: 'Correo Electrónico', type: 'email', placeholder: 'vpv@gmail.com', required: true, order: 3, validationRegex: '', validationMessage: '' },
    { id: 'f4', name: 'phone', label: 'Teléfono', type: 'tel', placeholder: '011 4XXX XXXX', required: true, order: 4, validationRegex: '', validationMessage: '' },
    { id: 'f5', name: 'city', label: 'Localidad donde fiscalizarías', type: 'text', placeholder: 'Posadas', required: true, order: 5, validationRegex: '', validationMessage: '' },
    { id: 'f6', name: 'availability', label: '¿Qué disponibilidad tenés para el día de la elección?', type: 'radio', required: true, order: 6, options: ['completa', 'parcial', 'indistinta'], validationRegex: '', validationMessage: '' },
    { id: 'f7', name: 'previousExperience', label: 'Ya tengo experiencia fiscalizando', type: 'checkbox', required: false, order: 7, placeholder: 'Marcá esta casilla si ya participaste como fiscal en elecciones anteriores.', validationRegex: '', validationMessage: '' },
    { id: 'f8', name: 'notes', label: 'Aclaraciones (Opcional)', type: 'textarea', required: false, order: 8, placeholder: 'Dejanos cualquier otra información que consideres relevante.', validationRegex: '', validationMessage: '' },
];

const defaultFormDefinitions: Record<string, FormDefinition> = {
    afiliacion: { id: 'afiliacion', fields: defaultAfiliacionFields },
    fiscalizacion: { id: 'fiscalizacion', fields: defaultFiscalizacionFields },
    contacto: { id: 'contacto', fields: defaultContactoFields },
};

// --- Public Service Functions ---

export async function getFormDefinition(formId: 'afiliacion' | 'fiscalizacion' | 'contacto'): Promise<FormDefinition> {
    const defaults = defaultFormDefinitions[formId];
    try {
        const db = await getAdminDb();
        if (!db) {
            throw new Error("Admin SDK no inicializado.");
        }
        const formDefCollection = collection(db, 'form-definitions');
        const docRef = doc(formDefCollection, formId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data() as FormDefinition;
            data.fields.sort((a, b) => a.order - b.order);
            return data;
        } else {
            console.log(`Sembrando definición por defecto para '${formId}' en Firestore.`);
            await setDoc(docRef, defaults);
            return defaults;
        }
    } catch (error) {
        console.error(`Error obteniendo la definición del formulario '${formId}', usando respaldo local:`, error);
        return defaults;
    }
}

export async function saveFormDefinition(formId: string, fields: FormField[]): Promise<void> {
    const db = await getAdminDb();
    if (!db) {
        throw new Error("No se puede guardar la definición del formulario: El SDK de Administrador no está inicializado.");
    }
    const dataToSave = { id: formId, fields };
    const formDefCollection = collection(db, 'form-definitions');
    const docRef = doc(formDefCollection, formId);
    await setDoc(docRef, dataToSave);
}
