# 📍 Sistema de Ubicación Implementado

## ✅ **¿Qué se implementó?**

### **1. Servicio de Ubicación**
- ✅ Archivo `src/services/locationService.ts` creado
- ✅ Solicitud automática de permisos de ubicación
- ✅ Obtención de ubicación actual del usuario
- ✅ Cálculo de distancia entre dos puntos (fórmula de Haversine)
- ✅ Formateo de distancia (metros/kilómetros)
- ✅ Ordenamiento por proximidad
- ✅ Filtrado por radio

### **2. ExploreScreen Actualizado**
- ✅ Solicita permisos de ubicación al cargar
- ✅ Filtra restaurantes dentro de un radio (por defecto 5km)
- ✅ Ordena restaurantes por distancia
- ✅ Muestra distancia en cada tarjeta (ej: "1.2 km", "500 m")
- ✅ Indicador visual de ubicación activa
- ✅ Mapa centrado en ubicación del usuario

---

## 🎯 **Cómo Funciona**

### **Al Abrir la App:**

1. **Solicitud de Permisos:**
   - Expo Go pide permiso de ubicación automáticamente
   - Usuario debe aceptar "Permitir mientras se usa la app"

2. **Obtención de Ubicación:**
   - Se obtiene latitud y longitud del usuario
   - Se muestra en consola: `✅ Ubicación obtenida: { latitude: X, longitude: Y }`

3. **Filtrado Inteligente:**
   - Solo muestra restaurantes dentro de 5km
   - Los ordena del más cercano al más lejano
   - Muestra la distancia en cada tarjeta

4. **Indicador Visual:**
   - Badge azul arriba: "Mostrando restaurantes a 5km"
   - Distancia en cada restaurante: "📍 1.2 km"

---

## 📱 **Experiencia del Usuario**

### **Vista Lista:**
```
🍔 Burger King
⭐ 4.5 • 📍 500 m
Calle 123 #45-67

🍕 Pizza Hut
⭐ 4.2 • 📍 1.2 km
Carrera 7 #12-34
```

### **Vista Mapa:**
- Mapa centrado en tu ubicación
- Markers de restaurantes cercanos
- Zoom automático para mostrar área de 5km

---

## ⚙️ **Configuración del Radio**

### **Radio por Defecto: 5km**

Para cambiar el radio de búsqueda, edita `ExploreScreen.tsx`:

```typescript
const [radiusKm, setRadiusKm] = useState<number>(5); // Cambiar aquí
```

### **Opciones Sugeridas:**
- **1 km** - Solo restaurantes muy cercanos (caminando)
- **3 km** - Distancia en bicicleta
- **5 km** - Distancia en carro corta (por defecto)
- **10 km** - Distancia en carro media
- **20 km** - Toda la ciudad

---

## 🔧 **Funciones Disponibles**

### **En `locationService.ts`:**

```typescript
// Solicitar permisos
const hasPermission = await requestLocationPermission();

// Obtener ubicación actual
const location = await getCurrentLocation();
// Retorna: { latitude: number, longitude: number } | null

// Calcular distancia entre dos puntos
const distanceKm = calculateDistance(lat1, lon1, lat2, lon2);

// Formatear distancia
const text = formatDistance(1.234); // "1.2 km"
const text2 = formatDistance(0.5);  // "500 m"

// Ordenar por distancia
const sorted = sortByDistance(restaurants, userLocation);

// Filtrar por radio
const nearby = filterByRadius(restaurants, userLocation, 5);
```

---

## 📊 **Logs de Debug**

### **En la Consola Verás:**

```
📍 Solicitando ubicación del usuario...
✅ Ubicación obtenida: { latitude: 4.6097, longitude: -74.0817 }
📍 Mostrando 127 restaurantes dentro de 5km
```

### **Si Falla:**

```
❌ No se pudo obtener la ubicación
```

Y se muestra un Alert al usuario.

---

## 🎨 **Personalización**

### **Cambiar Mensaje del Indicador:**

En `ExploreScreen.tsx`:

```typescript
<Text style={styles.locationText}>
  Mostrando restaurantes a {radiusKm}km  // Cambiar aquí
</Text>
```

### **Cambiar Icono de Distancia:**

```typescript
<Text style={styles.restaurantDistance}>
  📍 {restaurant.distanceText}  // Cambiar emoji
</Text>
```

---

## 🚀 **Próximas Mejoras Sugeridas**

### **1. Control de Radio Dinámico:**
- Slider para cambiar el radio (1-20km)
- Botones: "Cerca", "Media", "Lejos"

### **2. Filtros Avanzados:**
- "Solo abiertos ahora"
- "Con delivery"
- "Mejor valorados"

### **3. Navegación:**
- Botón "Cómo llegar" en cada restaurante
- Integración con Google Maps / Waze

### **4. Actualización Automática:**
- Actualizar ubicación cada X minutos
- Notificar cuando entres en radio de favoritos

---

## ⚠️ **Importante**

### **Permisos de Ubicación:**

**Android:**
- Ya configurado en `app.json`
- Permisos: `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`

**iOS:**
- Necesita configuración adicional en `Info.plist` para producción
- Expo Go ya tiene permisos configurados

### **Precisión:**

- **Accuracy.Balanced** - Balance entre precisión y batería
- Para mayor precisión: cambiar a `Accuracy.High`
- Para ahorrar batería: cambiar a `Accuracy.Low`

En `locationService.ts`:

```typescript
const location = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.High, // Cambiar aquí
});
```

---

## 🧪 **Cómo Probar**

### **1. En Expo Go:**

1. Abre la app
2. Ve a "Explorar"
3. Acepta permisos de ubicación
4. Verás el badge: "Mostrando restaurantes a 5km"
5. Los restaurantes más cercanos aparecen primero
6. Cada uno muestra su distancia

### **2. Simulando Ubicación:**

**En Android Studio Emulator:**
- Extended Controls → Location
- Ingresar coordenadas manualmente

**En iOS Simulator:**
- Debug → Location → Custom Location
- Ingresar coordenadas de Bogotá: 4.6097, -74.0817

### **3. Verificar en Consola:**

Busca estos logs:
```
📍 Solicitando ubicación del usuario...
✅ Ubicación obtenida: ...
📍 Mostrando X restaurantes dentro de 5km
```

---

## 🎯 **Resultado Final**

### **Antes:**
- ❌ Mostraba todos los 4,077 restaurantes de Bogotá
- ❌ Sin orden específico
- ❌ No sabías cuáles estaban cerca

### **Ahora:**
- ✅ Muestra solo restaurantes cercanos (5km)
- ✅ Ordenados del más cercano al más lejano
- ✅ Distancia visible en cada tarjeta
- ✅ Mapa centrado en tu ubicación
- ✅ Indicador visual de radio activo

---

## 📝 **Notas Técnicas**

### **Fórmula de Haversine:**

Calcula la distancia entre dos puntos en una esfera (la Tierra):

```typescript
const R = 6371; // Radio de la Tierra en km
const dLat = toRad(lat2 - lat1);
const dLon = toRad(lon2 - lon1);

const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);

const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
const distance = R * c;
```

### **Rendimiento:**

- Cálculo de distancia: O(n) donde n = número de restaurantes
- Ordenamiento: O(n log n)
- Filtrado: O(n)

**Total:** O(n log n) - Muy eficiente incluso con miles de restaurantes

---

**¡Sistema de ubicación completamente funcional!** 🎉
