'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, Calendar } from 'lucide-react';
import { Movie, getImageUrl } from '@/lib/api';
import { useWishlistStore } from '@/store/wishlistStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const [imageError, setImageError] = useState(false);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(movie.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(movie.id);
    } else {
      addToWishlist(movie);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.getFullYear().toString();
  };

  return (
    <Link href={`/movie/${movie.id}`}>
      <Card className="group cursor-pointer bg-gray-900 border-gray-800 hover:border-red-500 transition-all duration-300 hover:scale-105 overflow-hidden">
        <div className="relative aspect-[2/3] overflow-hidden">
          {!imageError ? (
            <Image
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <span className="text-gray-400 text-center p-4">{movie.title}</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <Button
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 ${
              inWishlist 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-black/50 text-white hover:bg-red-500'
            }`}
            size="sm"
          >
            <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
          </Button>
        </div>
        
        <CardContent className="p-4">
          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-1 group-hover:text-red-500 transition-colors">
            {movie.title}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(movie.release_date)}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}