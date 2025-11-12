import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Searchbar, Card, Text, Chip, Avatar, Button, ActivityIndicator } from 'react-native-paper';
import { theme } from '../theme/theme';
import { API_BASE_URL } from '../config/api';
import axios from 'axios';

interface Restaurant {
  id: string;
  name: string;
  category: string;
  address: string;
  ratingAverage: number;
  totalReviews: number;
  priceRange: number;
  imageUrl?: string;
}

const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'italian', name: 'Italiana' },
    { id: 'mexican', name: 'Mexicana' },
    { id: 'chinese', name: 'China' },
    { id: 'japanese', name: 'Japonesa' },
  ];

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/restaurants`, {
        params: {
          page: 1,
          limit: 50
        }
      });
      setRestaurants(response.data.restaurants || []);
    } catch (error) {
      console.error('Error loading restaurants:', error);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const renderPriceRange = (range: number) => {
    return '$'.repeat(range);
  };

  const renderRating = (rating: number) => {
    return '⭐'.repeat(Math.floor(rating));
  };

  const renderRestaurant = ({ item }: { item: Restaurant }) => (
    <Card style={styles.restaurantCard}>
      <TouchableOpacity style={styles.cardContent}>
        <View style={styles.restaurantHeader}>
          <Avatar.Image
            size={60}
            source={{ uri: item.imageUrl }}
            style={styles.restaurantAvatar}
          />
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{item.name}</Text>
            <Text style={styles.restaurantCategory}>{item.category}</Text>
            <Text style={styles.restaurantAddress}>{item.address}</Text>
          </View>
        </View>
        
        <View style={styles.restaurantStats}>
          <View style={styles.statItem}>
            <Text style={styles.rating}>{renderRating(item.ratingAverage)}</Text>
            <Text style={styles.ratingText}>{item.ratingAverage}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.priceRange}>{renderPriceRange(item.priceRange)}</Text>
            <Text style={styles.reviewsText}>({item.totalReviews})</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buscar Restaurantes</Text>
      </View>

      <Searchbar
        placeholder="Buscar por nombre o categoría..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <View style={styles.categoriesContainer}>
        <Text style={styles.categoriesTitle}>Categorías</Text>
        <View style={styles.chipsContainer}>
          {categories.map((category) => (
            <Chip
              key={category.id}
              selected={selectedCategory === category.id}
              onPress={() => setSelectedCategory(category.id)}
              style={styles.categoryChip}
            >
              {category.name}
            </Chip>
          ))}
        </View>
      </View>

        <Searchbar
          placeholder="Buscar por nombre o categoría..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        <View style={styles.categoriesContainer}>
          <Text style={styles.categoriesTitle}>Categorías</Text>
          <View style={styles.chipsContainer}>
            {categories.map((category) => (
              <Chip
                key={category.id}
                selected={selectedCategory === category.id}
                onPress={() => setSelectedCategory(category.id)}
                style={styles.categoryChip}
              >
                {category.name}
              </Chip>
            ))}
          </View>
        </View>

      <FlatList
        data={restaurants}
        renderItem={renderRestaurant}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.restaurantsList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  searchBar: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  restaurantsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  restaurantCard: {
    marginBottom: 16,
    elevation: 2,
  },
  cardContent: {
    padding: 16,
  },
  restaurantHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  restaurantAvatar: {
    marginRight: 12,
  },
  restaurantInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  restaurantCategory: {
    fontSize: 14,
    color: theme.colors.primary,
    marginBottom: 2,
  },
  restaurantAddress: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  restaurantStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  priceRange: {
    fontSize: 16,
    color: theme.colors.primary,
    marginRight: 4,
  },
  reviewsText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});

export default SearchScreen;
