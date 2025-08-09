
"use client";

import React, { useState, useTransition } from 'react';
import type { FormDefinition, FormField } from '@/lib/afiliacion-service';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GripVertical, Loader2, Plus, Save, Trash2, Settings2, ShieldAlert } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { saveFormDefinitionAction } from './actions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const FORM_NAMES = {
    afiliacion: 'Formulario de Afiliación',
    fiscalizacion: 'Formulario de Fiscalización',
    // contacto: 'Formulario de Contacto',
};

const SortableFieldItem = ({
    field,
    setFields,
    isPending,
}: {
    field: FormField;
    setFields: React.Dispatch<React.SetStateAction<FormField[]>>;
    isPending: boolean;
}) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id });
    const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

    const handleInputChange = (prop: keyof FormField, value: any) => {
        setFields(prev => prev.map(f => f.id === field.id ? { ...f, [prop]: value } : f));
    };
    
    const handleDelete = () => {
        setFields(prev => prev.filter(f => f.id !== field.id));
    };

    const isNameFieldReadonly = ['fullName', 'email', 'message'].includes(field.name);

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <AccordionItem value={field.id} className="border-b-0 mb-4 bg-muted/30 rounded-lg overflow-hidden">
                <div className="flex items-center p-2 border-b">
                    <Button variant="ghost" size="icon" {...listeners} className="cursor-grab p-2"><GripVertical /></Button>
                    <AccordionTrigger className="flex-1 p-2 hover:no-underline">
                        <span className="font-semibold text-left truncate">{field.label || 'Nuevo Campo'}</span>
                    </AccordionTrigger>
                    <Button variant="destructive" size="icon" onClick={handleDelete} disabled={isPending} className="ml-2"><Trash2 /></Button>
                </div>
                <AccordionContent>
                    <CardContent className="p-4 pt-4 grid gap-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`label-${field.id}`}>Etiqueta (Visible)</Label>
                                <Input id={`label-${field.id}`} value={field.label} onChange={(e) => handleInputChange('label', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor={`name-${field.id}`}>Nombre del Campo (ID)</Label>
                                <Input id={`name-${field.id}`} value={field.name} onChange={(e) => handleInputChange('name', e.target.value)} disabled={isNameFieldReadonly} />
                                {isNameFieldReadonly && <p className="text-xs text-muted-foreground">Este nombre no se puede cambiar.</p>}
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`type-${field.id}`}>Tipo de Campo</Label>
                                <Select onValueChange={(v) => handleInputChange('type', v)} defaultValue={field.type}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="text">Texto</SelectItem>
                                        <SelectItem value="email">Email</SelectItem>
                                        <SelectItem value="tel">Teléfono</SelectItem>
                                        <SelectItem value="number">Número</SelectItem>
                                        <SelectItem value="textarea">Área de Texto</SelectItem>
                                        <SelectItem value="checkbox">Checkbox</SelectItem>
                                        <SelectItem value="radio">Botones de Radio</SelectItem>
                                        <SelectItem value="select">Menú Desplegable</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`placeholder-${field.id}`}>Texto de Ejemplo (Placeholder)</Label>
                                <Input id={`placeholder-${field.id}`} value={field.placeholder || ''} onChange={(e) => handleInputChange('placeholder', e.target.value)} />
                            </div>
                        </div>
                        {(field.type === 'radio' || field.type === 'select') && (
                            <div className="space-y-2">
                                <Label>Opciones (una por línea)</Label>
                                <Textarea value={(field.options || []).join('\n')} onChange={(e) => handleInputChange('options', e.target.value.split('\n'))} />
                            </div>
                        )}
                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox id={`required-${field.id}`} checked={field.required} onCheckedChange={(c) => handleInputChange('required', c)} />
                            <Label htmlFor={`required-${field.id}`}>Este campo es obligatorio</Label>
                        </div>

                         <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="validation">
                                <AccordionTrigger className="text-sm"><Settings2 className="mr-2 h-4 w-4"/>Reglas de Validación (Avanzado)</AccordionTrigger>
                                <AccordionContent className="pt-4 space-y-4">
                                     <div className="space-y-2">
                                        <Label htmlFor={`validationRegex-${field.id}`}>Expresión Regular (Regex)</Label>
                                        <Input id={`validationRegex-${field.id}`} value={field.validationRegex || ''} onChange={(e) => handleInputChange('validationRegex', e.target.value)} className="font-mono text-xs" />
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor={`validationMessage-${field.id}`}>Mensaje de Error de Validación</Label>
                                        <Input id={`validationMessage-${field.id}`} value={field.validationMessage || ''} onChange={(e) => handleInputChange('validationMessage', e.target.value)} />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </AccordionContent>
            </AccordionItem>
        </div>
    );
};

