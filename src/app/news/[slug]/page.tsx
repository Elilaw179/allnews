import { getArticleBySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, User, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import SummarizeTool from '@/components/summarize-tool';

type ArticlePageProps = {
  params: {
    slug: string;
  };
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <article>
        <div className="mb-4">
          <Badge>{article.category}</Badge>
        </div>
        <h1 className="mb-4 font-headline text-3xl font-bold tracking-tight md:text-5xl">
          {article.title}
        </h1>
        <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{article.location}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <time dateTime={article.date}>
              {format(new Date(article.date), 'MMMM d, yyyy')}
            </time>
          </div>
        </div>

        <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg shadow-lg md:h-96">
          <Image
            src={article.imageUrl}
            alt={article.title}
            data-ai-hint={article.imageHint}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="mb-8">
            <SummarizeTool articleContent={article.content} />
        </div>

        <Separator className="my-8" />

        <div className="prose max-w-none text-lg font-body dark:prose-invert">
            {article.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
        </div>
      </article>
    </div>
  );
}

// Generate static paths for better performance
import { getArticles } from '@/lib/data';

export async function generateStaticParams() {
  const articles = await getArticles({ status: 'published' });
  return articles.map((article) => ({
    slug: article.slug,
  }));
}
