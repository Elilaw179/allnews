'use client';

import type { Article } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { approveArticle, rejectArticle } from '@/lib/actions';
import { Check, X, Loader2, Terminal } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function ActionButton({ variant }: { variant: 'approve' | 'reject' }) {
    const { pending } = useFormStatus();
    const isApprove = variant === 'approve';

    return (
        <Button
            type="submit"
            size="icon"
            variant={isApprove ? 'ghost' : 'ghost'}
            className={isApprove ? 'hover:bg-green-100 dark:hover:bg-green-900 text-green-600' : 'hover:bg-red-100 dark:hover:bg-red-900 text-red-600'}
            disabled={true}
            aria-label={isApprove ? 'Approve' : 'Reject'}
        >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : isApprove ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
    );
}

function ArticleTable({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return <p className="text-muted-foreground p-4 text-center">No articles in this category.</p>
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead className="hidden md:table-cell">Author</TableHead>
          <TableHead className="hidden sm:table-cell">Location</TableHead>
          <TableHead className="hidden md:table-cell">Submitted</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articles.map((article) => (
          <TableRow key={article.id}>
            <TableCell className="font-medium max-w-[200px] truncate">{article.title}</TableCell>
            <TableCell className="hidden md:table-cell">{article.author}</TableCell>
            <TableCell className="hidden sm:table-cell">{article.location}</TableCell>
            <TableCell className="hidden md:table-cell">
              {format(new Date(article.date), 'PP')}
            </TableCell>
            <TableCell className="text-right">
              {article.status === 'pending' && (
                <div className="flex justify-end gap-2">
                    <form action={approveArticle}>
                        <input type="hidden" name="id" value={article.id} />
                        <ActionButton variant="approve" />
                    </form>
                    <form action={rejectArticle}>
                        <input type="hidden" name="id" value={article.id} />
                        <ActionButton variant="reject" />
                    </form>
                </div>
              )}
               {article.status === 'rejected' && (
                <form action={approveArticle}>
                    <input type="hidden" name="id" value={article.id} />
                    <ActionButton variant="approve" />
                </form>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}


export default function AdminDashboard({ pendingArticles, rejectedArticles }: { pendingArticles: Article[], rejectedArticles: Article[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Article Submissions</CardTitle>
        <CardDescription>
          Manage articles submitted by users. Approved articles will appear on the main site.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Feature Disabled</AlertTitle>
          <AlertDescription>
            The admin dashboard is disabled now that the app is connected to a live news feed.
          </AlertDescription>
        </Alert>
        <div className="opacity-50 pointer-events-none">
          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">Pending Review ({pendingArticles.length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({rejectedArticles.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              <ArticleTable articles={pendingArticles} />
            </TabsContent>
            <TabsContent value="rejected">
              <ArticleTable articles={rejectedArticles} />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
