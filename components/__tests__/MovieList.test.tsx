import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { MovieList } from '../MovieList';
import { ThemedText } from '../ThemedText';

// Mock dependencies
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons'
}));

jest.mock('@/components/ThemedText', () => ({
  ThemedText: 'ThemedText'
}));

jest.mock('@/components/ThemedView', () => ({
  ThemedView: 'ThemedView'
}));

jest.mock('@/components/MovieCard', () => ({
  MovieCard: 'MovieCard'
}));

const mockMovies = [
  {
    id: 1,
    title: 'Test Movie 1',
    poster_path: '/test1.jpg',
    backdrop_path: '/backdrop1.jpg',
    release_date: '2023-01-01',
    vote_average: 8.5,
    overview: 'Test overview 1',
    genre_ids: [1, 2],
    adult: false,
    original_language: 'en',
    original_title: 'Original Test Movie 1',
    popularity: 100.5,
    video: false,
    vote_count: 1000
  },
  {
    id: 2,
    title: 'Test Movie 2',
    poster_path: '/test2.jpg',
    backdrop_path: '/backdrop2.jpg',
    release_date: '2023-02-01',
    vote_average: 7.5,
    overview: 'Test overview 2',
    genre_ids: [2, 3],
    adult: false,
    original_language: 'en',
    original_title: 'Original Test Movie 2',
    popularity: 90.5,
    video: false,
    vote_count: 800
  }
];

describe('MovieList', () => {
  const mockOnRefresh = jest.fn(() => Promise.resolve());
  const mockOnEndReached = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders list of movies', () => {
    const { UNSAFE_getAllByType } = render(
      <MovieList
        movies={mockMovies}
        isLoading={false}
        onRefresh={mockOnRefresh}
        onEndReached={mockOnEndReached}
        error={null}
      />
    );
  
    const movieCards = UNSAFE_getAllByType('MovieCard');
    expect(movieCards).toHaveLength(2);
  });
  
  it('shows error state when error prop is provided', () => {
    const errorMessage = 'Failed to load movies';
    const { UNSAFE_getAllByType } = render(
      <MovieList
        movies={[]}
        isLoading={false}
        onRefresh={mockOnRefresh}
        onEndReached={mockOnEndReached}
        error={errorMessage}
      />
    );
  
    const textElements = UNSAFE_getAllByType('ThemedText');
    expect(textElements.some(el => el.props.children === 'Error')).toBeTruthy();
    expect(textElements.some(el => el.props.children === errorMessage)).toBeTruthy();
  });

  it('shows loading state when isLoading is true', () => {
    const { getAllByTestId } = render(
      <MovieList
        movies={[]}
        isLoading={true}
        onRefresh={mockOnRefresh}
        onEndReached={mockOnEndReached}
        error={null}
      />
    );

    const textElements = getAllByTestId('themed-text-loading');
    expect(textElements.some(el => el.props.children === 'Loading movies...')).toBeTruthy();
  });

  it('shows empty state when no movies and not loading', () => {
    const { getAllByTestId } = render(
      <MovieList
        movies={[]}
        isLoading={false}
        onRefresh={mockOnRefresh}
        onEndReached={mockOnEndReached}
        error={null}
      />
    );

    const textElements = getAllByTestId('themed-text-empty');
    expect(textElements.some(el => el.props.children === 'No movies found')).toBeTruthy();
  });

  it('calls onRefresh when pull-to-refresh is triggered', async () => {
    const { getByTestId } = render(
      <MovieList
        movies={mockMovies}
        isLoading={false}
        onRefresh={mockOnRefresh}
        onEndReached={mockOnEndReached}
        error={null}
      />
    );

    const flatList = getByTestId('flat-list');
    await act(async () => {
      flatList.props.refreshControl.props.onRefresh();
    });

    expect(mockOnRefresh).toHaveBeenCalled();
  });

  it('calls onEndReached when scrolling to bottom', () => {
    const { getByTestId } = render(
      <MovieList
        movies={mockMovies}
        isLoading={false}
        onRefresh={mockOnRefresh}
        onEndReached={mockOnEndReached}
        error={null}
      />
    );

    const flatList = getByTestId('flat-list');
    flatList.props.onEndReached();

    expect(mockOnEndReached).toHaveBeenCalled();
  });

  it('renders header component when provided', () => {
    const HeaderComponent = () => <ThemedText testID="header">Header</ThemedText>;
    const { getByTestId } = render(
      <MovieList
        movies={mockMovies}
        isLoading={false}
        onRefresh={mockOnRefresh}
        onEndReached={mockOnEndReached}
        error={null}
        ListHeaderComponent={<HeaderComponent />}
      />
    );

    expect(getByTestId('header')).toBeTruthy();
  });

  it('shows loading indicator in footer when loading more', () => {
    const { getByTestId } = render(
      <MovieList
        movies={mockMovies}
        isLoading={true}
        onRefresh={mockOnRefresh}
        onEndReached={mockOnEndReached}
        error={null}
      />
    );

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });
});