import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Text,
  Card,
  Button,
  Avatar,
  List,
  IconButton,
  ActivityIndicator,
} from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme/theme';
import { API_BASE_URL } from '../config/api';
import axios from 'axios';

interface UserStats {
  posts: number;
  followers: number;
  following: number;
  likes: number;
}

const ProfileScreen: React.FC = () => {
  const { user, logout, token } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    posts: 0,
    followers: 0,
    following: 0,
    likes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      setLoading(true);
      // Cargar estadísticas del usuario desde la API
      const response = await axios.get(`${API_BASE_URL}/users/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Extraer contadores del response
      const userData = response.data;
      setStats({
        posts: userData._count?.posts || 0,
        followers: userData._count?.followers || 0,
        following: userData._count?.following || 0,
        likes: userData._count?.likes || 0,
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
      // Mantener valores en 0 si falla
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    {
      icon: 'account-edit',
      title: 'Editar Perfil',
      description: 'Actualiza tu información personal',
      onPress: () => console.log('Edit profile'),
    },
    {
      icon: 'heart',
      title: 'Restaurantes Favoritos',
      description: 'Tus restaurantes guardados',
      onPress: () => console.log('Favorites'),
    },
    {
      icon: 'history',
      title: 'Historial de Búsquedas',
      description: 'Tus búsquedas recientes',
      onPress: () => console.log('Search history'),
    },
    {
      icon: 'bell',
      title: 'Notificaciones',
      description: 'Configura tus preferencias',
      onPress: () => console.log('Notifications'),
    },
    {
      icon: 'shield-check',
      title: 'Privacidad y Seguridad',
      description: 'Gestiona tu privacidad',
      onPress: () => console.log('Privacy'),
    },
    {
      icon: 'help-circle',
      title: 'Ayuda y Soporte',
      description: 'Obtén ayuda cuando la necesites',
      onPress: () => console.log('Help'),
    },
  ];

  const statsArray = [
    { label: 'Publicaciones', value: stats.posts.toString() },
    { label: 'Seguidores', value: stats.followers.toString() },
    { label: 'Seguidos', value: stats.following.toString() },
    { label: 'Likes', value: stats.likes.toString() },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <View style={styles.profileHeader}>
              <Avatar.Image
                size={80}
                source={{ uri: user?.avatarUrl }}
                style={styles.avatar}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.userName}>{user?.fullName}</Text>
                <Text style={styles.userHandle}>@{user?.username}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              {loading ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                statsArray.map((stat, index) => (
                  <View key={index} style={styles.statItem}>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                ))
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Menu Items */}
        <Card style={styles.menuCard}>
          <Card.Content>
            <Text style={styles.menuTitle}>Configuración</Text>
            {menuItems.map((item, index) => (
              <List.Item
                key={index}
                title={item.title}
                description={item.description}
                left={(props) => <List.Icon {...props} icon={item.icon} />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={item.onPress}
                style={styles.menuItem}
              />
            ))}
          </Card.Content>
        </Card>

        {/* Logout Button */}
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor={theme.colors.error}
        >
          Cerrar Sesión
        </Button>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>SavorSync v1.0.0</Text>
          <Text style={styles.appDescription}>
            Prototipo para proyecto de grado
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileCard: {
    marginBottom: 20,
    elevation: 4,
  },
  profileContent: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  menuCard: {
    marginBottom: 20,
    elevation: 2,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  menuItem: {
    paddingHorizontal: 0,
  },
  logoutButton: {
    marginBottom: 20,
    borderColor: theme.colors.error,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  appVersion: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  appDescription: {
    fontSize: 12,
    color: theme.colors.disabled,
  },
});

export default ProfileScreen;
