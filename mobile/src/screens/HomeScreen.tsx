import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Text,
  Card,
  Button,
  Searchbar,
  Chip,
  ActivityIndicator,
  Avatar,
} from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme/theme';
import { API_BASE_URL } from '../config/api';
import axios from 'axios';
import { scaleFont, scaleWidth, scaleHeight } from '../utils/dimensions';

interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  rating?: number;
  createdAt: string;
  likesCount: number;
  user: {
    id: string;
    username: string;
    fullName: string;
    avatarUrl?: string;
  };
  restaurant?: {
    id: string;
    name: string;
    category: string;
  };
}

const HomeScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { user } = useAuth();

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'italian', name: 'Italiana' },
    { id: 'mexican', name: 'Mexicana' },
    { id: 'chinese', name: 'China' },
    { id: 'japanese', name: 'Japonesa' },
  ];

  useEffect(() => {
    loadPosts();
  }, [selectedCategory]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      
      // Cargar posts desde la API
      const response = await axios.get(`${API_BASE_URL}/posts`, {
        params: {
          page: 1,
          limit: 20
        }
      });
      
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error loading posts:', error);
      // Si falla, mostrar mensaje pero no posts vacíos
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  const renderPost = ({ item }: { item: Post }) => (
    <Card style={styles.postCard}>
      <Card.Content>
        {/* User Info */}
        <View style={styles.userHeader}>
          <Avatar.Image
            size={40}
            source={{ uri: item.user.avatarUrl }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.user.fullName}</Text>
            <Text style={styles.userHandle}>@{item.user.username}</Text>
          </View>
          <Text style={styles.timestamp}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {/* Restaurant Info */}
        {item.restaurant && (
          <View style={styles.restaurantInfo}>
            <Chip
              icon="store"
              style={styles.restaurantChip}
              textStyle={styles.restaurantChipText}
            >
              {item.restaurant.name}
            </Chip>
          </View>
        )}

        {/* Content */}
        <Text style={styles.postContent}>{item.content}</Text>

        {/* Rating */}
        {item.rating && (
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Text key={star} style={styles.star}>
                {star <= item.rating! ? '⭐' : '☆'}
              </Text>
            ))}
          </View>
        )}

        {/* Actions */}
        <View style={styles.postActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>❤️ {item.likesCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>💬 Comentar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>🔄 Compartir</Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Cargando publicaciones...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SavorSync</Text>
        <Text style={styles.headerSubtitle}>¡Hola, {user?.fullName}! 👋</Text>
      </View>

      {/* Search Bar */}
      <Searchbar
        placeholder="Buscar restaurantes o posts..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
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
      </ScrollView>

      {/* Posts */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.postsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyText}>No hay publicaciones aún</Text>
            <Text style={styles.emptySubtext}>¡Sé el primero en compartir tu experiencia!</Text>
          </View>
        }
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
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  searchBar: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  categoriesContainer: {
    paddingLeft: 20,
    marginBottom: 10,
  },
  categoriesContent: {
    paddingRight: 20,
  },
  categoryChip: {
    marginRight: 8,
    height: 36,
  },
  postsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  postCard: {
    marginBottom: 16,
    elevation: 2,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  userHandle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  timestamp: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  restaurantInfo: {
    marginBottom: 12,
  },
  restaurantChip: {
    backgroundColor: theme.colors.surface,
  },
  restaurantChipText: {
    fontSize: 12,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  star: {
    fontSize: 16,
    marginRight: 2,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    paddingVertical: 8,
  },
  actionText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.secondary,
    textAlign: 'center',
  },
});

export default HomeScreen;
