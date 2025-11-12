import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Card,
  Button,
  Searchbar,
  Chip,
  FAB,
  Portal,
  Modal,
  List,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { API_BASE_URL } from '../config/api';
import axios from 'axios';
import WebMapView from '../components/WebMapView';
import {
  getCurrentLocation,
  sortByDistance,
  filterByRadius,
  formatDistance,
  UserLocation,
} from '../services/locationService';

interface ExploreScreenProps {
  navigation: any;
}

const ExploreScreen: React.FC<ExploreScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(5); // Radio por defecto: 5km
  const [sortByProximity, setSortByProximity] = useState(true);

  // Categorías de restaurantes
  const categories = [
    { id: 'fast-food', name: 'Comida Rápida', icon: '🍔' },
    { id: 'gourmet', name: 'Gourmet', icon: '🍽️' },
    { id: 'pizza', name: 'Pizza', icon: '🍕' },
    { id: 'sushi', name: 'Sushi', icon: '🍱' },
    { id: 'coffee', name: 'Cafetería', icon: '☕' },
    { id: 'healthy', name: 'Comida Saludable', icon: '🥗' },
  ];

  // Obtener ubicación del usuario
  const loadUserLocation = async () => {
    console.log('📍 Solicitando ubicación del usuario...');
    const location = await getCurrentLocation();
    if (location) {
      console.log('✅ Ubicación obtenida:', location);
      setUserLocation(location);
    } else {
      console.log('❌ No se pudo obtener la ubicación');
      Alert.alert(
        'Ubicación no disponible',
        'No se pudo obtener tu ubicación. Se mostrarán todos los restaurantes.',
        [{ text: 'OK' }]
      );
    }
  };

  // Cargar restaurantes desde la API
  const loadRestaurants = async () => {
    try {
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/restaurants`);
      setRestaurants(response.data.restaurants || []);
      setFilteredRestaurants(response.data.restaurants || []);
    } catch (err) {
      console.error('Error loading restaurants:', err);
      setError('No se pudieron cargar los restaurantes');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadUserLocation();
    loadRestaurants();
  }, []);

  useEffect(() => {
    // Filtrar restaurantes basado en búsqueda, categoría y ubicación
    let filtered = restaurants.filter(restaurant => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || restaurant.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Si hay ubicación del usuario, filtrar por radio y ordenar por distancia
    if (userLocation && sortByProximity) {
      // Filtrar por radio
      filtered = filterByRadius(filtered, userLocation, radiusKm);
      
      // Ordenar por distancia
      const sortedWithDistance = sortByDistance(filtered, userLocation);
      
      // Agregar la distancia a cada restaurante
      filtered = sortedWithDistance.map(r => ({
        ...r,
        distanceText: formatDistance(r.distance),
      }));
      
      console.log(`📍 Mostrando ${filtered.length} restaurantes dentro de ${radiusKm}km`);
    }

    setFilteredRestaurants(filtered);
  }, [restaurants, searchQuery, selectedCategory, userLocation, radiusKm, sortByProximity]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadRestaurants();
  };

  const handleRestaurantPress = (restaurant: any) => {
    Alert.alert(
      restaurant.name,
      `Rating: ${restaurant.rating}⭐\nDistancia: ${restaurant.distance}\n${restaurant.address}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Ver Detalles', 
          onPress: () => navigation.navigate('RestaurantDetail', { restaurantId: restaurant.id })
        },
      ]
    );
  };

  const renderRestaurantCard = (restaurant: any) => (
    <Card key={restaurant.id} style={styles.restaurantCard}>
      <TouchableOpacity onPress={() => handleRestaurantPress(restaurant)}>
        <Card.Content>
          <View style={styles.restaurantHeader}>
            <Text style={styles.restaurantImage}>{restaurant.image}</Text>
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <View style={styles.restaurantMeta}>
                {restaurant.rating && (
                  <Text style={styles.restaurantRating}>⭐ {restaurant.rating}</Text>
                )}
                {restaurant.distanceText && (
                  <>
                    <Text style={styles.metaSeparator}> • </Text>
                    <Text style={styles.restaurantDistance}>📍 {restaurant.distanceText}</Text>
                  </>
                )}
              </View>
              <Text style={styles.restaurantAddress} numberOfLines={1}>
                {restaurant.address}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.disabled} />
          </View>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header con búsqueda */}
      <View style={styles.header}>
        <View style={styles.searchRow}>
          <Searchbar
            placeholder="Buscar restaurantes..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />
          
          {/* Botones de vista y ubicación */}
          <View style={styles.viewButtons}>
            <TouchableOpacity
              style={styles.locationButton}
              onPress={loadUserLocation}
            >
              <Ionicons 
                name="locate" 
                size={20} 
                color={userLocation ? theme.colors.primary : theme.colors.disabled} 
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewButton, viewMode === 'list' && styles.activeViewButton]}
              onPress={() => setViewMode('list')}
            >
              <Ionicons 
                name="list" 
                size={20} 
                color={viewMode === 'list' ? theme.colors.primary : theme.colors.disabled} 
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewButton, viewMode === 'map' && styles.activeViewButton]}
              onPress={() => setViewMode('map')}
            >
              <Ionicons 
                name="map" 
                size={20} 
                color={viewMode === 'map' ? theme.colors.primary : theme.colors.disabled} 
              />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Indicador de ubicación - solo cuando hay ubicación */}
        {userLocation && (
          <View style={styles.locationIndicator}>
            <Ionicons name="location" size={14} color={theme.colors.primary} />
            <Text style={styles.locationText}>
              {radiusKm}km • {filteredRestaurants.length} restaurantes
            </Text>
          </View>
        )}
      </View>

      {/* Categorías */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.categoryChip, !selectedCategory && styles.activeCategory]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[styles.categoryText, !selectedCategory && styles.activeCategoryText]}>
              Todos
            </Text>
          </TouchableOpacity>
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryChip, selectedCategory === category.id && styles.activeCategory]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryText}>{category.icon}</Text>
              <Text style={[styles.categoryText, selectedCategory === category.id && styles.activeCategoryText]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Contenido principal */}
      {viewMode === 'list' ? (
        <ScrollView 
          style={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
            />
          }
        >
          {isLoading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Cargando restaurantes...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorState}>
              <Ionicons name="alert-circle-outline" size={64} color={theme.colors.error} />
              <Text style={styles.errorText}>{error}</Text>
              <Button
                mode="contained"
                onPress={handleRefresh}
                style={styles.retryButton}
              >
                Reintentar
              </Button>
            </View>
          ) : filteredRestaurants.length > 0 ? (
            filteredRestaurants.map(renderRestaurantCard)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="restaurant-outline" size={64} color={theme.colors.disabled} />
              <Text style={styles.emptyText}>No se encontraron restaurantes</Text>
              <Text style={styles.emptySubtext}>Intenta con otra búsqueda o categoría</Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styles.mapContainer}>
          {isLoading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Cargando mapa...</Text>
            </View>
          ) : (
            <>
              {console.log(`🗺️ Mostrando ${filteredRestaurants.length} restaurantes filtrados`)}
              {console.log(`📊 Total restaurantes:`, restaurants.length)}
              <WebMapView
                restaurants={(filteredRestaurants.length > 0 ? filteredRestaurants : restaurants).slice(0, 100).map(r => ({
                  id: r.id,
                  name: r.name,
                  latitude: parseFloat(String(r.latitude)),
                  longitude: parseFloat(String(r.longitude)),
                  category: r.category,
                  address: r.address,
                }))}
              />
            </>
          )}
        </View>
      )}

      {/* FAB para filtros */}
      <FAB
        icon="filter"
        style={styles.fab}
        size="small"
        onPress={() => setShowFilters(true)}
      />

      {/* Modal de filtros */}
      <Portal>
        <Modal
          visible={showFilters}
          onDismiss={() => setShowFilters(false)}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>Filtros Avanzados</Text>
          
          <List.Section>
            <List.Item
              title="Ordenar por distancia"
              left={() => <List.Icon icon="map-marker-distance" />}
            />
            <List.Item
              title="Ordenar por rating"
              left={() => <List.Icon icon="star" />}
            />
            <List.Item
              title="Abierto ahora"
              left={() => <List.Icon icon="clock" />}
            />
            <Divider />
            <List.Item
              title="Precio: $ a $$$"
              left={() => <List.Icon icon="currency-usd" />}
            />
          </List.Section>

          <Button
            mode="contained"
            onPress={() => setShowFilters(false)}
            style={styles.modalButton}
          >
            Aplicar Filtros
          </Button>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 10,
    paddingBottom: 8,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchBar: {
    flex: 1,
    elevation: 0,
  },
  viewButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  locationButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: theme.colors.background,
    marginRight: 6,
  },
  viewButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: theme.colors.background,
  },
  activeViewButton: {
    backgroundColor: theme.colors.primaryContainer,
  },
  categoriesContainer: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activeCategory: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: 11,
    color: theme.colors.text,
  },
  activeCategoryText: {
    color: theme.colors.onPrimary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  restaurantCard: {
    marginBottom: 12,
    elevation: 2,
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantImage: {
    fontSize: 32,
    marginRight: 12,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  restaurantRating: {
    fontSize: 14,
    color: theme.colors.text,
  },
  metaSeparator: {
    fontSize: 14,
    color: theme.colors.disabled,
  },
  restaurantDistance: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  restaurantAddress: {
    fontSize: 12,
    color: theme.colors.disabled,
    marginTop: 4,
  },
  locationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  locationText: {
    fontSize: 10,
    color: theme.colors.primary,
    marginLeft: 3,
    fontWeight: '600',
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.secondary,
    marginTop: 16,
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.error,
    marginTop: 16,
    textAlign: 'center',
    marginHorizontal: 32,
  },
  retryButton: {
    marginTop: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.disabled,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.disabled,
    marginTop: 8,
  },
  mapContainer: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  mapText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.disabled,
    marginTop: 16,
  },
  mapSubtext: {
    fontSize: 14,
    color: theme.colors.disabled,
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    backgroundColor: theme.colors.primary,
  },
  modal: {
    backgroundColor: theme.colors.surface,
    padding: 24,
    margin: 20,
    borderRadius: theme.roundness * 2,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  modalButton: {
    marginTop: 16,
  },
});

export default ExploreScreen;
