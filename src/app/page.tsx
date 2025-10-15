import { getArticles, getCategories } from '@/lib/data';
import { refineSearchQuery } from '@/ai/flows/refine-search-query';
import NewsCard from '@/components/news-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Search } from 'lucide-react';
import HeroArticle from '@/components/hero-article';

type HomeProps = {
  searchParams?: {
    search?: string;
    category?: string;
  };
};

export default async function Home({ searchParams }: HomeProps) {
  let searchTerm = searchParams?.search || '';
  const selectedCategory = searchParams?.category || '';

  // If there's a search term, refine it using the AI flow
  if (searchTerm) {
    const refinedResult = await refineSearchQuery({ query: searchTerm });
    searchTerm = refinedResult.refinedQuery;
  }

  const allArticles = await getArticles({
    status: 'published',
    searchTerm,
    category: selectedCategory,
  });
  const categories = await getCategories();

  const heroArticle = allArticles.length > 0 ? allArticles[0] : null;
  const articles = allArticles.length > 1 ? allArticles.slice(1) : [];


  return (
    <div>
      {heroArticle && !searchTerm && !selectedCategory && (
        <HeroArticle article={heroArticle} />
      )}

      <div className="container mx-auto px-4 py-8">
        {!heroArticle && (
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Global News Hub
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Your daily source for what's happening in the world.
            </p>
          </header>
        )}

        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <form action="/" method="GET" className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              name="search"
              placeholder="Search articles by keyword..."
              className="w-full pl-10"
              defaultValue={searchParams?.search || ''}
            />
          </form>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button asChild variant={!selectedCategory && !searchTerm ? 'default' : 'outline'}>
              <Link href="/">All</Link>
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                asChild
                variant={selectedCategory === category ? 'default' : 'outline'}
                disabled={!!searchTerm}
              >
                <Link href={`/?category=${encodeURIComponent(category)}`}>
                  {category}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {articles.map((article, index) => (
              <NewsCard key={article.id} article={article} animationDelay={index * 50} />
            ))}
          </div>
        ) : heroArticle ? null : ( // Don't show "No Articles" if a hero article is present
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <h2 className="text-2xl font-headline font-semibold">No Articles Found</h2>
            <p className="mt-2 text-muted-foreground">
              Try adjusting your search or filter. We've refined your search using AI, but sometimes the well is dry!
            </p>
            <Button asChild className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/">Clear Filters</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
