import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MovieList } from '@/components/MovieList';
import { useMovies } from '@/context/MovieContext';

export default function NowPlayingScreen() {
  const { moviesData, isLoading, error, loadMoreMovies, refreshMovies, setCurrentCategory } = useMovies();
  
  useEffect(() => {
    setCurrentCategory('now_playing');
  }, []);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Now Playing', headerShown: true }} />
      <MovieList
        movies={moviesData.now_playing}
        isLoading={isLoading}
        onRefresh={refreshMovies}
        onEndReached={loadMoreMovies}
        error={error}
        ListHeaderComponent={
          <ThemedView style={styles.header}>
            <ThemedText type="title">Now Playing</ThemedText>
            <ThemedText>Currently showing in theaters</ThemedText>
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
