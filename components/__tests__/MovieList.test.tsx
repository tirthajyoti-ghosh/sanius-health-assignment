import React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text } from 'react-native';
import { MovieList } from '../MovieList';
import { Movie } from '@/api/types';

describe('MovieList', () => {
  const mockMovies: Movie[] = [
    {
      id: 1,
      title: 'Test Movie 1',
      poster_path: '/test1.jpg',
      backdrop_path: '/back1.jpg',
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
      backdrop_path: '/back2.jpg',
      release_date: '2023-02-02',
      vote_average: 7.5,
      overview: 'Test overview 2',
      genre_ids: [3, 4],
      adult: false,
      original_language: 'en',
      original_title: 'Original Test Movie 2',
      popularity: 90.5,
      video: false,
      vote_count: 800
    }
  ];

  // Header component with recognizable text
  const mockHeader = (
    <View>
      <Text>Featured Movies Header</Text>
    </View>
  );
  
  const defaultProps = {
    movies: mockMovies,
    isLoading: false,
    onRefresh: jest.fn().mockResolvedValue(undefined),
    onEndReached: jest.fn(),
    error: null,
    ListHeaderComponent: mockHeader
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders movie titles', () => {
    const { getByText } = render(<MovieList {...defaultProps} />);
    
    // Check that both movie titles are displayed
    expect(getByText('Test Movie 1')).toBeTruthy();
    expect(getByText('Test Movie 2')).toBeTruthy();
  });

  it('renders the header component', () => {
    const { getByText } = render(<MovieList {...defaultProps} />);
    
    // Check for the header text
    expect(getByText('Featured Movies Header')).toBeTruthy();
  });

  it('displays movie ratings', () => {
    const { getByText } = render(<MovieList {...defaultProps} />);
    
    // Check for rating information
    expect(getByText('8.5')).toBeTruthy();
    expect(getByText('7.5')).toBeTruthy();
  });

  it('shows error message when there is an error', () => {
    const errorMessage = 'Failed to load movies';
    const { getByText } = render(
      <MovieList {...defaultProps} error={errorMessage} />
    );
    
    // Check for error message and title
    expect(getByText('Error')).toBeTruthy();
    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('shows "No movies found" when movies array is empty and not loading', () => {
    const { getByText } = render(
      <MovieList {...defaultProps} movies={[]} />
    );
    
    // Check for empty state message
    expect(getByText('No movies found')).toBeTruthy();
  });

  it('does not show "No movies found" when loading with empty movies', () => {
    const { queryByText } = render(
      <MovieList {...defaultProps} movies={[]} isLoading={true} />
    );
    
    // Check that the empty state message isn't shown during loading
    expect(queryByText('No movies found')).toBeNull();
  });

  it('handles loading state appropriately', () => {
    // This is a bit tricky without testIDs, since ActivityIndicator doesn't have text
    // One approach is to check that certain elements aren't rendered
    const { queryByText } = render(
      <MovieList {...defaultProps} isLoading={true} />
    );

    // During loading with data, we should still see movie titles
    expect(queryByText('Test Movie 1')).toBeTruthy();
    expect(queryByText('Test Movie 2')).toBeTruthy();
  });
});