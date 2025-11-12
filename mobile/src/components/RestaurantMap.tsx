import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { Text } from 'react-native-paper';
import { theme } from '../theme/theme';

interface Restaurant {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  address: string;
}

interface RestaurantMapProps {
  restaurants: Restaurant[];
  onMarkerPress?: (restaurant: Restaurant) => void;
  initialRegion?: Region;
}

const RestaurantMap: React.FC<RestaurantMapProps> = ({
  restaurants,
  onMarkerPress,
  initialRegion,
}) => {
  console.log('🗺️ RestaurantMap renderizando con:', restaurants.length, 'restaurantes');
  console.log('📍 Región inicial:', initialRegion);
  
  const defaultRegion: Region = initialRegion || {
    latitude: 4.6097,
    longitude: -74.0817,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  // Función para obtener el color del marker según la categoría
  const getMarkerColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      'fast-food': 'red',
      pizza: 'orange',
      sushi: 'pink',
      japanese: 'pink',
      mexican: 'yellow',
      coffee: 'brown',
      italian: 'green',
      chinese: 'red',
      restaurant: 'blue',
    };
    return colors[category] || 'blue';
  };

  const handleMarkerPress = (restaurant: Restaurant) => {
    if (onMarkerPress) {
      onMarkerPress(restaurant);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={defaultRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {restaurants.slice(0, 50).map((restaurant) => {
          try {
            const lat = parseFloat(String(restaurant.latitude));
            const lng = parseFloat(String(restaurant.longitude));
            
            if (isNaN(lat) || isNaN(lng)) {
              return null;
            }

            return (
              <Marker
                key={restaurant.id}
                coordinate={{ latitude: lat, longitude: lng }}
                title={restaurant.name}
                description={restaurant.address}
                pinColor={getMarkerColor(restaurant.category)}
                onPress={() => onMarkerPress && onMarkerPress(restaurant)}
              />
            );
          } catch (error) {
            console.error('Error rendering marker:', error);
            return null;
          }
        })}
      </MapView>

      {/* Contador de restaurantes */}
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>
          {Math.min(restaurants.length, 50)} de {restaurants.length} restaurantes
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  counterContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
  },
});

export default RestaurantMap;
