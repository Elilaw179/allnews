'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { submitNewsArticle, type FormState } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const initialState: FormState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={true} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
        </>
      ) : (
        'Submit for Review'
      )}
    </Button>
  );
}

export default function NewsSubmissionForm() {
  const [state, formAction] = useActionState(submitNewsArticle, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message === 'success') {
      toast({
        title: 'Success!',
        description: 'Your article has been submitted for review.',
      });
      // A production app would likely reset the form here
    } else if (state.message && state.message !== 'success') {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: state.message,
      });
    }
  }, [state, toast]);
  
  // A key is used on the form to reset it upon successful submission
  const formKey = state.message === 'success' ? Date.now() : 'static-key';

  return (
    <>
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Feature Disabled</AlertTitle>
      <AlertDescription>
        News submission is disabled now that the app is connected to a live news feed.
      </AlertDescription>
    </Alert>
    <form key={formKey} action={formAction} className="space-y-6 mt-6 opacity-50 pointer-events-none">
      <div className="space-y-2">
        <Label htmlFor="title">Article Title</Label>
        <Input id="title" name="title" placeholder="e.g., A New Discovery in Quantum Physics" required disabled />
        {state.errors?.title && (
          <p className="text-sm text-destructive">{state.errors.title.join(', ')}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Write your full article here..."
          required
          rows={10}
          disabled
        />
        {state.errors?.content && (
          <p className="text-sm text-destructive">{state.errors.content.join(', ')}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
            <Label htmlFor="author">Author Name</Label>
            <Input id="author" name="author" placeholder="Your Name" required disabled />
            {state.errors?.author && (
            <p className="text-sm text-destructive">{state.errors.author.join(', ')}</p>
            )}
        </div>
        <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" placeholder="e.g., New York, USA" required disabled />
            {state.errors?.location && (
            <p className="text-sm text-destructive">{state.errors.location.join(', ')}</p>
            )}
        </div>
      </div>
      
       <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" placeholder="e.g., Technology" required disabled />
            {state.errors?.category && (
            <p className="text-sm text-destructive">{state.errors.category.join(', ')}</p>
            )}
      </div>

      <SubmitButton />
    </form>
    </>
  );
}
