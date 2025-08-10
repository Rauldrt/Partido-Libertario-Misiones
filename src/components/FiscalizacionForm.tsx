
"use client";

import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { submitFiscalizacionForm, getFiscalizacionFormDef } from "@/app/fiscalizacion/actions";
import { Loader2 } from "lucide-react";
import { Skeleton } from './ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { buildZodSchema, type FormDefinition, type FormField as FormFieldType } from "@/lib/form-service";

const renderField = (fieldInfo: FormFieldType, control: any) => {
    return (
        <FormField
            key={fieldInfo.id}
            control={control}
            name={fieldInfo.name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{fieldInfo.label}</FormLabel>
                    <FormControl>
                        {fieldInfo.type === 'textarea' ? (
                            <Textarea placeholder={fieldInfo.placeholder} {...field} />
                        ) : fieldInfo.type === 'checkbox' ? (
                            <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                               <Checkbox
                                    id={fieldInfo.id}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                                <div className="space-y-1 leading-none">
                                    <label
                                        htmlFor={fieldInfo.id}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {fieldInfo.label}
                                    </label>
                                    {fieldInfo.placeholder && (
                                        <p className="text-sm text-muted-foreground">
                                           {fieldInfo.placeholder}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : fieldInfo.type === 'radio' && fieldInfo.options ? (
                             <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                            >
                                {fieldInfo.options.map(option => (
                                    <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value={option} />
                                        </FormControl>
                                        <FormLabel className="font-normal capitalize">{option.replace(/_/g, ' ')}</FormLabel>
                                    </FormItem>
                                ))}
                            </RadioGroup>
                        ) : fieldInfo.type === 'select' && fieldInfo.options ? (
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={fieldInfo.placeholder} />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {fieldInfo.options.map(option => (
                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <Input type={fieldInfo.type} placeholder={fieldInfo.placeholder} {...field} />
                        )}
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export function FiscalizacionForm() {
  const { toast } = useToast();
  const [formDefinition, setFormDefinition] = React.useState<FormDefinition | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const form = useForm({
    // resolver will be updated dynamically
  });

  React.useEffect(() => {
    const fetchAndSetForm = async () => {
        setIsLoading(true);
        try {
            const definition = await getFiscalizacionFormDef();
            if (!definition) {
                throw new Error('Error desconocido al cargar el formulario.');
            }
            setFormDefinition(definition);
            
            const schema = buildZodSchema(definition.fields);
            const defaultValues = Object.fromEntries(
                definition.fields.map(f => [f.name, f.type === 'checkbox' ? false : ''])
            );
            
            form.reset(defaultValues);
            (form as any)._options.resolver = zodResolver(schema);

        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cargar la definición del formulario.' });
        } finally {
            setIsLoading(false);
        }
    }
    fetchAndSetForm();
  }, [form, toast]);


  const { formState: { isSubmitting } } = form;

  async function onSubmit(values: Record<string, any>) {
    try {
      const result = await submitFiscalizacionForm(values);

      if (result.success) {
        toast({
          title: "¡Inscripción Exitosa!",
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
        description: "Ocurrió un error inesperado al procesar su solicitud. Por favor, inténtelo más tarde.",
        variant: "destructive",
      });
    }
  }

  if (isLoading || !formDefinition) {
    return (
        <div className="space-y-6">
            <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
            <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
            <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-24 w-full" /></div>
            <Skeleton className="h-12 w-full" />
        </div>
    )
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {formDefinition.fields.map(field => renderField(field, form.control))}
        
        <Button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-primary-foreground hover:from-orange-600 hover:to-amber-600 shadow-md transition-transform hover:scale-105" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando Inscripción...
            </>
          ) : (
            "Inscribirme para Fiscalizar"
          )}
        </Button>
      </form>
    </Form>
  );
}
