
'use server';
/**
 * @fileOverview A Genkit flow for analyzing an image from a URL.
 *
 * - analyzeImage - A function that takes an image URL and uses an LLM to generate a caption and alt text.
 * - AnalyzeImageInput - The input type for the analyzeImage function.
 * - AnalyzeImageOutput - The return type for the analyzeImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema - Now accepts a URL or a Base64 data URI
const AnalyzeImageInputSchema = z.object({
  imageUrl: z
    .string()
    .describe('The URL or Base64 data URI of the image to analyze.'),
});
export type AnalyzeImageInput = z.infer<typeof AnalyzeImageInputSchema>;

// Output Schema
const AnalyzeImageOutputSchema = z.object({
  caption: z
    .string()
    .describe(
      'Una leyenda breve y atractiva para la imagen, en español, adecuada para mostrar sobre la imagen en una galería. Por ejemplo: "Militantes en nuestro último evento."'
    ),
  altText: z
    .string()
    .describe(
      'Un texto alternativo descriptivo en español para la imagen, importante para la accesibilidad. Describe lo que se ve. Por ejemplo: "Un grupo de personas sosteniendo banderas en una plaza."'
    ),
});
export type AnalyzeImageOutput = z.infer<typeof AnalyzeImageOutputSchema>;


// The main exported function to be called from the client
export async function analyzeImage(
  input: AnalyzeImageInput
): Promise<AnalyzeImageOutput> {
  return analyzeImageFlow(input);
}

// Genkit Prompt
const imageAnalyzerPrompt = ai.definePrompt({
  name: 'imageAnalyzerPrompt',
  input: { schema: AnalyzeImageInputSchema },
  output: { schema: AnalyzeImageOutputSchema },
  prompt: `Eres un experto en redes sociales y accesibilidad web para un sitio político. Tu tarea es analizar la siguiente imagen y generar una leyenda (caption) y un texto alternativo (alt text) en ESPAÑOL.

Imagen a analizar: {{media url=imageUrl}}

1.  **Leyenda (caption):** Debe ser corta, directa y con un tono positivo o informativo. Ideal para superponer sobre la imagen.
2.  **Texto Alternativo (alt text):** Debe ser una descripción objetiva y concisa de lo que se ve en la imagen para personas con discapacidad visual.

Genera una respuesta en el formato JSON requerido.
`,
});


// Genkit Flow
const analyzeImageFlow = ai.defineFlow(
  {
    name: 'analyzeImageFlow',
    inputSchema: AnalyzeImageInputSchema,
    outputSchema: AnalyzeImageOutputSchema,
  },
  async (input) => {
    
    if (!input.imageUrl) {
        throw new Error('La URL de la imagen es requerida.');
    }
    
    const { output } = await imageAnalyzerPrompt(input); 

    if (!output) {
      throw new Error('La IA no pudo generar una respuesta.');
    }
    
    return { ...output };
  }
);
