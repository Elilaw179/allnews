// This file is updated to fetch live news from a news API.
import type { Article } from '@/types';
import { PlaceHolderImages } from './placeholder-images';

// This should not be here in a real app, but for simplicity of this exercise
// we are adding it here. In a real app, this should be in a server-side
// environment variable.
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';
const EVERYTHING_NEWS_API_URL = 'https://newsapi.org/v2/everything';

// In-memory store for articles fetched from the API to allow fetching by slug
let articles: Article[] = [];

// Helper to convert NewsAPI article to our Article type
function transformArticle(newsApiArticle: any, index: number): Article {
  const placeholder = PlaceHolderImages[index % PlaceHolderImages.length];
  // Create a more URL-friendly and unique slug
  const slugTitle = (newsApiArticle.title?.toLowerCase() || 'untitled')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
  const publishedTime = new Date(newsApiArticle.publishedAt).getTime();
  const slug = `${slugTitle}-${publishedTime}`;

  const content = (newsApiArticle.content || newsApiArticle.description || 'No Content');
  // NewsAPI often adds a truncation marker. Let's try to provide a cleaner reading experience.
  const cleanedContent = content.replace(/\[\+\d+ chars\]$/, '');


  return {
    id: slug,
    slug: slug,
    title: newsApiArticle.title || 'No Title',
    content: cleanedContent,
    excerpt: newsApiArticle.description || 'No Excerpt',
    imageUrl: newsApiArticle.urlToImage || placeholder.imageUrl,
    imageHint: placeholder.imageHint,
    category: newsApiArticle.source?.name || 'General',
    author: newsApiArticle.author || 'Unknown Author',
    location: 'Global', // NewsAPI does not provide location consistently
    date: newsApiArticle.publishedAt,
    status: 'published',
    url: newsApiArticle.url
  };
}

export async function getArticles(options?: { status?: Article['status']; searchTerm?: string; category?: string }): Promise<Article[]> {
  // The local submission flow is no longer used, so we only fetch 'published' from the API
  if (options?.status && options.status !== 'published') {
    return [];
  }
  
  if (!NEWS_API_KEY) {
    console.error("NEWS_API_KEY is not set in environment variables.");
    return [];
  }

  let apiUrl = NEWS_API_URL;
  const params = new URLSearchParams({
    language: 'en',
    pageSize: '40',
    apiKey: NEWS_API_KEY,
  });

  if (options?.searchTerm) {
    apiUrl = EVERYTHING_NEWS_API_URL;
    params.set('q', options.searchTerm);
    params.set('sortBy', 'relevancy');
  } else {
    // No country parameter to get global news
    const category = options?.category?.toLowerCase();
    if (category && category !== 'all' && category !== 'general') {
      params.set('category', category);
    } else {
       // Default to general category if no specific one is provided
       // This gives a good mix of global top headlines.
      params.set('category', 'general');
    }
  }

  try {
    const response = await fetch(`${apiUrl}?${params.toString()}`, {
        // Revalidate data every 15 minutes
        next: { revalidate: 900 }
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        console.error('NewsAPI error:', errorData.message);
        return [];
    }

    const data = await response.json();

    if (data.status === 'ok') {
      articles = data.articles.map(transformArticle).filter(a => a.title !== '[Removed]' && a.url && a.imageUrl);
      return articles;
    } else {
      console.error('NewsAPI returned status:', data.status, data.message);
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch articles from NewsAPI:', error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  // Find from the in-memory store.
  let article = articles.find(a => a.slug === slug);

  if(!article && articles.length === 0) {
    // If cache is empty, fetch all articles to try and find it
    await getArticles();
    article = articles.find(a => a.slug === slug);
  }
  
  if(!article) {
    // If still not found, it's a stale slug or doesn't exist.
    return {
        id: slug,
        slug: slug,
        title: "Article not found",
        content: "This article could not be retrieved from the live news feed. It might be an old article that is no longer in the main feed.",
        excerpt: "Article not found.",
        imageUrl: PlaceHolderImages[0].imageUrl,
        imageHint: PlaceHolderImages[0].imageHint,
        category: "Error",
        author: "System",
        location: "Unknown",
        date: new Date().toISOString(),
        status: 'published',
        url: '/',
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
export async function addArticle(articleData: Omit<Article, 'id' | 'status' | 'date' | 'slug' | 'excerpt' | 'imageUrl' | 'imageHint' | 'url'>): Promise<Article> {
  console.warn("addArticle is disabled when using live NewsAPI data.");
  // @ts-ignore
  return Promise.resolve({});
}

export async function updateArticleStatus(id: string, status: 'published' | 'rejected'): Promise<Article | undefined> {
  console.warn("updateArticleStatus is disabled when using live NewsAPI data.");
  return Promise.resolve(undefined);
}
