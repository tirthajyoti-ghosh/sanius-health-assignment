import React from 'react';
import { StyleSheet, Image, TouchableOpacity, View, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Movie } from '@/api/types';
import { getImageUrl } from '@/api/movie';
import { formatDate } from '@/utils/date';
import { useFavorites } from '@/context/FavoritesContext';


type MovieCardProps = {
  movie: Movie;
};

export function MovieCard({ movie }: MovieCardProps) {
  const router = useRouter();
  const { isFavorite } = useFavorites();
  const isFav = isFavorite(movie.id);

  const handlePress = () => {
    router.push(`/movie/${movie.id.toString()}`);
  };

  return (
    <TouchableOpacity 
      testID="movie-card"
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <ThemedView testID='themed-view' style={styles.card}>
        <View style={styles.imageContainer}>
          {movie.poster_path ? (
            <Image
              testID="movie-poster"
              source={{ uri: getImageUrl(movie.poster_path, 'w342') || '' }}
              style={styles.poster}
              resizeMode="cover"
            />
          ) : (
            <View testID="no-image-placeholder" style={styles.noImage}>
              <Ionicons name="image-outline" size={50} color="#555" />
            </View>
          )}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
          <View style={styles.ratingContainer}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <ThemedText testID='themed-text' style={styles.ratingText}>{movie.vote_average.toFixed(1)}</ThemedText>
            </View>
          </View>
          
          {isFav && (
            <View testID="favorite-indicator" style={styles.favoriteIndicator}>
              <Ionicons name="heart" size={16} color="#fff" />
            </View>
          )}
        </View>
        
        <View style={styles.infoContainer}>
          <View style={styles.titleContainer}>
            <ThemedText testID='themed-text' numberOfLines={2} style={styles.title}>
              {movie.title}
            </ThemedText>
          </View>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={12} color="rgba(255,255,255,0.7)" />
            <ThemedText testID='themed-text' style={styles.date}>{formatDate(movie.release_date)}</ThemedText>
          </View>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 48 = padding (12) * 2 + margin between cards (12) * 2

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 6,
    maxWidth: cardWidth,
    height: cardWidth * 1.75, // Fixed height based on card width
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(20,20,30,0.9)',
    height: '100%', // Fill the container height
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  imageContainer: {
    height: '70%', // Fixed proportion for the image
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  noImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2a2a3a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 107, 107, 0.8)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  ratingBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 4,
  },
  infoContainer: {
    padding: 12,
    height: '30%', // Fixed proportion for the info section
    backgroundColor: '#1a1a25',
    justifyContent: 'space-between',
  },
  titleContainer: {
    height: 42, // Fixed height for title (accommodates 2 lines)
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  date: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
});
