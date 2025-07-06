
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

// Input Schema
const GenerateNewsInputSchema = z.object({
  url: z.string().url().describe('The URL of the news article to process.'),
});
export type GenerateNewsInput = z.infer<typeof GenerateNewsInputSchema>;

// Output Schema
const GenerateNewsOutputSchema = z.object({
  title: z
    .string()
    .describe('A catchy and informative title for the news article.'),
  summary: z
    .string()
    .describe(
      'A concise summary of the article content, written as a single paragraph.'
    ),
  imageHint: z
    .string()
    .describe(
      'One or two keywords for a stock photo that visually represents the article. For example: "political debate" or "economic growth".'
    ),
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
  output: { schema: GenerateNewsOutputSchema },
  prompt: `You are an expert news editor for a political party's website. Your task is to analyze the provided article content and generate a compelling news summary from it.

You must extract the key information and present it clearly and concisely.

Based on the following article content, generate a response in the required JSON format.

Article Content:
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
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' 
        }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }
    const html = await response.text();

    // 2. Parse HTML and extract readable text content
    const dom = new JSDOM(html);
    
    // Remove script and style elements to clean up content
    dom.window.document.querySelectorAll('script, style, nav, footer, header').forEach((el) => el.remove());
    
    const articleContent = dom.window.document.body.textContent?.replace(/\s\s+/g, ' ').trim() || '';

    if (!articleContent) {
      throw new Error('Could not extract text content from the URL.');
    }

    // 3. Call the LLM with the extracted content, limiting to avoid excessive token usage
    const { output } = await newsGeneratorPrompt({ articleContent: articleContent.substring(0, 15000) }); 

    if (!output) {
      throw new Error('The AI failed to generate a response.');
    }

    return output;
  }
);
