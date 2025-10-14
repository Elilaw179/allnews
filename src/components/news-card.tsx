import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

type NewsCardProps = {
  article: Article;
};

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <Link href={`/news/${article.slug}`} className="group block">
      <Card className="flex h-full flex-col overflow-hidden transition-all group-hover:shadow-lg group-hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={article.imageUrl}
              alt={article.title}
              data-ai-hint={article.imageHint}
              fill
              className="object-cover"
            />
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col p-4">
          <CardTitle className="mb-2 font-headline text-lg leading-tight group-hover:text-primary">
            {article.title}
          </CardTitle>
          <p className="flex-1 text-sm text-muted-foreground">
            {article.excerpt}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2 p-4 pt-0">
           <div className="flex items-center text-xs text-muted-foreground">
             <Calendar className="mr-1.5 h-3.5 w-3.5" />
             <span>{format(new Date(article.date), 'MMMM d, yyyy')}</span>
           </div>
          <div className="flex w-full flex-wrap items-center justify-between text-xs text-muted-foreground">
             <div className="flex items-center">
                <MapPin className="mr-1.5 h-3.5 w-3.5" />
                <span>{article.location}</span>
             </div>
            <Badge variant="outline">{article.category}</Badge>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
