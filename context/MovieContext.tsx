import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchMovies, getMovieDetails } from '@/api/movie';
import { Movie, MovieCategory } from '@/api/types';

interface MovieContextProps {
  moviesData: Record<MovieCategory, Movie[]>;
  currentCategory: MovieCategory;
  isLoading: boolean;
  error: string | null;
  setCurrentCategory: (category: MovieCategory) => void;
  loadMoreMovies: () => Promise<void>;
  refreshMovies: () => Promise<void>;
  getMovie: (id: number) => Movie | undefined;
  fetchMovieDetails: (id: number) => Promise<Movie>;
}

const MovieContext = createContext<MovieContextProps | undefined>(undefined);

interface MovieProviderProps {
  children: ReactNode;
}

export const MovieProvider: React.FC<MovieProviderProps> = ({ children }) => {
  const [currentCategory, setCurrentCategory] = useState<MovieCategory>('now_playing');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<Record<MovieCategory, number>>({
    now_playing: 1,
    popular: 1,
    top_rated: 1,
    upcoming: 1,
  });
  const [moviesData, setMoviesData] = useState<Record<MovieCategory, Movie[]>>({
    now_playing: [],
    popular: [],
    top_rated: [],
    upcoming: [],
  });
  const [movieDetails, setMovieDetails] = useState<Record<number, Movie>>({});

  const fetchMoviesForCategory = async (category: MovieCategory, page: number, refresh = false): Promise<void> => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await fetchMovies(category, page);
      
      setMoviesData(prev => ({
        ...prev,
        [category]: refresh ? response.results : [...prev[category], ...response.results],
      }));
      
      setCurrentPage(prev => ({
        ...prev,
        [category]: page,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreMovies = async (): Promise<void> => {
    const nextPage = currentPage[currentCategory] + 1;
    await fetchMoviesForCategory(currentCategory, nextPage);
  };

  const refreshMovies = async (): Promise<void> => {
    await fetchMoviesForCategory(currentCategory, 1, true);
  };

  const fetchMovieDetails = async (id: number): Promise<Movie> => {
    try {
      const movie = await getMovieDetails(id);
      setMovieDetails(prev => ({
        ...prev,
        [id]: movie
      }));
      return movie;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      throw err;
    }
  };

  const getMovie = (id: number): Movie | undefined => {
    return movieDetails[id] || moviesData[currentCategory].find(movie => movie.id === id);
  };

  useEffect(() => {
    if (moviesData[currentCategory].length === 0) {
      fetchMoviesForCategory(currentCategory, 1);
    }
  }, [currentCategory]);

  const value = {
    moviesData,
    currentCategory,
    isLoading,
    error,
    setCurrentCategory,
    loadMoreMovies,
    refreshMovies,
    getMovie,
    fetchMovieDetails
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};

export const useMovies = (): MovieContextProps => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};