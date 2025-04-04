import { Movie, MoviesResponse, MovieCategory } from './types';

const API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const getImageUrl = (path: string | null, size: string = 'w500'): string | null => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const fetchMovies = async (category: MovieCategory, page: number = 1): Promise<MoviesResponse> => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${category}?language=en-US&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching ${category} movies: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${category} movies:`, error);
    throw error;
  }
};

export const getMovieDetails = async (movieId: number): Promise<Movie> => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching movie details: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};
