'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search as SearchIcon } from 'lucide-react';
import { movieApi, Movie } from '@/lib/api';
import { useLanguageStore } from '@/store/languageStore';
import { MovieCard } from '@/components/MovieCard';
import { Pagination } from '@/components/Pagination';
import { MovieGridSkeleton } from '@/components/LoadingSkeleton';

export default function SearchPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const { language } = useLanguageStore();

  useEffect(() => {
    if (!query.trim()) return;

    const searchMovies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await movieApi.searchMovies(query, language, currentPage);
        setMovies(response.results);
        setTotalPages(response.total_pages);
        setTotalResults(response.total_results);
      } catch (err) {
        setError('Failed to search movies. Please try again later.');
        console.error('Error searching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    searchMovies();
  }, [query, currentPage, language]);

  if (!query.trim()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <SearchIcon className="h-24 w-24 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-400 mb-4">No search query provided</h2>
          <p className="text-gray-500">Please enter a search term to find movies.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Search Results for{' '}
          <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            "{query}"
          </span>
        </h1>
        {!loading && (
          <p className="text-gray-400 text-lg">
            {totalResults > 0 
              ? `Found ${totalResults.toLocaleString()} ${totalResults === 1 ? 'movie' : 'movies'}`
              : 'No movies found'
            }
          </p>
        )}
      </div>

      {loading ? (
        <MovieGridSkeleton />
      ) : movies.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          <Pagination 
            currentPage={currentPage} 
            totalPages={Math.min(totalPages, 500)} // TMDB API limit
            basePath="/search"
          />
        </>
      ) : (
        <div className="text-center py-12">
          <SearchIcon className="h-24 w-24 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-400 mb-4">No movies found</h2>
          <p className="text-gray-500">
            Try searching with different keywords or check your spelling.
          </p>
        </div>
      )}
    </div>
  );
}