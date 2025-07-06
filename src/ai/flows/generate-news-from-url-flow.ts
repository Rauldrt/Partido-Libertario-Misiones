
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
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }
    const html = await response.text();

    // 2. Parse HTML and extract readable content using Mozilla's Readability
    const dom = new JSDOM(html, { url: input.url }); // Pass URL for better relative link resolution
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    // Check if Readability was able to extract content
    if (!article || !article.textContent) {
      throw new Error(
        'Could not extract article content. The URL might not be a news article, or the site may be protected.'
      );
    }
    
    // Clean up the extracted text
    const articleContent = article.textContent.replace(/\s\s+/g, ' ').trim();

    // 3. Call the LLM with the extracted content, limiting to avoid excessive token usage
    const { output } = await newsGeneratorPrompt({ articleContent: articleContent.substring(0, 15000) }); 

    if (!output) {
      throw new Error('The AI failed to generate a response.');
    }

    // Use the title from Readability as a fallback if the AI's is empty
    if (!output.title && article.title) {
        output.title = article.title;
    }

    return output;
  }
);
