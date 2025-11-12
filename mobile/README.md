# 📱 Foodies Mobile App

Aplicación móvil del proyecto Foodies desarrollada con Expo y React Native.

## 🚀 Tecnologías

- **Expo SDK 51**
- **React Native**
- **TypeScript**
- **React Navigation** - Navegación
- **React Native Paper** - UI Components
- **React Query** - Estado del servidor
- **Axios** - Cliente HTTP
- **AsyncStorage** - Almacenamiento local

## 📋 Prerequisitos

- Node.js 18+
- npm o yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app en tu dispositivo móvil (iOS/Android)

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm start

# Iniciar en Android
npm run android

# Iniciar en iOS
npm run ios

# Iniciar en web
npm run web
```

## 📱 Estructura del Proyecto

```
mobile/
├── src/
│   ├── config/          # Configuración (API, constantes)
│   ├── context/         # Context API (Auth, Theme)
│   ├── screens/         # Pantallas de la app
│   ├── components/      # Componentes reutilizables
│   ├── navigation/      # Configuración de navegación
│   ├── theme/           # Tema y estilos
│   ├── types/           # Tipos TypeScript
│   └── utils/           # Utilidades y helpers
├── assets/              # Imágenes, fuentes, etc.
├── App.tsx              # Punto de entrada
├── app.json             # Configuración de Expo
└── package.json         # Dependencias
```

## 🔌 Conexión con el Backend

La app se conecta al backend en `http://localhost:5000/api`

Para conectar desde un dispositivo físico:
1. Obtén tu IP local: `ipconfig` (Windows) o `ifconfig` (Mac/Linux)
2. Actualiza `src/config/api.ts`:
   ```typescript
   export const API_BASE_URL = 'http://TU_IP:5000/api';
   ```

## 🎨 Pantallas Principales

### Autenticación
- **Login** - Inicio de sesión
- **Register** - Registro de usuarios

### Principal (Tabs)
- **Home** - Feed de publicaciones
- **Search** - Búsqueda de restaurantes
- **Create Post** - Crear nueva publicación
- **Profile** - Perfil del usuario

### Detalles
- **Restaurant Detail** - Información del restaurante
- **Post Detail** - Detalle de publicación
- **User Profile** - Perfil de otro usuario

## 🔐 Autenticación

La app usa JWT tokens almacenados en AsyncStorage:
- `authToken` - Token de acceso
- `refreshToken` - Token de refresco
- `user` - Datos del usuario

## 📦 Dependencias Principales

```json
{
  "expo": "~51.0.0",
  "react": "18.2.0",
  "react-native": "0.74.0",
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/stack": "^6.3.20",
  "@react-navigation/bottom-tabs": "^6.5.11",
  "react-native-paper": "^5.11.3",
  "@tanstack/react-query": "^5.8.4",
  "axios": "^1.6.2",
  "@react-native-async-storage/async-storage": "1.23.1"
}
```

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm run test:watch
```

## 📱 Build para Producción

### Android
```bash
# Build APK
expo build:android -t apk

# Build AAB (Google Play)
expo build:android -t app-bundle
```

### iOS
```bash
# Build para App Store
expo build:ios
```

## 🐛 Troubleshooting

### Error: Cannot connect to backend
- Verifica que el backend esté corriendo en `http://localhost:5000`
- Si usas dispositivo físico, usa tu IP local en lugar de localhost

### Error: Module not found
```bash
npm install
expo start -c  # Limpiar cache
```

### Error: Expo Go not compatible
```bash
# Actualizar Expo CLI
npm install -g expo-cli@latest

# Actualizar SDK
expo upgrade
```

## 📚 Recursos

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)

## 👥 Equipo

Proyecto de Grado - Universidad XYZ

## 📄 Licencia

Este proyecto es parte de un trabajo de grado académico.
