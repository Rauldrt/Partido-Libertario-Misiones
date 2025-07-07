
'use server';
/**
 * @fileOverview A Genkit flow for generating news article data from a URL.
 *
 * - generateNewsFromUrl - A function that takes a URL (article or YouTube), gets its content, and uses an LLM to generate a title, summary, and image hint.
 * - GenerateNewsInput - The input type for the generateNewsFromUrl function.
 * - GenerateNewsOutput - The return type for the generateNewsFromUrl function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import { YoutubeTranscript } from 'youtube-transcript';

// Input Schema
const GenerateNewsInputSchema = z.object({
  url: z.string().url().describe('The URL of the article or YouTube video to process.'),
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
  imageUrl: z.string().url().optional().describe('URL de la imagen principal extraída del artículo o video.'),
  youtubeVideoId: z.string().optional().describe('El ID del video de YouTube, si la URL es de YouTube.'),
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
  output: { schema: GenerateNewsOutputSchema.omit({ imageUrl: true, youtubeVideoId: true }) }, // The LLM doesn't generate these
  prompt: `Eres un experto editor de noticias para un sitio web político. Tu tarea es analizar el contenido proporcionado y generar un resumen de noticias en ESPAÑOL.

El contenido puede ser un artículo completo, una publicación de redes sociales, la descripción de un video o la TRANSCRIPCIÓN DE UN VIDEO. Tu respuesta DEBE ser siempre en español, sin importar el idioma del contenido original.

- Genera un título llamativo en español.
- Escribe un resumen conciso en español que capture la esencia del contenido.
- Proporciona una o dos palabras clave en español para una imagen de archivo.

Genera una respuesta en el formato JSON requerido.

Contenido a analizar:
{{{articleContent}}}
`,
});

function getYoutubeVideoId(url: string): string | null {
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(youtubeRegex);
  return match ? match[1] : null;
}

/**
 * Scrapes a URL to extract the main readable content and a potential image URL.
 */
async function scrapeUrlForContent(url: string): Promise<{ articleContent: string, imageUrl?: string }> {
    const response = await fetch(url, {
        headers: {
            'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }
    const html = await response.text();

    const dom = new JSDOM(html, { url: url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    let content = '';
    let imageUrl: string | undefined = undefined;

    if (article && article.content) {
        content = article.textContent.replace(/\s\s+/g, ' ').trim();
        const contentDom = new JSDOM(article.content, { url: url });
        const mainImage = contentDom.window.document.querySelector('img');
        if (mainImage?.src) {
            try {
              const resolvedUrl = new URL(mainImage.src, url).href;
              if (resolvedUrl.startsWith('http')) {
                  imageUrl = resolvedUrl;
              }
            } catch (e) {
              console.warn(`Could not resolve image URL: ${mainImage.src}`);
            }
        }
    } else {
        // Fallback for pages that Readability can't parse
        content = dom.window.document.body.textContent?.replace(/\s\s+/g, ' ').trim() || '';
    }

    return { articleContent: content, imageUrl };
}


// Genkit Flow
const generateNewsFromUrlFlow = ai.defineFlow(
  {
    name: 'generateNewsFromUrlFlow',
    inputSchema: GenerateNewsInputSchema,
    outputSchema: GenerateNewsOutputSchema,
  },
  async (input) => {
    let articleContent = '';
    let imageUrl: string | undefined = undefined;
    let youtubeVideoId: string | undefined = undefined;
    
    const videoId = getYoutubeVideoId(input.url);

    if (videoId) {
        youtubeVideoId = videoId;
        // Get the highest quality thumbnail for the video as a primary image.
        imageUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        try {
            // First, try to get a Spanish transcript.
            const transcript = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'es' });
            articleContent = transcript.map((t) => t.text).join(' ').trim();
        } catch (error) {
            console.warn('Could not fetch Spanish transcript, trying any language...', error);
            try {
                 // If Spanish fails, try any available transcript.
                const transcript = await YoutubeTranscript.fetchTranscript(videoId);
                articleContent = transcript.map((t) => t.text).join(' ').trim();
            } catch (finalError) {
                console.warn(`Could not fetch any transcript for ${videoId}. Falling back to page scraping.`, finalError);
                // If all transcript attempts fail, fall back to scraping the page for title/description.
                const scrapedData = await scrapeUrlForContent(input.url);
                articleContent = scrapedData.articleContent;
                // We keep the YouTube thumbnail, so we don't use the scraped imageUrl.
            }
        }

    } else {
        // Standard logic for scraping web pages
        const scrapedData = await scrapeUrlForContent(input.url);
        articleContent = scrapedData.articleContent;
        imageUrl = scrapedData.imageUrl;
    }


    if (!articleContent.trim()) {
      throw new Error(
        'No se pudo extraer contenido significativo de la URL. El sitio puede estar protegido, depender de JavaScript, o el video puede no tener transcripción ni descripción.'
      );
    }
    
    const { output } = await newsGeneratorPrompt({ articleContent: articleContent.substring(0, 15000) }); 

    if (!output) {
      throw new Error('The AI failed to generate a response.');
    }
    
    // Combine LLM output with programmatically extracted data
    return { ...output, imageUrl, youtubeVideoId };
  }
);
