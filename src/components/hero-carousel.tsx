'use client';

import * as React from 'react';
import type { Article } from '@/types';
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import HeroArticle from './hero-article';

type HeroCarouselProps = {
  articles: Article[];
};

export default function HeroCarousel({ articles }: HeroCarouselProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <section className="relative h-[50vh] min-h-[400px] w-full">
      <Carousel 
        opts={{ loop: true }}
        plugins={[plugin.current]}
        className="w-full h-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="h-full">
          {articles.map((article) => (
            <CarouselItem key={article.id} className="h-full">
              <HeroArticle article={article} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white bg-black/30 hover:bg-black/50 border-none" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white bg-black/30 hover:bg-black/50 border-none" />
      </Carousel>
    </section>
  );
}
