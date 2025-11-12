import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { Text } from 'react-native-paper';

interface Restaurant {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  address: string;
}

interface WebMapViewProps {
  restaurants: Restaurant[];
  onMarkerPress?: (restaurant: Restaurant) => void;
}

const WebMapView: React.FC<WebMapViewProps> = ({ restaurants }) => {
  console.log('🗺️ WebMapView - Restaurantes recibidos:', restaurants.length);
  
  if (restaurants.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No hay restaurantes para mostrar</Text>
      </View>
    );
  }

  // Calcular el centro del mapa
  const centerLat = restaurants.length > 0 ? restaurants[0].latitude : 4.6097;
  const centerLng = restaurants.length > 0 ? restaurants[0].longitude : -74.0817;

  // Crear markers en formato JSON
  const markersJson = JSON.stringify(restaurants.map(r => ({
    id: r.id,
    name: r.name,
    lat: Number(r.latitude),
    lng: Number(r.longitude),
    address: r.address,
  })));

  // HTML con Google Maps
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; }
          body, html { height: 100%; width: 100%; }
          #map { height: 100%; width: 100%; }
          .counter {
            position: absolute;
            bottom: 80px;
            left: 10px;
            background: white;
            padding: 6px 10px;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            font-size: 11px;
            font-weight: bold;
            z-index: 1000;
          }
        </style>
      </head>
      <body>
        <div class="counter">${restaurants.length} restaurantes</div>
        <div id="map"></div>
        <script>
          function initMap() {
            const center = { lat: ${centerLat}, lng: ${centerLng} };
            const map = new google.maps.Map(document.getElementById('map'), {
              zoom: 12,
              center: center,
            });

            const markers = ${markersJson};
            
            markers.forEach(marker => {
              if (!isNaN(marker.lat) && !isNaN(marker.lng)) {
                new google.maps.Marker({
                  position: { lat: marker.lat, lng: marker.lng },
                  map: map,
                  title: marker.name,
                });
              }
            });
          }
        </script>
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCjqPyYX3gYEuv_sd_lMxNBNeLFjJu5SHU&callback=initMap" async defer></script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default WebMapView;
