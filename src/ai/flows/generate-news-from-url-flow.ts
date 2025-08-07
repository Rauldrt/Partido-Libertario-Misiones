
'use server';
/**
 * @fileOverview A Genkit flow for generating news article data from a URL.
 *
 * - generateNewsFromUrl - A function that takes a URL (article, social media post, or YouTube video), gets its content, and uses an LLM to generate a title, summary, and image hint.
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
  url: z.string().url().describe('The URL of the article, social media post, or YouTube video to process.'),
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
  embedCode: z.string().optional().describe('El código HTML para insertar la publicación de redes sociales, si corresponde.'),
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
  input: { schema: z.object({ articleContent: z.string(), imageUrl: z.string().optional() }) },
  output: { schema: GenerateNewsOutputSchema.omit({ imageUrl: true, youtubeVideoId: true, embedCode: true }) }, // The LLM doesn't generate these
  prompt: `Eres un experto editor de noticias para un sitio web político. Tu tarea es analizar el contenido proporcionado y generar un resumen de noticias en ESPAÑOL.

El contenido puede ser un artículo completo, una publicación de redes sociales, la descripción de un video, la TRANSCRIPCIÓN DE UN VIDEO, o una imagen. Tu respuesta DEBE ser siempre en español, sin importar el idioma del contenido original.

{{#if imageUrl}}
Tarea Principal: Describe la siguiente imagen y, basándote en ella, genera un título, un resumen y palabras clave.
Imagen a analizar: {{media url=imageUrl}}
{{else}}
Si el contenido parece provenir de una red social (ej. Twitter, Facebook, Instagram), enfócate en el texto principal de la publicación e ignora el texto de la interfaz de usuario como "Me gusta", "Compartir", comentarios, marcas de tiempo, etc.

Contenido de texto a analizar:
{{{articleContent}}}
{{/if}}

- Genera un título llamativo en español basado en el contenido.
- Escribe un resumen conciso en español que capture la esencia del contenido.
- Proporciona una o dos palabras clave en español para una imagen de archivo que represente el tema.

Genera una respuesta en el formato JSON requerido.
`,
});

function getYoutubeVideoId(url: string): string | null {
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(youtubeRegex);
  return match ? match[1] : null;
}

/**
 * Constructs an HTML embed code for supported social media URLs.
 * @param url The URL of the social media post.
 * @returns The embed code as a string, or undefined if the platform is not supported.
 */
function constructEmbedCode(url: string): string | undefined {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace(/^www\./, '');

    if (hostname === 'instagram.com') {
      return `<blockquote class="instagram-media" data-instgrm-permalink="${url}" data-instgrm-version="14"></blockquote><script async src="//www.instagram.com/embed.js"></script>`;
    }

    if (hostname === 'facebook.com' && (urlObj.pathname.includes('/posts/') || urlObj.pathname.includes('/videos/'))) {
        const encodedUrl = encodeURIComponent(url);
        return `<iframe src="https://www.facebook.com/plugins/post.php?href=${encodedUrl}&show_text=true&width=500" width="500" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>`;
    }
    
    if (hostname === 'x.com' || hostname === 'twitter.com') {
        return `<blockquote class="twitter-tweet"><a href="${url}"></a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`;
    }

    return undefined;

  } catch (error) {
    console.error("Error constructing embed code:", error);
    return undefined;
  }
}


/**
 * Scrapes a URL to extract the main readable content and a potential image URL.
 * It prioritizes Mozilla's Readability, but falls back to Open Graph meta tags
 * which works better for social media and video pages.
 */
async function scrapeUrlForContent(url: string): Promise<{ articleContent: string, imageUrl?: string }> {
    const response = await fetch(url, {
        headers: { // Use a common user agent to avoid being blocked
            'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
        },
    });
    if (!response.ok) {
        throw new Error(`Error al buscar la URL: ${response.statusText}`);
    }

    // Check if the URL points directly to an image
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.startsWith('image/')) {
        return { articleContent: '', imageUrl: url };
    }

    const html = await response.text();
    const dom = new JSDOM(html, { url });
    const doc = dom.window.document;
    const reader = new Readability(doc);
    const article = reader.parse();

    let content = '';
    let imageUrl: string | undefined = undefined;

    // 1. Primary strategy: Use Readability's parsed article
    if (article && article.textContent) {
        // Combine title and content for a more complete context for the LLM
        content = `${article.title}\n\n${article.textContent}`.replace(/\s\s+/g, ' ').trim();
        
        // Try to get the main image from the parsed content
        if (article.content) {
            const contentDom = new JSDOM(article.content, { url });
            const mainImage = contentDom.window.document.querySelector('img');
            if (mainImage?.src) {
                try {
                    const resolvedUrl = new URL(mainImage.src, url).href;
                    if (resolvedUrl.startsWith('http')) {
                        imageUrl = resolvedUrl;
                    }
                } catch (e) {
                    console.warn(`Could not resolve image URL from content: ${mainImage.src}`);
                }
            }
        }
    }

    // 2. Fallback strategy: Use Open Graph (og:) and standard meta tags.
    // This is often more reliable for SPAs, social media, and video links.
    const metaTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || doc.title;
    const metaDescription = doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || doc.querySelector('meta[name="description"]')?.getAttribute('content');
    
    let metaContent = '';
    if (metaTitle) metaContent += metaTitle;
    if (metaDescription) metaContent += `\n\n${metaDescription}`;
    
    // If meta content is substantially better (e.g. for SPAs where readability fails), use it.
    if (metaContent.length > content.length + 50) {
        content = metaContent.trim();
    }
    
    // Try to get image from og:image meta tag if we don't have one yet.
    if (!imageUrl) {
        const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
        if (ogImage) {
            try {
                const resolvedUrl = new URL(ogImage, url).href;
                if (resolvedUrl.startsWith('http')) {
                    imageUrl = resolvedUrl;
                }
            } catch (e) {
                console.warn(`Could not resolve OG image URL: ${ogImage}`);
            }
        }
    }

    // 3. Last resort fallback: grab all text from the body.
    if (!content.trim()) {
        content = doc.body.textContent?.replace(/\s\s+/g, ' ').trim() || '';
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
    const embedCode = constructEmbedCode(input.url);
    
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
        // Standard logic for scraping web pages (this will also handle social media for text content)
        const scrapedData = await scrapeUrlForContent(input.url);
        articleContent = scrapedData.articleContent;
        imageUrl = scrapedData.imageUrl;
    }


    if (!articleContent.trim() && !imageUrl) {
      throw new Error(
        'No se pudo extraer contenido significativo de la URL. El sitio puede estar protegido, o el video puede no tener transcripción.'
      );
    }
    
    const { output } = await newsGeneratorPrompt({ 
        articleContent: articleContent.substring(0, 15000),
        imageUrl: imageUrl,
    }); 

    if (!output) {
      throw new Error('The AI failed to generate a response.');
    }
    
    // Combine LLM output with programmatically extracted data
    return { ...output, imageUrl, youtubeVideoId, embedCode };
  }
);
