
"use client";

import React, { useMemo } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { buildZodSchema } from "@/lib/zod-schema-builder";
import type { FormDefinition, FormField as FormFieldType, FormSubmission } from "@/lib/form-defs";
import { Loader2 } from "lucide-react";
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DialogFooter } from '@/components/ui/dialog';

const renderField = (fieldInfo: FormFieldType, control: any) => {
    const commonProps = {
        key: fieldInfo.id,
        control: control,
        name: fieldInfo.name,
    };

    return (
        <FormField
            {...commonProps}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{fieldInfo.label}</FormLabel>
                    <FormControl>
                        {fieldInfo.type === 'textarea' ? (
                            <Textarea placeholder={fieldInfo.placeholder} {...field} />
                        ) : fieldInfo.type === 'checkbox' ? (
                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox
                                    id={fieldInfo.id}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                                <label
                                    htmlFor={fieldInfo.id}
                                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {fieldInfo.placeholder || fieldInfo.label}
                                </label>
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
                                        <FormLabel className="font-normal">{option}</FormLabel>
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

interface SubmissionEditFormProps {
  formDefinition: FormDefinition;
  submission: FormSubmission;
  onSave: (data: Record<string, any>) => Promise<{ success: boolean; message: string; }>;
}

export function SubmissionEditForm({ formDefinition, submission, onSave }: SubmissionEditFormProps) {
  const { toast } = useToast();

  const formSchema = useMemo(() => buildZodSchema(formDefinition.fields), [formDefinition]);
  const defaultValues = useMemo(() => {
    const values: Record<string, any> = {};
    formDefinition.fields.forEach(field => {
        values[field.name] = submission[field.name] ?? (field.type === 'checkbox' ? false : '');
    });
    return values;
  }, [formDefinition, submission]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { formState: { isSubmitting } } = form;

  async function onSubmit(values: Record<string, any>) {
    try {
      const result = await onSave(values);
      if (result.success) {
        toast({
          title: "¡Guardado!",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error Inesperado",
        description: "Ocurrió un error al procesar su solicitud.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4">
                {formDefinition.fields.map(field => renderField(field, form.control))}
            </div>
        </ScrollArea>
        <DialogFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
                </>
            ) : (
                "Guardar Cambios"
            )}
            </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
