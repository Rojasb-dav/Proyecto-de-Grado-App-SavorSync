import axios from 'axios';

// Coordenadas aproximadas de Bogotá
const BOGOTA_BOUNDS = {
  north: 4.80,
  south: 4.45,
  east: -74.00,
  west: -74.25
};

interface OpenStreetMapRestaurant {
  id: string;
  name: string;
  lat: number;
  lon: number;
  tags: {
    amenity: string;
    name?: string;
    cuisine?: string;
    phone?: string;
    website?: string;
    opening_hours?: string;
    addr_street?: string;
    addr_housenumber?: string;
    addr_city?: string;
  };
}

interface ProcessedRestaurant {
  id: string;
  name: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  website?: string;
  priceRange: number;
  ratingAverage: number;
  isActive: boolean;
  isVerified: boolean;
  openingHours?: any;
  tags: string[];
}

class OpenStreetMapService {
  private overpassUrl = 'https://overpass-api.de/api/interpreter';

  /**
   * Obtiene restaurantes de OpenStreetMap en Bogotá
   */
  async getRestaurantsInBogota(limit: number = 50): Promise<ProcessedRestaurant[]> {
    try {
      const query = this.buildOverpassQuery(limit);
      
      console.log('🔍 Fetching restaurants from OpenStreetMap...');
      
      const response = await axios.post(this.overpassUrl, query, {
        headers: {
          'Content-Type': 'text/plain'
        },
        timeout: 30000 // 30 segundos timeout
      });

      const restaurants = this.processOpenStreetMapData(response.data);
      console.log(`✅ Found ${restaurants.length} restaurants in Bogotá`);
      
      return restaurants;
    } catch (error) {
      console.error('❌ Error fetching from OpenStreetMap:', error);
      throw new Error('Failed to fetch restaurants from OpenStreetMap');
    }
  }

  /**
   * Construye la query para Overpass API
   */
  private buildOverpassQuery(limit: number): string {
    return `
      [out:json][timeout:25];
      (
        node["amenity"="restaurant"](${BOGOTA_BOUNDS.south},${BOGOTA_BOUNDS.west},${BOGOTA_BOUNDS.north},${BOGOTA_BOUNDS.east});
        way["amenity"="restaurant"](${BOGOTA_BOUNDS.south},${BOGOTA_BOUNDS.west},${BOGOTA_BOUNDS.north},${BOGOTA_BOUNDS.east});
      );
      out geom;
      ${limit > 0 ? `out ${limit};` : ''}
    `;
  }

  /**
   * Procesa los datos de OpenStreetMap al formato de nuestra base de datos
   */
  private processOpenStreetMapData(data: any): ProcessedRestaurant[] {
    if (!data.elements) return [];

    return data.elements
      .filter((element: any) => element.tags && element.tags.name)
      .map((element: any) => {
        const tags = element.tags;
        
        // Extraer coordenadas
        let lat = element.lat;
        let lon = element.lon;
        
        // Si es un way, calcular centroide
        if (element.type === 'way' && element.geometry) {
          const coords = element.geometry.map((g: any) => [g.lat, g.lon]);
          const center = this.calculateCenter(coords);
          lat = center.lat;
          lon = center.lon;
        }

        // Construir dirección
        const address = this.buildAddress(tags);

        // Determinar categoría basada en cuisine
        const category = this.determineCategory(tags.cuisine);

        // Extraer teléfono
        const phone = tags.phone || tags['contact:phone'];

        // Generar tags útiles
        const usefulTags = this.generateUsefulTags(tags);

        return {
          id: `osm_${element.id}`,
          name: tags.name || 'Restaurant',
          category,
          address,
          latitude: lat,
          longitude: lon,
          phone,
          website: tags.website || tags['contact:website'],
          priceRange: this.estimatePriceRange(tags.cuisine),
          ratingAverage: 0, // OpenStreetMap no tiene ratings
          isActive: true,
          isVerified: false, // No verificados por nosotros
          openingHours: tags.opening_hours ? this.parseOpeningHours(tags.opening_hours) : undefined,
          tags: usefulTags
        };
      })
      .filter((restaurant: ProcessedRestaurant) => 
        restaurant.name && 
        restaurant.latitude && 
        restaurant.longitude &&
        restaurant.address !== 'Unknown Address'
      );
  }

