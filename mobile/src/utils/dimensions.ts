import { Dimensions, Platform, StatusBar } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Dimensiones base para diseño (iPhone 11 Pro)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/**
 * Escala horizontal basada en el ancho de la pantalla
 */
export const scaleWidth = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * Escala vertical basada en la altura de la pantalla
 */
export const scaleHeight = (size: number): number => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

/**
 * Escala de fuente que se adapta al tamaño de pantalla
 */
export const scaleFont = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  return Math.round(newSize);
};

/**
 * Escala moderada - útil para elementos que no deben crecer tanto
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (scaleWidth(size) - size) * factor;
};

/**
 * Obtiene la altura de la pantalla sin la barra de estado
 */
export const getScreenHeight = (): number => {
  return Platform.OS === 'android'
    ? SCREEN_HEIGHT - (StatusBar.currentHeight || 0)
    : SCREEN_HEIGHT;
};

/**
 * Verifica si es una pantalla pequeña
 */
export const isSmallScreen = (): boolean => {
  return SCREEN_WIDTH < 375;
};

/**
 * Verifica si es una pantalla grande (tablet)
 */
export const isLargeScreen = (): boolean => {
  return SCREEN_WIDTH >= 768;
};

/**
 * Obtiene el ancho de la pantalla
 */
export const getScreenWidth = (): number => {
  return SCREEN_WIDTH;
};

/**
 * Dimensiones exportadas
 */
export const dimensions = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  screenHeight: getScreenHeight(),
  isSmall: isSmallScreen(),
  isLarge: isLargeScreen(),
};

export default {
  scaleWidth,
  scaleHeight,
  scaleFont,
  moderateScale,
  getScreenHeight,
  getScreenWidth,
  isSmallScreen,
  isLargeScreen,
  dimensions,
};
