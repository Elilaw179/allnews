import { getArticles } from '@/lib/data';
import AdminDashboard from '@/components/admin-dashboard';

export default async function AdminPage() {
  const pendingArticles = await getArticles({ status: 'pending' });
  const rejectedArticles = await getArticles({ status: 'rejected' });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-headline font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Review and manage user-submitted news articles.
        </p>
      </div>
      <AdminDashboard 
        pendingArticles={pendingArticles}
        rejectedArticles={rejectedArticles}
      />
    </div>
  );
}
