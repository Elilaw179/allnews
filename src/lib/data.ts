// This file is updated to fetch live news from NewsAPI.org
import type { Article } from '@/types';
import { PlaceHolderImages } from './placeholder-images';
import NewsAPI from 'newsapi';

// This should not be here in a real app, but for simplicity of this exercise
// we are adding it here. In a real app, this should be in a server-side
// environment variable.
const newsapi = new NewsAPI(process.env.NEWS_API_KEY!);

// In-memory store for articles fetched from the API to allow fetching by slug
let articles: Article[] = [];

// Helper to convert NewsAPI article to our Article type
function transformArticle(newsApiArticle: any, index: number): Article {
  const placeholder = PlaceHolderImages[index % PlaceHolderImages.length];
  const slug = (newsApiArticle.title?.toLowerCase() || 'untitled')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');

  return {
    id: `${slug}-${new Date(newsApiArticle.publishedAt).getTime()}`,
    slug: `${slug}-${new Date(newsApiArticle.publishedAt).getTime()}`,
    title: newsApiArticle.title || 'No Title',
    content: newsApiArticle.content || newsApiArticle.description || 'No Content',
    excerpt: newsApiArticle.description || 'No Excerpt',
    imageUrl: newsApiArticle.urlToImage || placeholder.imageUrl,
    imageHint: placeholder.imageHint,
    category: newsApiArticle.source?.name || 'General',
    author: newsApiArticle.author || 'Unknown Author',
    location: 'Global', // NewsAPI does not provide location consistently
    date: newsApiArticle.publishedAt,
    status: 'published',
  };
}

export async function getArticles(options?: { status?: Article['status']; searchTerm?: string; category?: string }): Promise<Article[]> {
  // The local submission flow is no longer used, so we only fetch 'published' from NewsAPI
  if (options?.status && options.status !== 'published') {
    return [];
  }

  try {
    const response = await newsapi.v2.topHeadlines({
      q: options?.searchTerm || '',
      category: options?.category ? options.category.toLowerCase() as any : undefined,
      language: 'en',
      country: 'us', // Defaulting to US for relevance
      pageSize: 40,
    });

    if (response.status === 'ok') {
      articles = response.articles.map(transformArticle);
      
      // Filter again by category if NewsAPI didn't do it (it filters by source name)
      if (options?.category) {
        return articles.filter(a => a.category.toLowerCase().includes(options.category!.toLowerCase()));
      }
      
      return articles;
    } else {
      console.error('NewsAPI error:', response.code);
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch articles from NewsAPI:', error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  // Find from the in-memory store.
  // In a real app, you might need a more robust way to handle this,
  // as the article might not be in the last fetched list.
  let article = articles.find(a => a.slug === slug);

  if(!article) {
    // If not in cache, we can't reliably fetch a single article by slug from NewsAPI's top-headlines
    // In a real app, you would fetch from your own database.
    // For this app, we'll return an empty article to avoid a crash.
    return {
        id: slug,
        slug: slug,
        title: "Article not found",
        content: "This article could not be retrieved from the live news feed. It might be an old article.",
        excerpt: "Article not found.",
        imageUrl: PlaceHolderImages[0].imageUrl,
        imageHint: PlaceHolderImages[0].imageHint,
        category: "Error",
        author: "System",
        location: "Unknown",
        date: new Date().toISOString(),
        status: 'published',
    }
  }

  return article;
}

export async function getCategories(): Promise<string[]> {
    // Return a fixed list of categories supported by NewsAPI
    return ['Business', 'Entertainment', 'General', 'Health', 'Science', 'Sports', 'Technology'];
}

// The following functions are no longer needed as we are fetching live data.
// They are kept here to avoid breaking other parts of the app that might still call them.
export async function addArticle(articleData: Omit<Article, 'id' | 'status' | 'date' | 'slug' | 'excerpt' | 'imageUrl' | 'imageHint'>): Promise<Article> {
  console.warn("addArticle is disabled when using live NewsAPI data.");
  // @ts-ignore
  return Promise.resolve({});
}

export async function updateArticleStatus(id: string, status: 'published' | 'rejected'): Promise<Article | undefined> {
  console.warn("updateArticleStatus is disabled when using live NewsAPI data.");
  return Promise.resolve(undefined);
}
