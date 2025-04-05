import React, { createContext, useContext, useState, ReactNode } from 'react';
import { searchMovies } from '@/api/movie';
import { Movie } from '@/api/types';

interface SearchContextProps {
  searchQuery: string;
  searchResults: Movie[];
  isSearching: boolean;
  searchError: string | null;
  setSearchQuery: (query: string) => void;
  performSearch: (query: string) => Promise<void>;
  clearSearch: () => void;
  loadMoreSearchResults: () => Promise<void>;
  searchPage: number;
  totalPages: number;
  totalResults: number;
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchPage, setSearchPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalResults, setTotalResults] = useState<number>(0);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      clearSearch();
      return;
    }

    setSearchQuery(query);
    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await searchMovies(query, 1);
      setSearchResults(response.results);
      setTotalPages(response.total_pages);
      setTotalResults(response.total_results);
      setSearchPage(1);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : 'An error occurred during search');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const loadMoreSearchResults = async () => {
    if (!searchQuery || searchPage >= totalPages || isSearching) return;

    setIsSearching(true);
    try {
      const nextPage = searchPage + 1;
      const response = await searchMovies(searchQuery, nextPage);
      setSearchResults((prevResults) => [...prevResults, ...response.results]);
      setSearchPage(nextPage);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : 'An error occurred while loading more results');
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchPage(1);
    setTotalPages(0);
    setTotalResults(0);
    setSearchError(null);
  };

  const value = {
    searchQuery,
    searchResults,
    isSearching,
    searchError,
    setSearchQuery,
    performSearch,
    clearSearch,
    loadMoreSearchResults,
    searchPage,
    totalPages,
    totalResults
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export const useSearch = (): SearchContextProps => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
