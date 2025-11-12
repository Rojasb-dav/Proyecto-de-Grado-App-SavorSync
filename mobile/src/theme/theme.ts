import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#FF6B35',      // Naranja SavorSync
    secondary: '#F7931E',    // Naranja secundario
    background: '#FFFFFF',   // Blanco
    surface: '#F5F5F5',      // Gris claro
    accent: '#FF8C42',       // Naranja acento
    error: '#FF5252',        // Rojo error
    text: '#212121',         // Negro texto
    textSecondary: '#757575', // Gris texto secundario
    onSurface: '#757575',    // Gris texto secundario
    disabled: '#BDBDBD',     // Gris deshabilitado
    placeholder: '#9E9E9E',  // Gris placeholder
    border: '#E0E0E0',       // Gris borde
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#FF6B35',
  },
  fonts: {
    ...MD3LightTheme.fonts,
    headlineLarge: {
      ...MD3LightTheme.fonts.headlineLarge,
      fontSize: 32,
      fontWeight: 'bold' as const,
    },
    headlineMedium: {
      ...MD3LightTheme.fonts.headlineMedium,
      fontSize: 28,
      fontWeight: 'bold' as const,
    },
    bodyLarge: {
      ...MD3LightTheme.fonts.bodyLarge,
      fontSize: 16,
    },
    bodyMedium: {
      ...MD3LightTheme.fonts.bodyMedium,
      fontSize: 14,
    },
  },
  roundness: 12,
  animation: {
    scale: 1.0,
  },
};

export const colors = {
  primary: '#FF6B35',
  secondary: '#F7931E',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  accent: '#FF8C42',
  error: '#FF5252',
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',
  text: '#212121',
  textSecondary: '#757575',
  disabled: '#BDBDBD',
  placeholder: '#9E9E9E',
  border: '#E0E0E0',
  shadow: '#000000',
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  rating: {
    filled: '#FFC107',
    unfilled: '#E0E0E0',
  },
};
