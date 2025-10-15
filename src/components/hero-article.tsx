import type { Article } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

type HeroArticleProps = {
  article: Article;
};

export default function HeroArticle({ article }: HeroArticleProps) {
  return (
    <section className="relative h-[50vh] min-h-[400px] w-full text-white">
      <div className="absolute inset-0 z-0">
        <Image
          src={article.imageUrl}
          alt={article.title}
          data-ai-hint={article.imageHint}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>
      <div className="relative z-10 flex h-full flex-col justify-end p-8 md:p-12">
        <div className="max-w-3xl">
          <Badge className="mb-2">{article.category}</Badge>
          <h1 className="mb-4 font-headline text-3xl font-bold leading-tight md:text-5xl">
            {article.title}
          </h1>
          <p className="mb-6 hidden text-lg text-white/90 md:block">
            {article.excerpt}
          </p>
          <Button asChild size="lg">
            <Link href={`/news/${article.slug}`}>Read More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
