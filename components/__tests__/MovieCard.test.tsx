import * as React from 'react';
import {render} from '@testing-library/react-native';
import { MovieCard } from '../MovieCard';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@/api/movie', () => ({
  getImageUrl: (path: string) => path ? `https://image.tmdb.org/t/p/w342${path}` : null,
}));

const mockMovie = {
  id: 1,
  title: 'Test Movie',
  poster_path: '/test-path.jpg',
  backdrop_path: null,
  release_date: '2023-01-01',
  vote_average: 7.5,
  overview: 'Test overview',
  genre_ids: [1, 2],
  adult: false,
  original_language: 'en',
  original_title: 'Test Movie Original',
  popularity: 123.45,
  video: false,
  vote_count: 1000,
};

it(`renders movie card correctly`, () => {
  const tree = render(<MovieCard movie={mockMovie} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it(`renders movie card without poster correctly`, () => {
  const movieWithoutPoster = { ...mockMovie, poster_path: null };
  const tree = render(<MovieCard movie={movieWithoutPoster} />).toJSON();
  expect(tree).toMatchSnapshot();
});