import Link from 'next/link';
import { Film, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <div className="mb-8">
          <Film className="h-32 w-32 text-gray-600 mx-auto mb-6" />
          <h1 className="text-8xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-4xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-xl text-gray-400 max-w-md mx-auto mb-8">
            The page you're looking for doesn't exist or has been moved to another location.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
            <Link href="/search">
              <Search className="h-4 w-4 mr-2" />
              Search Movies
            </Link>
          </Button>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>Lost? Try browsing our movie collection or use the search feature to find what you're looking for.</p>
        </div>
      </div>
    </div>
  );
}