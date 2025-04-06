import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MovieCard } from '../MovieCard';
import { useFavorites } from '@/context/FavoritesContext';
import { useRouter } from 'expo-router';
import { getImageUrl } from '@/api/movie';
import { formatDate } from '@/utils/date';

// Mock dependencies
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock('@/context/FavoritesContext', () => ({
  useFavorites: jest.fn(),
}));

jest.mock('@/api/movie', () => ({
  getImageUrl: jest.fn(),
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons'
}));

jest.mock('@/components/ThemedText', () => ({
  ThemedText: 'ThemedText'
}));

jest.mock('@/components/ThemedView', () => ({
  ThemedView: 'ThemedView'
}));

const mockMovie = {
  id: 1,
  title: 'Test Movie',
  poster_path: '/test-poster.jpg',
  backdrop_path: '/test-backdrop.jpg',
  release_date: '2023-01-01',
  vote_average: 8.5,
  overview: 'Test overview',
  genre_ids: [1, 2],
  adult: false,
  original_language: 'en',
  original_title: 'Original Test Movie',
  popularity: 100.5,
  video: false,
  vote_count: 1000
};

describe('MovieCard', () => {
  const mockRouter = { push: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (getImageUrl as jest.Mock).mockReturnValue('https://image.url');
    (useFavorites as jest.Mock).mockReturnValue({ isFavorite: () => false });
  });

  it('renders movie title and release date', () => {
    const { getAllByTestId } = render(<MovieCard movie={mockMovie} />);

    const textElements = getAllByTestId('themed-text');
    expect(textElements.some(el => el.props.children === 'Test Movie')).toBeTruthy();
    expect(textElements.some(el => el.props.children === formatDate(mockMovie.release_date))).toBeTruthy();
  });

  it('shows movie poster when poster_path exists', () => {
    const { getByTestId } = render(<MovieCard movie={mockMovie} />);

    const poster = getByTestId('movie-poster');
    expect(poster.props.source.uri).toBe('https://image.url');
  });

  it('shows placeholder when poster_path is missing', () => {
    const movieWithoutPoster = { ...mockMovie, poster_path: null };
    const { getByTestId } = render(<MovieCard movie={movieWithoutPoster} />);

    expect(getByTestId('no-image-placeholder')).toBeTruthy();
  });

  it('displays correct rating', () => {
    const { getAllByTestId } = render(<MovieCard movie={mockMovie} />);

    const textElements = getAllByTestId('themed-text');
    expect(textElements.some(el => el.props.children === '8.5')).toBeTruthy();
  });

  it('shows favorite indicator when movie is favorite', () => {
    (useFavorites as jest.Mock).mockReturnValue({ isFavorite: () => true });
    const { getByTestId } = render(<MovieCard movie={mockMovie} />);

    expect(getByTestId('favorite-indicator')).toBeTruthy();
  });

  it('hides favorite indicator when movie is not favorite', () => {
    (useFavorites as jest.Mock).mockReturnValue({ isFavorite: () => false });
    const { queryByTestId } = render(<MovieCard movie={mockMovie} />);

    expect(queryByTestId('favorite-indicator')).toBeNull();
  });

  it('navigates to movie details on press', () => {
    const { getByTestId } = render(<MovieCard movie={mockMovie} />);

    fireEvent.press(getByTestId('movie-card'));
    expect(mockRouter.push).toHaveBeenCalledWith('/movie/1');
  });
});
