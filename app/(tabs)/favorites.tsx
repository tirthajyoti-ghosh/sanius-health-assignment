import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, StatusBar, View, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MovieList } from '@/components/MovieList';
import { useFavorites } from '@/context/FavoritesContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, isLoading, error, refreshFavorites } = useFavorites();
  
  useEffect(() => {
    refreshFavorites();
  }, []);

  return (
    <LinearGradient
      colors={['#1a1a2e', '#121218']}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />

      <View style={[styles.content, { paddingTop: Platform.OS === 'ios' ? 20 : 0 }]}>
        {favorites.length > 0 ? (
          <MovieList
            movies={favorites}
            isLoading={isLoading}
            onRefresh={refreshFavorites}
            onEndReached={() => {}}
            error={error}
            ListHeaderComponent={
              <ThemedView style={styles.header}>
                <ThemedText type="title" style={styles.headerText}>Favorites</ThemedText>
                <ThemedText style={styles.subtitle}>{favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} in your favorites</ThemedText>
              </ThemedView>
            }
          />
        ) : (
          <ThemedView style={styles.emptyState}>
            <Ionicons name="heart" size={80} color="rgba(255,107,107,0.3)" />
            <ThemedText style={styles.emptyStateTitle}>No favorites yet</ThemedText>
            <ThemedText style={styles.emptyStateText}>
              Movies you mark as favorites will appear here
            </ThemedText>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => router.push('/')}
            >
              <ThemedText style={styles.browseButtonText}>Browse Movies</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingLeft: 4,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  headerText: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.5,
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 10,
    color: 'rgba(255,255,255,0.6)',
  },
  navigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  placeholderButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  listHeader: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  favoritesCount: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    color: 'rgba(255,255,255,0.6)',
  },
  browseButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  browseButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});