
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { submitFiscalizacionForm } from "@/app/fiscalizacion/actions";
import { Loader2 } from "lucide-react";
import { fiscalizacionFormSchema, type FiscalizacionFormValues } from "@/lib/fiscalizacion-service";

export function FiscalizacionForm() {
  const { toast } = useToast();
  const form = useForm<FiscalizacionFormValues>({
    resolver: zodResolver(fiscalizacionFormSchema),
    defaultValues: {
      fullName: "",
      dni: "",
      email: "",
      phone: "",
      city: "",
      previousExperience: false,
      notes: "",
    },
  });

  const { formState: { isSubmitting } } = form;

  async function onSubmit(values: FiscalizacionFormValues) {
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
          form.setError(error.path[0] as keyof FiscalizacionFormValues, {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Nombre y Apellido</FormLabel>
                <FormControl>
                    <Input placeholder="Victoria Villarruel" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="dni"
            render={({ field }) => (
                <FormItem>
                <FormLabel>DNI (sin puntos)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="22333444" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="vpv@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="011 4XXX XXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Localidad donde fiscalizarías</FormLabel>
              <FormControl>
                <Input placeholder="Posadas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
                <FormItem className="space-y-3">
                <FormLabel>¿Qué disponibilidad tenés para el día de la elección?</FormLabel>
                <FormControl>
                    <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                    >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                        <RadioGroupItem value="completa" />
                        </FormControl>
                        <FormLabel className="font-normal">Jornada Completa</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                        <RadioGroupItem value="parcial" />
                        </FormControl>
                        <FormLabel className="font-normal">Medio día (mañana o tarde)</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                        <RadioGroupItem value="indistinta" />
                        </FormControl>
                        <FormLabel className="font-normal">Indistinta / A coordinar</FormLabel>
                    </FormItem>
                    </RadioGroup>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />

        <FormField
          control={form.control}
          name="previousExperience"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Ya tengo experiencia fiscalizando
                </FormLabel>
                <FormDescription>
                    Marcá esta casilla si ya participaste como fiscal en elecciones anteriores.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aclaraciones (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Dejanos cualquier otra información que consideres relevante."
                  className="resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
