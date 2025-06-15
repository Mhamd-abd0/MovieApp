import { create } from 'zustand';
import { Movie } from '@/lib/api';
import { storage } from '@/lib/storage';

interface WishlistStore {
  wishlist: Movie[];
  isInWishlist: (id: number) => boolean;
  addToWishlist: (movie: Movie) => void;
  removeFromWishlist: (id: number) => void;
  loadWishlist: () => void;
}

const WISHLIST_KEY = 'movie-wishlist';

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  wishlist: [],

  isInWishlist: (id: number) => {
    return get().wishlist.some(movie => movie.id === id);
  },

  addToWishlist: (movie: Movie) => {
    const { wishlist } = get();
    if (!wishlist.some(item => item.id === movie.id)) {
      const newWishlist = [...wishlist, movie];
      set({ wishlist: newWishlist });
      storage.set(WISHLIST_KEY, newWishlist);
    }
  },

  removeFromWishlist: (id: number) => {
    const { wishlist } = get();
    const newWishlist = wishlist.filter(movie => movie.id !== id);
    set({ wishlist: newWishlist });
    storage.set(WISHLIST_KEY, newWishlist);
  },

  loadWishlist: () => {
    const savedWishlist = storage.get<Movie[]>(WISHLIST_KEY) || [];
    set({ wishlist: savedWishlist });
  },
}));