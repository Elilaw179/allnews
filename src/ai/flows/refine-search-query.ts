'use server';
/**
 * @fileOverview This file defines a Genkit flow for refining a user's search query.
 *
 * - refineSearchQuery - A function that takes a raw search query and returns a refined, keyword-focused query.
 * - RefineSearchQueryInput - The input type for the refineSearchQuery function.
 * - RefineSearchQueryOutput - The return type for the refineSearchQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineSearchQueryInputSchema = z.object({
  query: z.string().describe('The raw search query from the user.'),
});
export type RefineSearchQueryInput = z.infer<
  typeof RefineSearchQueryInputSchema
>;

const RefineSearchQueryOutputSchema = z.object({
  refinedQuery: z
    .string()
    .describe(
      'A refined, keyword-focused version of the query suitable for a news API.'
    ),
});
export type RefineSearchQueryOutput = z.infer<
  typeof RefineSearchQueryOutputSchema
>;

export async function refineSearchQuery(
  input: RefineSearchQueryInput
): Promise<RefineSearchQueryOutput> {
  return refineSearchQueryFlow(input);
}

const refineSearchQueryPrompt = ai.definePrompt({
  name: 'refineSearchQueryPrompt',
  input: {schema: RefineSearchQueryInputSchema},
  output: {schema: RefineSearchQueryOutputSchema},
  prompt: `You are an expert at refining search queries for a news API. Analyze the user's raw query and extract only the essential keywords. The output should be a concise string of keywords that will yield the best search results. Remove any conversational language, filler words, or unnecessary prepositions.

User Query: {{{query}}}

Example 1:
User Query: "show me the latest news about the stock market in japan"
Refined Query: "stock market japan"

Example 2:
User Query: "what is happening with the election in south africa"
Refined Query: "election south africa"

Example 3:
User Query: "latest news about tinibu in the president of nigeria 2025"
Refined Query: "Tinubu president nigeria 2025"
`,
});

const refineSearchQueryFlow = ai.defineFlow(
  {
    name: 'refineSearchQueryFlow',
    inputSchema: RefineSearchQueryInputSchema,
    outputSchema: RefineSearchQueryOutputSchema,
  },
  async input => {
    const {output} = await refineSearchQueryPrompt(input);
    return output!;
  }
);
