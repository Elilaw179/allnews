'use server';

import { z } from 'zod';
// import { addArticle, updateArticleStatus } from './data';
import { revalidatePath } from 'next/cache';

const ArticleSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long'),
  content: z.string().min(20, 'Content must be at least 20 characters long'),
  author: z.string().min(2, 'Author name must be at least 2 characters long'),
  location: z.string().min(2, 'Location must be at least 2 characters long'),
  category: z.string().min(3, 'Category must be at least 3 characters long'),
});

export type FormState = {
  message: string;
  errors?: {
    title?: string[];
    content?: string[];
    author?: string[];
    location?: string[];
    category?: string[];
  };
};

export async function submitNewsArticle(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  console.warn("submitNewsArticle is disabled when using live NewsAPI data.");
  return { message: 'Submission is disabled.' };
}

export async function approveArticle(formData: FormData) {
  console.warn("approveArticle is disabled when using live NewsAPI data.");
}

export async function rejectArticle(formData: FormData) {
    console.warn("rejectArticle is disabled when using live NewsAPI data.");
}
