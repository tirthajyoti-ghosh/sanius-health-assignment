import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MovieList } from '@/components/MovieList';
import { useMovies } from '@/context/MovieContext';

export default function PopularScreen() {
  const { moviesData, isLoading, error, loadMoreMovies, refreshMovies, setCurrentCategory } = useMovies();
  
  useEffect(() => {
    setCurrentCategory('popular');
  }, []);

  return (
    <ThemedView style={styles.container}>
      <MovieList
        movies={moviesData.popular}
        isLoading={isLoading}
        onRefresh={refreshMovies}
        onEndReached={loadMoreMovies}
        error={error}
        ListHeaderComponent={
          <ThemedView style={styles.header}>
            <ThemedText type="title">Popular Movies</ThemedText>
            <ThemedText>Most watched movies right now</ThemedText>
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