import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MovieList } from '@/components/MovieList';
import { useMovies } from '@/context/MovieContext';

export default function UpcomingScreen() {
  const { moviesData, isLoading, error, loadMoreMovies, refreshMovies, setCurrentCategory } = useMovies();
  
  useEffect(() => {
    setCurrentCategory('upcoming');
  }, []);

  return (
    <ThemedView style={styles.container}>
      <MovieList
        movies={moviesData.upcoming}
        isLoading={isLoading}
        onRefresh={refreshMovies}
        onEndReached={loadMoreMovies}
        error={error}
        ListHeaderComponent={
          <ThemedView style={styles.header}>
            <ThemedText type="title">Upcoming Movies</ThemedText>
            <ThemedText>Coming soon to theaters</ThemedText>
          </ThemedView>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    gap: 8,
  },
});