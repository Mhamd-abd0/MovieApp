'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Heart, Star, Clock, Calendar, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MovieDetails, Movie, getImageUrl } from '@/lib/api';
import { useWishlistStore } from '@/store/wishlistStore';
import { MovieCard } from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MovieDetailsClientProps {
  movie: MovieDetails;
  recommendations: Movie[];
}

export function MovieDetailsClient({ movie, recommendations }: MovieDetailsClientProps) {
  const [imageError, setImageError] = useState(false);
  const { isInWishlist, addToWishlist, removeFromWishlist, loadWishlist } = useWishlistStore();
  const router = useRouter();
  const inWishlist = isInWishlist(movie.id);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(movie.id);
    } else {
      addToWishlist(movie);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] lg:h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          {movie.backdrop_path && (
            <Image
              src={getImageUrl(movie.backdrop_path, 'original')}
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-transparent to-gray-950/80" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-8 w-full">
            {/* Poster */}
            <div className="flex-shrink-0">
              <div className="relative w-64 h-96 rounded-lg overflow-hidden shadow-2xl">
                {!imageError ? (
                  <Image
                    src={getImageUrl(movie.poster_path)}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-400 text-center p-4">{movie.title}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Movie Info */}
            <div className="flex-grow">
              <Button
                onClick={() => router.back()}
                variant="outline"
                size="sm"
                className="mb-4 bg-black/50 border-gray-700 text-white hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              <h1 className="text-4xl lg:text-6xl font-bold mb-4">{movie.title}</h1>
              
              {movie.tagline && (
                <p className="text-xl text-gray-300 italic mb-4">{movie.tagline}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">{movie.vote_average.toFixed(1)}</span>
                  <span className="text-gray-400">({movie.vote_count.toLocaleString()} votes)</span>
                </div>
                
                <div className="flex items-center space-x-1 text-gray-300">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(movie.release_date)}</span>
                </div>
                
                <div className="flex items-center space-x-1 text-gray-300">
                  <Clock className="h-4 w-4" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary" className="bg-gray-800 text-white">
                    {genre.name}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <Button
                  onClick={handleWishlistToggle}
                  className={`flex items-center space-x-2 ${
                    inWishlist 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
                  <span>{inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              {movie.overview || 'No overview available.'}
            </p>

            {movie.production_companies.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Production Companies</h3>
                <div className="flex flex-wrap gap-4">
                  {movie.production_companies.map((company) => (
                    <div key={company.id} className="bg-gray-800 rounded-lg p-4 flex items-center space-x-3">
                      {company.logo_path && (
                        <div className="relative w-12 h-12">
                          <Image
                            src={getImageUrl(company.logo_path)}
                            alt={company.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                      <span className="text-white">{company.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Movie Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400">Status:</span>
                  <span className="ml-2 font-semibold">{movie.status}</span>
                </div>
                <div>
                  <span className="text-gray-400">Original Language:</span>
                  <span className="ml-2 font-semibold">{movie.original_language.toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-gray-400">Budget:</span>
                  <span className="ml-2 font-semibold">
                    {movie.budget > 0 ? `$${movie.budget.toLocaleString()}` : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Revenue:</span>
                  <span className="ml-2 font-semibold">
                    {movie.revenue > 0 ? `$${movie.revenue.toLocaleString()}` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Recommended Movies</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {recommendations.slice(0, 12).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}