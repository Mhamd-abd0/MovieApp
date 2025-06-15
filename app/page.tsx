'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { movieApi, Movie } from '@/lib/api';
import { useWishlistStore } from '@/store/wishlistStore';
import { useLanguageStore } from '@/store/languageStore';
import { MovieCard } from '@/components/MovieCard';
import { Pagination } from '@/components/Pagination';
import { MovieGridSkeleton } from '@/components/LoadingSkeleton';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const { loadWishlist } = useWishlistStore();
  const { language } = useLanguageStore();

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await movieApi.getNowPlaying(language, currentPage);
        setMovies(response.results);
        setTotalPages(response.total_pages);
      } catch (err) {
        setError('Failed to fetch movies. Please try again later.');
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [currentPage, language]);

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
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
          Now Playing Movies
        </h1>
        <p className="text-gray-400 text-lg">
          Discover the latest movies currently playing in theaters
        </p>
      </div>

      {loading ? (
        <MovieGridSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          <Pagination 
            currentPage={currentPage} 
            totalPages={Math.min(totalPages, 500)} // TMDB API limit
          />
        </>
      )}
    </div>
  );
}