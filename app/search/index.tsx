import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  View, 
  TouchableOpacity, 
  StatusBar, 
  Keyboard,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useSearch } from '@/context/SearchContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MovieList } from '@/components/MovieList';
import { LinearGradient } from 'expo-linear-gradient';

export default function SearchScreen() {
  const router = useRouter();
  const { 
    searchQuery, 
    searchResults, 
    isSearching, 
    searchError,
    performSearch, 
    clearSearch, 
    loadMoreSearchResults,
    totalResults
  } = useSearch();
  
  const [inputValue, setInputValue] = useState(searchQuery);
  const [showClearButton, setShowClearButton] = useState(false);
  
  // Handle search after typing stops
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (inputValue.trim()) {
        performSearch(inputValue);
      }
    }, 500);
    
    return () => clearTimeout(debounceTimer);
  }, [inputValue]);
  
  useEffect(() => {
    setShowClearButton(!!inputValue);
  }, [inputValue]);
  
  const handleClearSearch = () => {
    setInputValue('');
    clearSearch();
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <View style={styles.searchBarContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="rgba(255,255,255,0.6)" />
            <TextInput
              style={styles.input}
              placeholder="Search movies..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={inputValue}
              onChangeText={setInputValue}
              returnKeyType="search"
              onSubmitEditing={() => performSearch(inputValue)}
              autoFocus
              selectionColor="#ff6b6b"
            />
            {showClearButton && (
              <TouchableOpacity onPress={handleClearSearch}>
                <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      
      <View style={styles.content}>
        {searchQuery ? (
          <>
            {totalResults > 0 && (
              <ThemedText style={styles.resultsCount}>
                {totalResults} results found for "{searchQuery}"
              </ThemedText>
            )}
            <MovieList
              movies={searchResults}
              isLoading={isSearching}
              onRefresh={async () => await performSearch(searchQuery)}
              onEndReached={loadMoreSearchResults}
              error={searchError}
            />
          </>
        ) : (
          <ThemedView style={styles.emptyState}>
            <Ionicons name="search" size={80} color="rgba(255,255,255,0.2)" />
            <ThemedText style={styles.emptyStateText}>
              Search for movies by title, actor, or genre
            </ThemedText>
          </ThemedView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchBar: {
    flex: 1,
    height: 46,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 23,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 46,
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingTop: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    color: 'rgba(255,255,255,0.6)',
  },
  resultsCount: {
    fontSize: 14,
    marginHorizontal: 20,
    marginBottom: 8,
    color: 'rgba(255,255,255,0.7)',
  },
});