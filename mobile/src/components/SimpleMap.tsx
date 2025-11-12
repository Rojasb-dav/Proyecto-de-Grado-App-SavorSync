import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface Restaurant {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  address: string;
}

interface SimpleMapProps {
  restaurants: Restaurant[];
  onMarkerPress?: (restaurant: Restaurant) => void;
}

const SimpleMap: React.FC<SimpleMapProps> = ({ restaurants, onMarkerPress }) => {
  console.log('🗺️ SimpleMap - Restaurantes recibidos:', restaurants.length);
  
  // Validar que haya restaurantes
  if (restaurants.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No hay restaurantes para mostrar</Text>
      </View>
    );
  }

  // Tomar el primer restaurante para centrar el mapa
  const firstRestaurant = restaurants[0];
  console.log('📍 Primer restaurante:', firstRestaurant.name, firstRestaurant.latitude, firstRestaurant.longitude);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: firstRestaurant.latitude,
          longitude: firstRestaurant.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {restaurants.map((restaurant, index) => {
          const lat = Number(restaurant.latitude);
          const lng = Number(restaurant.longitude);
          
          // Validar coordenadas
          if (isNaN(lat) || isNaN(lng)) {
            console.warn(`⚠️ Coordenadas inválidas para ${restaurant.name}`);
            return null;
          }

          return (
            <Marker
              key={restaurant.id}
              coordinate={{ latitude: lat, longitude: lng }}
              title={restaurant.name}
              description={restaurant.address}
              onPress={() => onMarkerPress && onMarkerPress(restaurant)}
            />
          );
        })}
      </MapView>
      
      {/* Contador */}
      <View style={styles.counter}>
        <Text style={styles.counterText}>{restaurants.length} restaurantes</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  counter: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  counterText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SimpleMap;
