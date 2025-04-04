import React from 'react';
import { StyleSheet, Image, TouchableOpacity, View, Platform } from 'react-native';
import { RelativePathString, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Movie } from '@/api/types';
import { getImageUrl } from '@/api/movie';
import { formatDate } from '@/utils/date';

type MovieCardProps = {
  movie: Movie;
};

export function MovieCard({ movie }: MovieCardProps) {
  const router = useRouter();
  
  const handlePress = () => {
    router.push(`/movie/${movie.id.toString()}` as RelativePathString);
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <ThemedView style={styles.card}>
        <View style={styles.imageContainer}>
          {movie.poster_path ? (
            <Image
              source={{ uri: getImageUrl(movie.poster_path, 'w342') || '' }}
              style={styles.poster}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.noImage}>
              <ThemedText>No Image</ThemedText>
            </View>
          )}
          <View style={styles.ratingContainer}>
            <ThemedView style={styles.ratingBadge}>
              <ThemedText style={styles.ratingText}>{movie.vote_average.toFixed(1)}</ThemedText>
            </ThemedView>
          </View>
        </View>
        
        <View style={styles.infoContainer}>
          <ThemedText type="defaultSemiBold" numberOfLines={2}>{movie.title}</ThemedText>
          <ThemedText style={styles.date}>{formatDate(movie.release_date)}</ThemedText>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  imageContainer: {
    position: 'relative',
  },
  poster: {
    width: '100%',
    aspectRatio: 2/3,
  },
  noImage: {
    width: '100%',
    aspectRatio: 2/3,
    backgroundColor: '#d1d1d1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  ratingBadge: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  ratingText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  infoContainer: {
    padding: 12,
    gap: 4,
  },
  date: {
    fontSize: 14,
    opacity: 0.7,
  },
});