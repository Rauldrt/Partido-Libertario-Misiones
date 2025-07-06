
'use server';
/**
 * @fileOverview A Genkit flow for generating news article data from a URL.
 *
 * - generateNewsFromUrl - A function that takes a URL, scrapes its content, and uses an LLM to generate a title, summary, and image hint.
 * - GenerateNewsInput - The input type for the generateNewsFromUrl function.
 * - GenerateNewsOutput - The return type for the generateNewsFromUrl function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

// Input Schema
const GenerateNewsInputSchema = z.object({
  url: z.string().url().describe('The URL of the news article to process.'),
});
export type GenerateNewsInput = z.infer<typeof GenerateNewsInputSchema>;

// Output Schema
const GenerateNewsOutputSchema = z.object({
  title: z
    .string()
    .describe('Un título pegadizo e informativo para el artículo de noticias.'),
  summary: z
    .string()
    .describe(
      'Un resumen conciso del contenido del artículo, escrito como un solo párrafo.'
    ),
  imageHint: z
    .string()
    .describe(
      'Una o dos palabras clave en español para una foto de archivo que represente visualmente el artículo. Por ejemplo: "debate político" o "crecimiento económico".'
    ),
  imageUrl: z.string().url().optional().describe('URL de la imagen principal extraída del artículo.'),
});
export type GenerateNewsOutput = z.infer<typeof GenerateNewsOutputSchema>;

// The main exported function to be called from the client
export async function generateNewsFromUrl(
  input: GenerateNewsInput
): Promise<GenerateNewsOutput> {
  return generateNewsFromUrlFlow(input);
}

// Genkit Prompt
const newsGeneratorPrompt = ai.definePrompt({
  name: 'newsGeneratorPrompt',
  input: { schema: z.object({ articleContent: z.string() }) },
  output: { schema: GenerateNewsOutputSchema.omit({ imageUrl: true }) }, // The LLM doesn't generate the URL
  prompt: `Eres un experto editor de noticias para un sitio web político. Tu tarea es analizar el contenido proporcionado y generar un resumen de noticias en ESPAÑOL.

El contenido puede ser un artículo completo o una publicación de redes sociales. Tu respuesta DEBE ser siempre en español, sin importar el idioma del contenido original.

- Genera un título llamativo en español.
- Escribe un resumen conciso en español.
- Proporciona una o dos palabras clave en español para una imagen de archivo.

Genera una respuesta en el formato JSON requerido.

Contenido:
{{{articleContent}}}
`,
});

// Genkit Flow
const generateNewsFromUrlFlow = ai.defineFlow(
  {
    name: 'generateNewsFromUrlFlow',
    inputSchema: GenerateNewsInputSchema,
    outputSchema: GenerateNewsOutputSchema,
  },
  async (input) => {
    // 1. Fetch the HTML content from the URL
    const response = await fetch(input.url, { 
        headers: { 
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }
    const html = await response.text();

    // 2. Parse HTML and extract content
    const dom = new JSDOM(html, { url: input.url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    
    let articleContent = '';
    let imageUrl: string | undefined = undefined;

    // Prioritize Readability's parsed content for articles
    if (article && article.content) {
      articleContent = article.textContent.replace(/\s\s+/g, ' ').trim();
      
      // Attempt to extract the main image from the parsed article content
      const contentDom = new JSDOM(article.content, { url: input.url });
      const mainImage = contentDom.window.document.querySelector('img');
      if (mainImage?.src) {
        try {
          const resolvedUrl = new URL(mainImage.src, input.url).href;
          if (resolvedUrl.startsWith('http')) {
            imageUrl = resolvedUrl;
          }
        } catch (e) {
          console.warn(`Could not resolve image URL: ${mainImage.src}`);
        }
      }
    } else {
      // Fallback for social media or JS-heavy sites: get text from the body
      articleContent = dom.window.document.body.textContent?.replace(/\s\s+/g, ' ').trim() || '';
    }

    // Check if we were able to extract any content at all
    if (!articleContent) {
      throw new Error(
        'Could not extract any meaningful content from the URL. The site may be protected or heavily reliant on JavaScript.'
      );
    }
    
    // 3. Call the LLM with the extracted content, limiting to avoid excessive token usage
    const { output } = await newsGeneratorPrompt({ articleContent: articleContent.substring(0, 15000) }); 

    if (!output) {
      throw new Error('The AI failed to generate a response.');
    }

    // Use the title from Readability as a fallback if the AI's is empty and one was parsed
    if (!output.title && article && article.title) {
        output.title = article.title;
    }

    // Combine LLM output with programmatically extracted image URL
    return { ...output, imageUrl };
  }
);
