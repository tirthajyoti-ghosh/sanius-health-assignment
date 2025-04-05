import React, { useEffect, useState } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MovieList } from '@/components/MovieList';
import { useMovies } from '@/context/MovieContext';

export default function NowPlayingScreen() {
  const { moviesData, isLoading, error, loadMoreMovies, refreshMovies, setCurrentCategory } = useMovies();
  
  useEffect(() => {
    setCurrentCategory('upcoming');
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#1a1a2e', '#121218']}
        style={styles.gradientBackground}
      >
        <ThemedView style={styles.container}>
          <MovieList
            movies={moviesData.upcoming}
            isLoading={isLoading}
            onRefresh={refreshMovies}
            onEndReached={loadMoreMovies}
            error={error}
            ListHeaderComponent={
              <ThemedView style={styles.header}>
                <ThemedText type="title" style={styles.headerText}>Upcoming Movies</ThemedText>
                <ThemedText style={styles.subtitle}>Coming soon to theatres</ThemedText>
              </ThemedView>
            }
          />
        </ThemedView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 10,
  },
  header: {
    padding: 20,
    paddingLeft: 4,
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerIcon: {
    marginRight: 12,
  }
});
