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
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
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
  const scrollY = new Animated.Value(0);
  
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
        <ActivityIndicator size="large" color="#ff6b6b" />
        <ThemedText style={styles.loadingText}>Loading movie details...</ThemedText>
      </ThemedView>
    );
  }

  if (error || !movie) {
    return (
      <ThemedView style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={60} color="#ff6b6b" />
        <ThemedText type="subtitle" style={styles.errorTitle}>Error</ThemedText>
        <ThemedText style={styles.errorText}>{error || 'Movie not found'}</ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={() => setError(null)}>
          <ThemedText style={styles.retryText}>Try Again</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100, 150],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

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
      
      <Animated.ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero section with backdrop */}
        <View style={styles.backdropContainer}>
          <Image
            source={{
              uri: getImageUrl(movie.backdrop_path || movie.poster_path, 'w780') || ''
            }}
            style={styles.backdropImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.9)']}
            style={styles.backdropGradient}
          />
        </View>
        
        <ThemedView style={styles.contentSection}>
          {/* Poster and basic info */}
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
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <ThemedText style={styles.ratingText}>
                    {movie.vote_average.toFixed(1)}
                  </ThemedText>
                </View>
                <ThemedText style={styles.dateText}>{formatDate(movie.release_date)}</ThemedText>
              </View>
              
              <View style={styles.genrePills}>
                {/* Assuming you have genre data - if not, you can remove this */}
                <View style={styles.genrePill}>
                  <ThemedText style={styles.genreText}>Action</ThemedText>
                </View>
                <View style={styles.genrePill}>
                  <ThemedText style={styles.genreText}>Drama</ThemedText>
                </View>
              </View>
            </View>
          </View>
          
          {/* Action buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="play-circle" size={22} color="#fff" />
              <ThemedText style={styles.actionButtonText}>Trailer</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="heart-outline" size={22} color="#fff" />
              <ThemedText style={styles.actionButtonText}>Favorite</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-social-outline" size={22} color="#fff" />
              <ThemedText style={styles.actionButtonText}>Share</ThemedText>
            </TouchableOpacity>
          </View>
          
          {/* Overview section */}
          <ThemedView style={styles.overviewContainer}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Overview</ThemedText>
            <ThemedText style={styles.overview}>
              {movie.overview || 'No overview available'}
            </ThemedText>
          </ThemedView>
          
          {/* Additional info in cards */}
          <ThemedText type="subtitle" style={styles.sectionTitle}>Movie Details</ThemedText>
          <ThemedView style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <ThemedText type="defaultSemiBold" style={styles.detailLabel}>
                Original Title
              </ThemedText>
              <ThemedText style={styles.detailValue}>{movie.original_title}</ThemedText>
            </View>
            
            <View style={styles.separator} />
            
            <View style={styles.detailRow}>
              <ThemedText type="defaultSemiBold" style={styles.detailLabel}>
                Language
              </ThemedText>
              <View style={styles.languageBadge}>
                <ThemedText style={styles.languageText}>
                  {movie.original_language.toUpperCase()}
                </ThemedText>
              </View>
            </View>
            
            <View style={styles.separator} />
            
            <View style={styles.detailRow}>
              <ThemedText type="defaultSemiBold" style={styles.detailLabel}>
                Popularity
              </ThemedText>
              <ThemedText style={styles.detailValue}>
                <Ionicons name="trending-up" size={16} color="#4CD964" /> {movie.popularity.toFixed(1)}
              </ThemedText>
            </View>
            
            <View style={styles.separator} />
            
            <View style={styles.detailRow}>
              <ThemedText type="defaultSemiBold" style={styles.detailLabel}>
                Vote Count
              </ThemedText>
              <ThemedText style={styles.detailValue}>
                <Ionicons name="people" size={16} color="#5AC8FA" /> {movie.vote_count.toLocaleString()}
              </ThemedText>
            </View>
          </ThemedView>
        </ThemedView>
      </Animated.ScrollView>
    </>
  );
}

const { width, height } = Dimensions.get('window');
const posterWidth = width * 0.35;

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
    backgroundColor: '#121212',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    opacity: 0.7,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  },
  retryButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    zIndex: 1,
  },
  backdropContainer: {
    height: height * 0.5,
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
    height: 200,
  },
  contentSection: {
    marginTop: -60,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingTop: 0,
  },
  posterAndInfo: {
    flexDirection: 'row',
    marginBottom: 24,
    marginTop: -60,
  },
  posterContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
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
    paddingTop: 64,
    fontWeight: 'bold',
  },
  ratingAndDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  ratingText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
  dateText: {
    opacity: 0.7,
  },
  genrePills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genrePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  genreText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 107, 107, 0.9)',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginHorizontal: 6,
  },
  actionButtonText: {
    color: 'white',
    marginLeft: 6,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: '700',
  },
  overviewContainer: {
    marginBottom: 28,
  },
  overview: {
    lineHeight: 24,
    opacity: 0.9,
  },
  detailsCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 16,
  },
  detailValue: {
    fontSize: 16,
    opacity: 0.9,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  languageBadge: {
    backgroundColor: 'rgba(90, 200, 250, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  languageText: {
    color: '#5AC8FA',
    fontWeight: '600',
  },
});
