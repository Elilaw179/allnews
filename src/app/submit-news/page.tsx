import NewsSubmissionForm from '@/components/news-submission-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function SubmitNewsPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Submit Your News</CardTitle>
          <CardDescription>
            Have a story to share? Fill out the form below to submit your article for review by our team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewsSubmissionForm />
        </CardContent>
      </Card>
    </div>
  );
}
