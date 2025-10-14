export type Article = {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  imageHint: string;
  category: string;
  author: string;
  location: string;
  date: string; // ISO 8601 format
  status: 'published' | 'pending' | 'rejected';
};
