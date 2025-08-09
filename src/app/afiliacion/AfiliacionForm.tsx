
"use client";

import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { submitAfiliacionForm } from "@/app/afiliacion/actions";
import { getFormDefinition, type FormDefinition, type FormField as FormFieldType } from "@/lib/afiliacion-service";
import { Loader2 } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';


// Helper to build a Zod schema from a form definition
const buildZodSchema = (fields: FormFieldType[]) => {
  const schemaShape: Record<string, z.ZodTypeAny> = {};
  fields.forEach(field => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
        case 'email':
            fieldSchema = z.string().email({ message: "Correo electrónico inválido." });
            break;
        case 'tel':
        case 'number':
            fieldSchema = z.string();
            break;
        case 'checkbox':
            fieldSchema = z.boolean().default(false);
            break;
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
    
    schemaShape[field.name] = fieldSchema;
  });
  return z.object(schemaShape);
};


const renderField = (field: FormFieldType, control: any) => {
    return (
        <FormField
            key={field.id}
            control={control}
            name={field.name}
            render={({ field: formField }) => (
                <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                        {field.type === 'textarea' ? (
                            <Textarea placeholder={field.placeholder} {...formField} />
                        ) : field.type === 'checkbox' ? (
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    checked={formField.value}
                                    onCheckedChange={formField.onChange}
                                />
                                <label
                                    htmlFor={field.name}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {field.placeholder}
                                </label>
                            </div>
                        ) : field.type === 'radio' && field.options ? (
                             <RadioGroup
                                onValueChange={formField.onChange}
                                defaultValue={formField.value}
                                className="flex flex-col space-y-1"
                            >
                                {field.options.map(option => (
                                    <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value={option} />
                                        </FormControl>
                                        <FormLabel className="font-normal">{option}</FormLabel>
                                    </FormItem>
                                ))}
                            </RadioGroup>
                        ) : field.type === 'select' && field.options ? (
                             <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={field.placeholder} />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {field.options.map(option => (
                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <Input type={field.type} placeholder={field.placeholder} {...formField} />
                        )}
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export function AfiliacionForm() {
  const { toast } = useToast();
  const [formDefinition, setFormDefinition] = useState<FormDefinition | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm({
      // Zod resolver will be updated dynamically in useEffect
  });

  useEffect(() => {
    const fetchFormDef = async () => {
      try {
        setIsLoading(true);
        const definition = await getFormDefinition();
        setFormDefinition(definition);
        
        // Dynamically create default values and resolver
        const defaultValues = Object.fromEntries(
          definition.fields.map(f => [f.name, f.type === 'checkbox' ? false : ''])
        );
        const schema = buildZodSchema(definition.fields);
        
        form.reset(defaultValues);
        // This is a way to update the resolver dynamically, though not officially documented
        (form as any)._options.resolver = zodResolver(schema);

      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cargar la definición del formulario.' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchFormDef();
  }, [form, toast]);


  const { formState: { isSubmitting } } = form;

  async function onSubmit(values: Record<string, any>) {
    try {
      const result = await submitAfiliacionForm(values);

      if (result.success) {
        toast({
          title: "¡Solicitud Enviada!",
          description: result.message,
        });
        form.reset();
      } else {
        form.clearErrors();
        result.errors?.forEach((error) => {
          form.setError(error.path[0] as any, {
            type: "manual",
            message: error.message,
          });
        });

        toast({
          title: "Error en el Formulario",
          description: result.message || "Por favor, revise los campos marcados en rojo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error Inesperado",
        description: "Ocurrió un error al procesar su solicitud. Por favor, inténtelo más tarde.",
        variant: "destructive",
      });
    }
  }
  
  if (isLoading || !formDefinition) {
    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
            </div>
             <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
            </div>
            <Skeleton className="h-12 w-full" />
        </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {formDefinition.fields.map(field => renderField(field, form.control))}
        
        <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-primary-foreground hover:from-cyan-600 hover:to-purple-600 shadow-md transition-transform hover:scale-105" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando Solicitud...
            </>
          ) : (
            "Enviar Solicitud de Afiliación"
          )}
        </Button>
      </form>
    </Form>
  );
}
