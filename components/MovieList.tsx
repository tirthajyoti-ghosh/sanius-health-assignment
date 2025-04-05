import React from 'react';
import { FlatList, RefreshControl, StyleSheet, ActivityIndicator, View, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MovieCard } from '@/components/MovieCard';
import { Movie } from '@/api/types';

interface MovieListProps {
  movies: Movie[];
  isLoading: boolean;
  onRefresh: () => Promise<void>;
  onEndReached: () => void;
  error: string | null;
  ListHeaderComponent?: React.ReactElement;
}

export function MovieList({
  movies,
  isLoading,
  onRefresh,
  onEndReached,
  error,
  ListHeaderComponent,
}: MovieListProps) {
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={60} color="#ff6b6b" />
        <ThemedText type="subtitle" style={styles.errorTitle}>Error</ThemedText>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <FlatList
      data={movies}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <MovieCard movie={item} />}
      numColumns={2}
      contentContainerStyle={styles.flatListContent}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={handleRefresh}
          tintColor="#ff6b6b" 
          colors={["#ff6b6b"]}
        />
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={
        isLoading && !refreshing ? (
          <View style={styles.footer}>
            <ActivityIndicator size="large" color="#ff6b6b" />
          </View>
        ) : null
      }
      ListEmptyComponent={
        !isLoading ? (
          <ThemedView style={styles.emptyContainer}>
            <Ionicons name="film-outline" size={80} color="#aaa" />
            <ThemedText style={styles.emptyText}>No movies found</ThemedText>
          </ThemedView>
        ) : (
          <ThemedView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff6b6b" />
            <ThemedText style={styles.loadingText}>Loading movies...</ThemedText>
          </ThemedView>
        )
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  flatListContent: {
    padding: 12,
    paddingBottom: 100,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    height: 400,
  },
  emptyText: {
    fontSize: 18,
    opacity: 0.7,
    marginTop: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    height: 400,
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 16,
  },
  errorTitle: {
    fontSize: 24,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
    maxWidth: width * 0.8,
  },
});
