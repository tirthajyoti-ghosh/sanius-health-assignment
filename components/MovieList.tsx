import React from 'react';
import { FlatList, RefreshControl, StyleSheet, ActivityIndicator, View } from 'react-native';
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
        <ThemedText type="subtitle">Error</ThemedText>
        <ThemedText>{error}</ThemedText>
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
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={
        isLoading && !refreshing ? (
          <View style={styles.footer}>
            <ActivityIndicator size="small" color="#0a7ea4" />
          </View>
        ) : null
      }
      ListEmptyComponent={
        !isLoading ? (
          <ThemedView style={styles.centerContainer}>
            <ThemedText>No movies found</ThemedText>
          </ThemedView>
        ) : (
          <ThemedView style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#0a7ea4" />
          </ThemedView>
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  flatListContent: {
    padding: 8,
    paddingBottom: 100,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
});