'use server';

import { z } from 'zod';
import { addArticle, updateArticleStatus } from './data';
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
  const validatedFields = ArticleSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    author: formData.get('author'),
    location: formData.get('location'),
    category: formData.get('category'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Failed to submit article. Please check the errors below.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await addArticle(validatedFields.data);
    revalidatePath('/');
    revalidatePath('/admin');
    return { message: 'success' };
  } catch (error) {
    return { message: 'An unexpected error occurred.' };
  }
}

export async function approveArticle(formData: FormData) {
  const id = formData.get('id') as string;
  if (!id) return;
  await updateArticleStatus(id, 'published');
  revalidatePath('/admin');
  revalidatePath('/');
}

export async function rejectArticle(formData: FormData) {
    const id = formData.get('id') as string;
    if (!id) return;
    await updateArticleStatus(id, 'rejected');
    revalidatePath('/admin');
}
