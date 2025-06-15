'use client';

import { useEffect } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import { MovieCard } from '@/components/MovieCard';
import { Button } from '@/components/ui/button';

export default function WishlistPage() {
  const { wishlist, loadWishlist, removeFromWishlist } = useWishlistStore();

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const clearWishlist = () => {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      wishlist.forEach(movie => removeFromWishlist(movie.id));
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Heart className="h-24 w-24 text-gray-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-400 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-500 text-lg mb-8">
            Start adding movies to your wishlist by clicking the heart icon on any movie card.
          </p>
          <Button
            onClick={() => window.location.href = '/'}
            className="bg-red-600 hover:bg-red-700"
          >
            Browse Movies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            My Wishlist
          </h1>
          <p className="text-gray-400 text-lg">
            {wishlist.length} {wishlist.length === 1 ? 'movie' : 'movies'} in your wishlist
          </p>
        </div>
        
        {wishlist.length > 0 && (
          <Button
            onClick={clearWishlist}
            variant="outline"
            className="bg-red-900/20 border-red-800 text-red-400 hover:bg-red-900/40"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {wishlist.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}