import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Movie } from '@/api/types';
import { getMovieDetails } from '@/api/movie';

interface FavoritesContextProps {
  favorites: Movie[];
  isLoading: boolean;
  error: string | null;
  toggleFavorite: (movie: Movie) => Promise<void>;
  isFavorite: (id: number) => boolean;
  removeFavorite: (id: number) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  // Load favorites from AsyncStorage on initial render
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        const favoriteMovies = JSON.parse(storedFavorites) as Movie[];
        setFavorites(favoriteMovies);
        
        // Create a set of favorite IDs for quick lookup
        const ids = new Set(favoriteMovies.map(movie => movie.id));
        setFavoriteIds(ids);
      }
    } catch (err) {
      setError('Failed to load favorites');
      console.error('Error loading favorites:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFavorites = async (updatedFavorites: Movie[]) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      // Update the ID set for quick lookups
      setFavoriteIds(new Set(updatedFavorites.map(movie => movie.id)));
    } catch (err) {
      console.error('Error saving favorites:', err);
      setError('Failed to save favorites');
    }
  };

  const toggleFavorite = async (movie: Movie) => {
    try {
      let updatedFavorites: Movie[];
      
      if (favoriteIds.has(movie.id)) {
        // Remove from favorites
        updatedFavorites = favorites.filter(fav => fav.id !== movie.id);
      } else {
        // Add to favorites - fetch fresh details to ensure we have complete data
        const detailedMovie = await getMovieDetails(movie.id);
        updatedFavorites = [...favorites, detailedMovie];
      }
      
      setFavorites(updatedFavorites);
      await saveFavorites(updatedFavorites);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError('Failed to update favorites');
    }
  };

  const isFavorite = (id: number): boolean => {
    return favoriteIds.has(id);
  };

  const removeFavorite = async (id: number) => {
    try {
      const updatedFavorites = favorites.filter(movie => movie.id !== id);
      setFavorites(updatedFavorites);
      await saveFavorites(updatedFavorites);
    } catch (err) {
      console.error('Error removing favorite:', err);
      setError('Failed to remove favorite');
    }
  };

  const refreshFavorites = async () => {
    await loadFavorites();
  };

  const value = {
    favorites,
    isLoading,
    error,
    toggleFavorite,
    isFavorite,
    removeFavorite,
    refreshFavorites,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = (): FavoritesContextProps => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};