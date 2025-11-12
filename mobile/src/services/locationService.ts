import * as Location from 'expo-location';

export interface UserLocation {
  latitude: number;
  longitude: number;
}

/**
 * Solicita permisos de ubicación al usuario
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

/**
 * Obtiene la ubicación actual del usuario
 */
export const getCurrentLocation = async (): Promise<UserLocation | null> => {
  try {
    const hasPermission = await requestLocationPermission();
    
    if (!hasPermission) {
      console.log('Location permission denied');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    return null;
  }
};

/**
 * Calcula la distancia entre dos puntos en kilómetros (fórmula de Haversine)
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

const toRad = (value: number): number => {
  return (value * Math.PI) / 180;
};

/**
 * Formatea la distancia para mostrar
 */
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
};

/**
 * Ordena restaurantes por distancia a la ubicación del usuario
 */
export const sortByDistance = <T extends { latitude: number; longitude: number }>(
  items: T[],
  userLocation: UserLocation
): (T & { distance: number })[] => {
  return items
    .map((item) => ({
      ...item,
      distance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        item.latitude,
        item.longitude
      ),
    }))
    .sort((a, b) => a.distance - b.distance);
};

/**
 * Filtra restaurantes dentro de un radio específico (en km)
 */
export const filterByRadius = <T extends { latitude: number; longitude: number }>(
  items: T[],
  userLocation: UserLocation,
  radiusKm: number
): T[] => {
  return items.filter((item) => {
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      item.latitude,
      item.longitude
    );
    return distance <= radiusKm;
  });
};