const FormEditor = ({
    formDef,
    onSave,
}: {
    formDef: FormDefinition;
    onSave: (data: FormDefinition) => void;
}) => {
    const [fields, setFields] = useState<FormField[]>(formDef.fields);
    const [isPending, startTransition] = useTransition();

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setFields(items => arrayMove(items, items.findIndex(i => i.id === active.id), items.findIndex(i => i.id === over.id)));
        }
    };

    const handleAddField = () => {
        const newField: FormField = {
            id: `new-${Date.now()}`,
            name: `campo_${Date.now()}`,
            label: 'Nuevo Campo',
            type: 'text',
            required: false,
            order: fields.length,
        };
        setFields(prev => [...prev, newField]);
    };

    const handleSaveChanges = () => {
        startTransition(() => {
            onSave({ ...formDef, fields });
        });
    }

    return (
        <div className="space-y-6">
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                    <Accordion type="multiple" className="w-full space-y-0">
                        {fields.map(field => (
                            <SortableFieldItem key={field.id} field={field} setFields={setFields} isPending={isPending} />
                        ))}
                    </Accordion>
                </SortableContext>
            </DndContext>

            {fields.length === 0 && (
                 <div className="text-center p-8 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Este formulario no tiene campos. ¡Añade el primero!</p>
                </div>
            )}
            
            <div className="flex justify-between items-center pt-4 border-t">
                <Button onClick={handleAddField} disabled={isPending}><Plus className="mr-2 h-4 w-4" />Añadir Campo</Button>
                <Button onClick={handleSaveChanges} disabled={isPending} size="lg">
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Guardar Cambios
                </Button>
            </div>
        </div>
    );
};


export function FormEditorClient({ initialForms }: { initialForms: Record<string, FormDefinition> }) {
  const [forms, setForms] = useState(initialForms);
  const { toast } = useToast();

  const handleSaveForm = async (data: FormDefinition) => {
    const result = await saveFormDefinitionAction(data);
    if (result.success) {
      toast({ title: "¡Éxito!", description: result.message });
      // Update local state after successful save
      setForms(prev => ({ ...prev, [data.id]: data }));
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };

  return (
    <div className="space-y-6">
        <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>¡Atención! Zona Avanzada</AlertTitle>
            <AlertDescription>
                Modificar los **Nombres de Campo (ID)** puede romper la forma en que se guardan y muestran los datos si no se hace con cuidado. Se recomienda no cambiar los nombres de los campos existentes a menos que sepas lo que estás haciendo.
            </AlertDescription>
        </Alert>
        <Tabs defaultValue={Object.keys(FORM_NAMES)[0]} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                {Object.entries(FORM_NAMES).map(([key, name]) => (
                    <TabsTrigger key={key} value={key}>{name}</TabsTrigger>
                ))}
            </TabsList>
            {Object.entries(forms).map(([key, formDef]) => (
                 <TabsContent key={key} value={key}>
                    <Card className="mt-4">
                        <CardContent className="pt-6">
                             <FormEditor formDef={formDef} onSave={handleSaveForm} />
                        </CardContent>
                    </Card>
                </TabsContent>
            ))}
        </Tabs>
    </div>
  );
}
