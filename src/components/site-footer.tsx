import { Globe, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-start">
             <Link href="/" className="mb-2 flex items-center space-x-2">
                <Globe className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline sm:inline-block text-lg">
                Global News Hub
                </span>
            </Link>
            <p className="text-sm text-muted-foreground">
                Your source for top world news, with community submissions and AI-powered summaries.
            </p>
          </div>
           <div className="md:justify-self-center">
             <h3 className="mb-2 font-headline font-semibold">Follow Us</h3>
             <div className="flex space-x-4">
               <Link href="#" className="text-muted-foreground hover:text-primary">
                 <Facebook className="h-6 w-6" />
               </Link>
               <Link href="#" className="text-muted-foreground hover:text-primary">
                 <Twitter className="h-6 w-6" />
               </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                    <Instagram className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                    <Linkedin className="h-6 w-6" />
                </Link>
             </div>
           </div>
           <div className="md:justify-self-end">
                <h3 className="mb-2 font-headline font-semibold">Quick Links</h3>
                <nav className="flex flex-col space-y-2">
                    <Link href="/" className="text-sm text-muted-foreground hover:text-primary">Home</Link>
                    <Link href="/?category=Technology" className="text-sm text-muted-foreground hover:text-primary">Technology</Link>
                    <Link href="/?category=Business" className="text-sm text-muted-foreground hover:text-primary">Business</Link>
                    <Link href="/?category=Sports" className="text-sm text-muted-foreground hover:text-primary">Sports</Link>
                </nav>
           </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Global News Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
