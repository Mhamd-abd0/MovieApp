import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || 'demo_key';
const BASE_URL = 'https://api.themoviedb.org/3';

export const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
}

export interface ApiResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export const movieApi = {
  getNowPlaying: (language = 'en', page = 1): Promise<ApiResponse<Movie>> =>
    api.get('/movie/now_playing', { params: { language, page } }).then(res => res.data),

  getMovieDetails: (id: number, language = 'en'): Promise<MovieDetails> =>
    api.get(`/movie/${id}`, { params: { language } }).then(res => res.data),

  getRecommendations: (id: number, language = 'en'): Promise<ApiResponse<Movie>> =>
    api.get(`/movie/${id}/recommendations`, { params: { language } }).then(res => res.data),

  searchMovies: (query: string, language = 'en', page = 1): Promise<ApiResponse<Movie>> =>
    api.get('/search/movie', { params: { query, language, page } }).then(res => res.data),
};

export const getImageUrl = (path: string | null, size = 'w500') => {
  if (!path) return '/placeholder-movie.jpg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};