  /**
   * Construye una dirección a partir de los tags de OSM
   */
  private buildAddress(tags: any): string {
    const parts = [];
    
    if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
    if (tags['addr:street']) parts.push(tags['addr:street']);
    if (tags['addr:city']) parts.push(tags['addr:city']);
    else parts.push('Bogotá');
    
    return parts.length > 0 ? parts.join(', ') : 'Unknown Address';
  }

  /**
   * Determina la categoría basada en el tipo de cocina
   */
  private determineCategory(cuisine?: string): string {
    if (!cuisine) return 'restaurant';
    
    const cuisineLower = cuisine.toLowerCase();
    
    if (cuisineLower.includes('pizza')) return 'pizza';
    if (cuisineLower.includes('burger') || cuisineLower.includes('hamburger')) return 'fast-food';
    if (cuisineLower.includes('sushi') || cuisineLower.includes('japanese')) return 'japanese';
    if (cuisineLower.includes('mexican') || cuisineLower.includes('taco')) return 'mexican';
    if (cuisineLower.includes('coffee') || cuisineLower.includes('cafe')) return 'coffee';
    if (cuisineLower.includes('italian') || cuisineLower.includes('pasta')) return 'italian';
    if (cuisineLower.includes('chinese')) return 'chinese';
    if (cuisineLower.includes('indian')) return 'indian';
    if (cuisineLower.includes('thai')) return 'thai';
    if (cuisineLower.includes('vegetarian') || cuisineLower.includes('vegan')) return 'vegetarian';
    
    return 'restaurant';
  }

  /**
   * Estima el rango de precio basado en el tipo de cocina
   */
  private estimatePriceRange(cuisine?: string): number {
    if (!cuisine) return 2;
    
    const cuisineLower = cuisine.toLowerCase();
    
    if (cuisineLower.includes('pizza') || cuisineLower.includes('burger')) return 2;
    if (cuisineLower.includes('sushi') || cuisineLower.includes('japanese')) return 4;
    if (cuisineLower.includes('coffee') || cuisineLower.includes('cafe')) return 1;
    if (cuisineLower.includes('italian') || cuisineLower.includes('french')) return 4;
    if (cuisineLower.includes('mexican') || cuisineLower.includes('thai')) return 2;
    
    return 3;
  }

  /**
   * Genera tags útiles para búsqueda
   */
  private generateUsefulTags(tags: any): string[] {
    const usefulTags: string[] = [];
    
    if (tags.cuisine) {
      usefulTags.push(tags.cuisine.toLowerCase());
    }
    
    if (tags.outdoor_seating) usefulTags.push('outdoor');
    if (tags.delivery) usefulTags.push('delivery');
    if (tags.takeaway) usefulTags.push('takeaway');
    if (tags.wifi) usefulTags.push('wifi');
    if (tags.air_conditioning) usefulTags.push('ac');
    
    return usefulTags;
  }

  /**
   * Calcula el centroide de un polígono
   */
  private calculateCenter(coords: number[][]): { lat: number; lon: number } {
    const sumLat = coords.reduce((sum, coord) => sum + coord[0], 0);
    const sumLon = coords.reduce((sum, coord) => sum + coord[1], 0);
    
    return {
      lat: sumLat / coords.length,
      lon: sumLon / coords.length
    };
  }

  /**
   * Parsea opening_hours de OSM a nuestro formato
   */
  private parseOpeningHours(openingHours: string): any {
    // Simplificado - podríamos implementar un parser más completo
    return {
      monday: '09:00-22:00',
      tuesday: '09:00-22:00',
      wednesday: '09:00-22:00',
      thursday: '09:00-22:00',
      friday: '09:00-23:00',
      saturday: '09:00-23:00',
      sunday: '10:00-21:00'
    };
  }

  /**
   * Sincroniza restaurantes de OpenStreetMap con nuestra base de datos
   */
  async syncRestaurantsWithDatabase(): Promise<void> {
    try {
      console.log('🔄 Starting restaurant synchronization...');
      
      const osmRestaurants = await this.getRestaurantsInBogota(100);
      
      // Aquí podríamos implementar lógica para:
      // 1. Insertar nuevos restaurantes
      // 2. Actualizar existentes
      // 3. Marcar como inactivos los que ya no existen
      
      console.log(`🎯 Ready to sync ${osmRestaurants.length} restaurants`);
      
      // Por ahora, solo devolvemos los datos procesados
      // La inserción en BD la manejaremos en el endpoint correspondiente
      
    } catch (error) {
      console.error('❌ Error syncing restaurants:', error);
      throw error;
    }
  }
}

export const openStreetMapService = new OpenStreetMapService();
