import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { movieApi, getImageUrl } from '@/lib/api';
import { MovieDetailsClient } from './MovieDetailsClient';

interface Props {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const movie = await movieApi.getMovieDetails(parseInt(params.id));
    
    return {
      title: `${movie.title} - MovieApp`,
      description: movie.overview,
      openGraph: {
        title: movie.title,
        description: movie.overview,
        images: movie.poster_path ? [getImageUrl(movie.poster_path)] : [],
      },
    };
  } catch {
    return {
      title: 'Movie Not Found - MovieApp',
    };
  }
}

export async function generateStaticParams() {
  try {
    // Fetch movies from multiple sources and pages
    const movieIds = new Set<number>();

    // Fetch several pages from each source
    const fetchMoviesFromMultiplePages = async (apiCall: any, pages = 5) => {
      const promises = [];
      for (let page = 1; page <= pages; page++) {
        promises.push(
          apiCall(page).catch(() => ({ results: [] }))
        );
      }
      return Promise.all(promises);
    };

    // Only getNowPlaying is available in movieApi, so we fetch only that.
    const [nowPlayingPages] = await Promise.all([
      fetchMoviesFromMultiplePages((page: number) => movieApi.getNowPlaying(undefined, page)),
    ]);

    // Collect all IDs from nowPlayingPages
    nowPlayingPages.forEach((pageResults: any) => {
      if (Array.isArray(pageResults)) {
        pageResults.forEach((page: any) => {
          if (page.results) {
            page.results.forEach((movie: any) => {
              movieIds.add(movie.id);
            });
          }
        });
      } else if (pageResults.results) {
        pageResults.results.forEach((movie: any) => {
          movieIds.add(movie.id);
        });
      }
    });

    // Fetch recommendations from the first 50 movies
    const firstMovies = Array.from(movieIds).slice(0, 50);
    for (const movieId of firstMovies) {
      try {
        const recommendations = await movieApi.getRecommendations(movieId);
        if (recommendations.results) {
          recommendations.results.forEach((rec: any) => {
            movieIds.add(rec.id);
          });
        }
      } catch {
        // Ignore errors
      }
    }

    // Add important additional IDs
    const importantIds = [1134865, 1151031, 9822, 550, 680, 13, 19995, 155];
    importantIds.forEach(id => movieIds.add(id));

    // Convert to params format
    const params = Array.from(movieIds).map(id => ({
      id: id.toString(),
    }));

    console.log(`Generated ${params.length} static params for movies`);
    return params;

  } catch (error) {
    console.error('Error generating static params:', error);

    // Fallback in case API calls fail
    const fallbackIds = [1134865, 1151031, 9822, 550, 680, 13, 19995, 155];
    return fallbackIds.map(id => ({ id: id.toString() }));
  }
}

export default async function MoviePage({ params }: Props) {
  const movieId = parseInt(params.id);
  
  if (isNaN(movieId)) {
    notFound();
  }

  try {
    const [movie, recommendations] = await Promise.all([
      movieApi.getMovieDetails(movieId),
      movieApi.getRecommendations(movieId).catch(() => ({ results: [] })),
    ]);

    return (
      <MovieDetailsClient 
        movie={movie} 
        recommendations={recommendations.results || []} 
      />
    );
  } catch (error) {
    console.error('Error fetching movie details:', error);
    notFound();
  }
}