import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Avatar,
  Chip,
  IconButton,
} from 'react-native-paper';
import { theme } from '../theme/theme';

interface RestaurantDetailScreenProps {
  route: any;
  navigation: any;
}

const RestaurantDetailScreen: React.FC<RestaurantDetailScreenProps> = ({ route, navigation }) => {
  const { restaurant } = route.params || {};

  const mockRestaurant = {
    id: '1',
    name: 'Pizzería Napoli',
    category: 'Italiana',
    address: 'Calle Principal #123, Ciudad',
    phone: '+1 234 567 8900',
    email: 'info@pizzerianapoli.com',
    website: 'www.pizzerianapoli.com',
    ratingAverage: 4.5,
    totalReviews: 128,
    priceRange: 2,
    description: 'Auténtica pizza italiana con ingredientes frescos importados directamente de Italia. Nuestros chefs tienen más de 20 años de experiencia en la cocina tradicional napolitana.',
    openingHours: {
      monday: '11:00 - 23:00',
      tuesday: '11:00 - 23:00',
      wednesday: '11:00 - 23:00',
      thursday: '11:00 - 23:00',
      friday: '11:00 - 00:00',
      saturday: '11:00 - 00:00',
      sunday: '12:00 - 22:00',
    },
  };

  const restaurantData = restaurant || mockRestaurant;

  const renderPriceRange = (range: number) => {
    return '$'.repeat(range);
  };

  const renderRating = (rating: number) => {
    return '⭐'.repeat(Math.floor(rating));
  };

  const handleCallRestaurant = () => {
    console.log('Calling restaurant:', restaurantData.phone);
  };

  const handleGetDirections = () => {
    console.log('Getting directions to:', restaurantData.address);
  };

  const handleShare = () => {
    console.log('Sharing restaurant:', restaurantData.name);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Image Placeholder */}
        <Card style={styles.headerCard}>
          <Card.Content style={styles.headerContent}>
            <View style={styles.restaurantHeader}>
              <Avatar.Image
                size={80}
                source={{ uri: 'https://example.com/restaurant.jpg' }}
                style={styles.restaurantAvatar}
              />
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{restaurantData.name}</Text>
                <Chip
                  icon="store"
                  style={styles.categoryChip}
                  textStyle={styles.categoryChipText}
                >
                  {restaurantData.category}
                </Chip>
                <View style={styles.ratingContainer}>
                  <Text style={styles.rating}>{renderRating(restaurantData.ratingAverage)}</Text>
                  <Text style={styles.ratingText}>{restaurantData.ratingAverage}</Text>
                  <Text style={styles.reviewsText}>({restaurantData.totalReviews} reseñas)</Text>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceRange}>{renderPriceRange(restaurantData.priceRange)}</Text>
                  <Text style={styles.priceLabel}>Rango de precios</Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Description */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Sobre el restaurante</Text>
            <Text style={styles.description}>{restaurantData.description}</Text>
          </Card.Content>
        </Card>

        {/* Contact Information */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Información de contacto</Text>
            
            <View style={styles.contactItem}>
              <IconButton icon="map-marker" size={20} />
              <Text style={styles.contactText}>{restaurantData.address}</Text>
            </View>
            
            <View style={styles.contactItem}>
              <IconButton icon="phone" size={20} />
              <Text style={styles.contactText}>{restaurantData.phone}</Text>
            </View>
            
            <View style={styles.contactItem}>
              <IconButton icon="email" size={20} />
              <Text style={styles.contactText}>{restaurantData.email}</Text>
            </View>
            
            <View style={styles.contactItem}>
              <IconButton icon="web" size={20} />
              <Text style={styles.contactText}>{restaurantData.website}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Opening Hours */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Horario de atención</Text>
            {Object.entries(restaurantData.openingHours).map(([day, hours]) => (
              <View key={day} style={styles.hoursItem}>
                <Text style={styles.dayText}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </Text>
                <Text style={styles.hoursText}>{String(hours)}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            onPress={handleCallRestaurant}
            style={styles.actionButton}
            icon="phone"
          >
            Llamar
          </Button>
          
          <Button
            mode="outlined"
            onPress={handleGetDirections}
            style={styles.actionButton}
            icon="directions"
          >
            Cómo llegar
          </Button>
          
          <Button
            mode="text"
            onPress={handleShare}
            style={styles.actionButton}
            icon="share"
          >
            Compartir
          </Button>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Prototipo SavorSync v1.0 - Proyecto de Grado
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  headerCard: {
    margin: 16,
    elevation: 4,
  },
  headerContent: {
    padding: 20,
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  restaurantAvatar: {
    marginRight: 16,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  categoryChip: {
    backgroundColor: theme.colors.surface,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryChipText: {
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginRight: 8,
  },
  reviewsText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceRange: {
    fontSize: 16,
    color: theme.colors.primary,
    marginRight: 8,
  },
  priceLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: -8,
  },
  hoursItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  dayText: {
    fontSize: 16,
    color: theme.colors.text,
    textTransform: 'capitalize',
  },
  hoursText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.disabled,
  },
});

export default RestaurantDetailScreen;
