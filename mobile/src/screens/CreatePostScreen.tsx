import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Card,
  Chip,
  IconButton,
} from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme/theme';

const CreatePostScreen: React.FC = () => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const mockRestaurants = [
    { id: '1', name: 'Pizzería Napoli' },
    { id: '2', name: 'Taquería El Buen Sabor' },
    { id: '3', name: 'Sushi Paradise' },
  ];

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Por favor escribe algo sobre tu experiencia');
      return;
    }

    try {
      setIsLoading(true);
      // Simulación de envío
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        '¡Publicación creada!',
        'Tu experiencia ha sido compartida exitosamente',
        [{ text: 'OK' }]
      );
      
      // Reset form
      setContent('');
      setRating(0);
      setSelectedRestaurant('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la publicación');
    } finally {
      setIsLoading(false);
    }
  };

  const renderRatingStars = () => {
    return (
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingLabel}>Calificación:</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <IconButton
              key={star}
              icon={star <= rating ? 'star' : 'star-outline'}
              size={30}
              iconColor={star <= rating ? theme.colors.primary : theme.colors.disabled}
              onPress={() => setRating(star)}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Comparte tu Experiencia</Text>
        <Text style={styles.headerSubtitle}>Cuéntanos sobre tu visita</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          <Card.Content>
            {/* Restaurant Selection */}
            <Text style={styles.sectionTitle}>Restaurante</Text>
            <View style={styles.chipsContainer}>
              {mockRestaurants.map((restaurant) => (
                <Chip
                  key={restaurant.id}
                  selected={selectedRestaurant === restaurant.id}
                  onPress={() => setSelectedRestaurant(restaurant.id)}
                  style={styles.chip}
                >
                  {restaurant.name}
                </Chip>
              ))}
            </View>

            {/* Rating */}
            {renderRatingStars()}

            {/* Content */}
            <Text style={styles.sectionTitle}>Tu Experiencia</Text>
            <TextInput
              label="¿Qué te pareció el lugar?"
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={6}
              style={styles.contentInput}
              mode="outlined"
              placeholder="Comparte tu experiencia, la comida, el servicio, el ambiente..."
              disabled={isLoading}
            />

            {/* Submit Button */}
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.submitButton}
              contentStyle={styles.submitButtonContent}
              loading={isLoading}
              disabled={isLoading || !content.trim()}
            >
              {isLoading ? 'Publicando...' : 'Compartir Experiencia'}
            </Button>
          </Card.Content>
        </Card>

        {/* Tips */}
        <Card style={styles.tipsCard}>
          <Card.Content>
            <Text style={styles.tipsTitle}>💡 Consejos para tu publicación</Text>
            <Text style={styles.tipsText}>
              • Sé específico sobre la comida que probaste{'\n'}
              • Menciona el servicio y el ambiente{'\n'}
              • Sé honesto y respetuoso{'\n'}
              • ¡Las fotos ayudan a otros foodies!
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  ratingContainer: {
    marginBottom: 20,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  contentInput: {
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  submitButton: {
    borderRadius: theme.roundness,
  },
  submitButtonContent: {
    paddingVertical: 12,
  },
  tipsCard: {
    marginBottom: 20,
    backgroundColor: theme.colors.surface,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});

export default CreatePostScreen;
