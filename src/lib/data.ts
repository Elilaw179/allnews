// NOTE: This is an in-memory data store. Data will be lost on server restart.
// For a production app, you'd use a database.
import type { Article } from '@/types';
import { PlaceHolderImages } from './placeholder-images';

let articles: Article[] = [
  {
    id: '1',
    slug: 'global-economic-summit-2024',
    title: 'Global Economic Summit Concludes with Pledge for Sustainable Growth',
    content: 'Leaders from around the world gathered this week for the Global Economic Summit, focusing on post-pandemic recovery and sustainable development. Key discussions revolved around green energy, digital transformation, and equitable trade policies. The summit ended with a joint declaration to increase investment in renewable technologies and support developing nations.',
    excerpt: 'The Global Economic Summit focused on sustainable growth, green energy, and digital transformation.',
    imageUrl: PlaceHolderImages[0].imageUrl,
    imageHint: PlaceHolderImages[0].imageHint,
    category: 'World News',
    author: 'Jane Doe',
    location: 'Global',
    date: '2024-07-28T10:00:00Z',
    status: 'published',
  },
  {
    id: '2',
    slug: 'tech-innovations-unveiled',
    title: 'Breakthroughs in AI and Quantum Computing Unveiled at Tech Expo',
    content: 'The annual Tech Innovations Expo showcased groundbreaking advancements in artificial intelligence and quantum computing. A major highlight was a new AI model capable of real-time language translation with near-human accuracy. Experts believe these innovations will reshape industries from healthcare to finance in the coming years.',
    excerpt: 'New AI models and quantum computing advancements promise to reshape industries.',
    imageUrl: PlaceHolderImages[1].imageUrl,
    imageHint: PlaceHolderImages[1].imageHint,
    category: 'Technology',
    author: 'John Smith',
    location: 'USA',
    date: '2024-07-27T14:30:00Z',
    status: 'published',
  },
  {
    id: '3',
    slug: 'space-exploration-mission',
    title: 'New Mission to Mars Aims to Search for Signs of Ancient Life',
    content: 'The international space agency announced a new robotic mission to Mars, scheduled to launch in 2026. The rover will be equipped with advanced drilling and sample analysis tools to explore a region believed to have once been a river delta. Scientists are hopeful that this mission will provide definitive evidence of past microbial life on the Red Planet.',
    excerpt: 'A 2026 mission to Mars will search for signs of ancient life in a former river delta.',
    imageUrl: PlaceHolderImages[2].imageUrl,
    imageHint: PlaceHolderImages[2].imageHint,
    category: 'Science',
    author: 'Emily White',
    location: 'Space',
    date: '2024-07-26T09:00:00Z',
    status: 'published',
  },
  {
    id: '4',
    slug: 'political-climate-accord',
    title: 'Countries Reach Landmark Agreement on Carbon Emissions',
    content: 'After weeks of negotiations, an international coalition has signed a landmark accord to drastically cut carbon emissions by 2040. The agreement includes binding targets for all signatory nations and establishes a fund to help developing countries transition to cleaner energy sources. Environmental groups have hailed it as a major step forward in the fight against climate change.',
    excerpt: 'A new international accord sets binding targets to cut carbon emissions by 2040.',
    imageUrl: PlaceHolderImages[3].imageUrl,
    imageHint: PlaceHolderImages[3].imageHint,
    category: 'Politics',
    author: 'Michael Brown',
    location: 'Europe',
    date: '2024-07-25T18:00:00Z',
    status: 'published',
  },
    {
    id: '5',
    slug: 'market-volatility-explained',
    title: 'Experts Weigh In on Recent Stock Market Volatility',
    content: 'Financial analysts are pointing to a mix of inflation fears and geopolitical tensions as the primary drivers of recent stock market volatility. While some sectors have seen significant downturns, technology and renewable energy stocks continue to show resilience. Investors are advised to maintain a diversified portfolio and focus on long-term strategies.',
    excerpt: 'Inflation and geopolitical tensions are causing market volatility, experts say.',
    imageUrl: PlaceHolderImages[4].imageUrl,
    imageHint: PlaceHolderImages[4].imageHint,
    category: 'Business',
    author: 'Sarah Green',
    location: 'USA',
    date: '2024-07-24T11:00:00Z',
    status: 'published',
  },
  {
    id: '6',
    slug: 'world-championship-upset',
    title: 'Underdog Team Claims Victory in World Championship Finals',
    content: 'In a stunning upset, the national soccer team from a small island nation clinched the World Championship title. The final match went into a dramatic penalty shootout, where their goalkeeper made two heroic saves. Celebrations have erupted across the winning nation, marking a historic moment in their sporting history.',
    excerpt: 'An underdog team won the World Championship in a dramatic penalty shootout.',
    imageUrl: PlaceHolderImages[5].imageUrl,
    imageHint: PlaceHolderImages[5].imageHint,
    category: 'Sports',
    author: 'David Chen',
    location: 'Global',
    date: '2024-07-23T20:00:00Z',
    status: 'published',
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getArticles(options?: { status?: Article['status']; searchTerm?: string; category?: string }): Promise<Article[]> {
  await delay(200);
  let filteredArticles = [...articles];

  if (options?.status) {
    filteredArticles = filteredArticles.filter(a => a.status === options.status);
  }

  if (options?.searchTerm) {
    const term = options.searchTerm.toLowerCase();
    filteredArticles = filteredArticles.filter(a =>
      a.title.toLowerCase().includes(term) ||
      a.content.toLowerCase().includes(term) ||
      a.author.toLowerCase().includes(term) ||
      a.location.toLowerCase().includes(term)
    );
  }

  if (options?.category) {
    filteredArticles = filteredArticles.filter(a => a.category === options.category);
  }

  return filteredArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  await delay(100);
  return articles.find(a => a.slug === slug);
}

export async function getArticleById(id: string): Promise<Article | undefined> {
  await delay(100);
  return articles.find(a => a.id === id);
}

export async function getCategories(): Promise<string[]> {
    await delay(50);
    const publishedArticles = articles.filter(a => a.status === 'published');
    const categories = new Set(publishedArticles.map(a => a.category));
    return Array.from(categories);
}

export async function addArticle(articleData: Omit<Article, 'id' | 'status' | 'date' | 'slug' | 'excerpt' | 'imageUrl' | 'imageHint'>): Promise<Article> {
  await delay(500);
  const newId = (articles.length + 1).toString();
  const slug = articleData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  const placeholderImage = PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)];

  const newArticle: Article = {
    ...articleData,
    id: newId,
    slug: `${slug}-${newId}`,
    excerpt: articleData.content.substring(0, 100) + '...',
    date: new Date().toISOString(),
    status: 'pending',
    imageUrl: placeholderImage.imageUrl,
    imageHint: placeholderImage.imageHint,
  };
  articles.unshift(newArticle);
  return newArticle;
}

export async function updateArticleStatus(id: string, status: 'published' | 'rejected'): Promise<Article | undefined> {
  await delay(300);
  const articleIndex = articles.findIndex(a => a.id === id);
  if (articleIndex !== -1) {
    articles[articleIndex].status = status;
    if (status === 'published') {
      articles[articleIndex].date = new Date().toISOString(); // Update publish date
    }
    return articles[articleIndex];
  }
  return undefined;
}
