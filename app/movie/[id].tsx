import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import {
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  View,
  Platform,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useMovies } from '@/context/MovieContext';
import { getImageUrl } from '@/api/movie';
import { formatDate } from '@/utils/date';
import { Movie } from '@/api/types';
import { StatusBar } from 'expo-status-bar';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getMovie, fetchMovieDetails } = useMovies();
  const [movie, setMovie] = useState<Movie | undefined>(getMovie(Number(id)));
  const [isLoading, setIsLoading] = useState(!movie);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadMovie() {
      if (!movie) {
        try {
          setIsLoading(true);
          const movieData = await fetchMovieDetails(Number(id));
          setMovie(movieData);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load movie details');
        } finally {
          setIsLoading(false);
        }
      }
    }
    
    loadMovie();
  }, [id]);

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </ThemedView>
    );
  }

  if (error || !movie) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText type="subtitle">Error</ThemedText>
        <ThemedText>{error || 'Movie not found'}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack.Screen
        options={{
          title: movie.title,
          headerTransparent: true,
          headerBackTitle: 'Back',
          headerTintColor: '#fff',
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Backdrop Image */}
        <View style={styles.backdropContainer}>
          <Image
            source={{
              uri: getImageUrl(movie.backdrop_path || movie.poster_path, 'w780') || ''
            }}
            style={styles.backdropImage}
            resizeMode="cover"
          />
          <View style={styles.backdropGradient} />
        </View>
        
        <ThemedView style={styles.contentSection}>
          <View style={styles.posterAndInfo}>
            <View style={styles.posterContainer}>
              <Image
                source={{ uri: getImageUrl(movie.poster_path, 'w342') || '' }}
                style={styles.posterImage}
                resizeMode="cover"
              />
            </View>
            
            <View style={styles.infoContainer}>
              <ThemedText type="title" style={styles.title}>
                {movie.title}
              </ThemedText>
              
              <View style={styles.ratingAndDate}>
                <ThemedView style={styles.ratingBadge}>
                  <ThemedText style={styles.ratingText}>
                    {movie.vote_average.toFixed(1)}
                  </ThemedText>
                </ThemedView>
                <ThemedText>{formatDate(movie.release_date)}</ThemedText>
              </View>
            </View>
          </View>
          
          <ThemedView style={styles.overviewContainer}>
            <ThemedText type="subtitle">Overview</ThemedText>
            <ThemedText style={styles.overview}>
              {movie.overview || 'No overview available'}
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.additionalInfo}>
            <ThemedText type="defaultSemiBold">Original Title:</ThemedText>
            <ThemedText>{movie.original_title}</ThemedText>
            
            <ThemedText type="defaultSemiBold" style={styles.infoLabel}>
              Original Language:
            </ThemedText>
            <ThemedText>
              {movie.original_language.toUpperCase()}
            </ThemedText>
            
            <ThemedText type="defaultSemiBold" style={styles.infoLabel}>
              Popularity:
            </ThemedText>
            <ThemedText>{movie.popularity.toFixed(1)}</ThemedText>
            
            <ThemedText type="defaultSemiBold" style={styles.infoLabel}>
              Vote Count:
            </ThemedText>
            <ThemedText>{movie.vote_count.toLocaleString()}</ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </>
  );
}

const { width } = Dimensions.get('window');
const posterWidth = width * 0.3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backdropContainer: {
    height: 250,
    position: 'relative',
  },
  backdropImage: {
    width: '100%',
    height: '100%',
  },
  backdropGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundGradient: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  contentSection: {
    marginTop: -40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  posterAndInfo: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  posterContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  posterImage: {
    width: posterWidth,
    height: posterWidth * 1.5,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  ratingAndDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  overviewContainer: {
    marginBottom: 20,
  },
  overview: {
    marginTop: 8,
    lineHeight: 22,
  },
  additionalInfo: {
    padding: 16,
    borderRadius: 8,
    gap: 4,
  },
  infoLabel: {
    marginTop: 12,
  },
});