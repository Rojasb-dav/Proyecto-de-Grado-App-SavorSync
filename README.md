# SavorSync - Red Social Gastronómica

**Proyecto de Grado - Ingeniería de Software**  
**Universidad Manuela Beltrán**

---

## Descripción

SavorSync es una plataforma social diseñada para conectar a los amantes de la buena comida con los mejores restaurantes de su ciudad. El proyecto integra tres componentes principales: una aplicación móvil para usuarios, un panel web para propietarios de restaurantes, y un sistema de administración centralizado.

La plataforma permite a los usuarios descubrir nuevos lugares, compartir sus experiencias gastronómicas mediante publicaciones con fotografías y calificaciones, seguir a otros foodies, y mantener una lista de sus restaurantes favoritos. Los propietarios pueden gestionar la información de sus establecimientos, responder a reseñas y analizar el desempeño de su negocio.

---

## Arquitectura del Sistema

El sistema está construido sobre una arquitectura híbrida que conecta tres plataformas diferentes a través de una API central:

- **Aplicación Móvil**: Desarrollada en React Native con Expo, permite a los usuarios explorar restaurantes cercanos, crear publicaciones y conectar con otros foodies
- **Panel de Propietarios**: Interfaz web construida con React y Vite, donde los dueños de restaurantes gestionan su presencia digital
- **Panel Administrativo**: Sistema web para supervisar la plataforma, moderar contenido y gestionar usuarios
- **API Central**: Backend desarrollado en Node.js con Express que centraliza toda la lógica de negocio
- **Base de Datos**: PostgreSQL con un modelo relacional de 23 tablas que soporta todas las funcionalidades

---

## Tecnologías Utilizadas

### Aplicación Móvil
- React Native y Expo para desarrollo multiplataforma
- TypeScript para tipado estático y mayor confiabilidad
- React Navigation para la navegación entre pantallas
- React Native Paper para componentes de interfaz
- Axios para comunicación con el backend
- React Query para gestión eficiente del estado del servidor

### Paneles Web
- React 18 con Vite para desarrollo ágil
- TypeScript para consistencia con el resto del proyecto
- TailwindCSS para estilos modernos y responsivos
- React Router para navegación
- React Hook Form para formularios optimizados
- Recharts para visualización de datos y estadísticas

### Backend
- Node.js con Express para la API RESTful
- TypeScript en todo el servidor
- PostgreSQL como base de datos principal
- Prisma como ORM moderno y type-safe
- JWT para autenticación segura
- bcrypt para encriptación de contraseñas
- Socket.io para notificaciones en tiempo real

---

## Funcionalidades Principales

### Para Usuarios (Foodies)
- Registro y autenticación segura en la plataforma
- Búsqueda de restaurantes por ubicación, categoría o nombre
- Visualización de perfiles detallados de restaurantes con menú, horarios y promociones
- Creación de publicaciones con fotografías y calificaciones
- Sistema de likes y comentarios en publicaciones
- Seguimiento de otros usuarios para ver sus recomendaciones
- Lista personalizada de restaurantes favoritos
- Historial de búsquedas y lugares visitados
- Notificaciones sobre actividad relevante

### Para Propietarios de Restaurantes
- Panel de control para gestionar información del establecimiento
- Administración completa del menú con precios y descripciones
- Configuración de horarios de operación
- Creación y gestión de promociones especiales
- Respuesta a reseñas y comentarios de clientes
- Visualización de estadísticas y métricas de desempeño
- Sistema de reservas configurable

### Para Administradores
- Dashboard con métricas globales del sistema
- Gestión de usuarios y restaurantes
- Moderación de contenido reportado
- Configuración de parámetros del sistema
- Generación de reportes y analíticas
- Auditoría de actividad del sistema

---

## Modelo de Datos

La base de datos está organizada en seis módulos principales:

**Core del Sistema** (4 tablas)
- Usuarios, restaurantes, publicaciones y likes

**Autenticación y Seguridad** (3 tablas)
- Sesiones activas, recuperación de contraseñas y verificación de emails

**Funcionalidades Móviles** (4 tablas)
- Seguimientos, favoritos, historial de búsquedas y ubicaciones guardadas

**Panel de Propietarios** (4 tablas)
- Menús, horarios, promociones y configuración de reservas

**Sistema Administrativo** (5 tablas)
- Administradores, configuración global, moderación, reportes y logs

**Notificaciones** (2 tablas)
- Notificaciones y cola de envío

**Multimedia** (1 tabla)
- Gestión de archivos subidos

---

## Estructura del Proyecto

```
SavorSync/
├── backend/              # API Node.js + Express + PostgreSQL
│   ├── src/
│   │   ├── middleware/   # Autenticación y validación
│   │   ├── routes/       # Endpoints de la API
│   │   ├── services/     # Lógica de negocio
│   │   └── utils/        # Utilidades y helpers
│   └── prisma/           # Schema y migraciones de BD
│
├── mobile/               # App React Native + Expo
│   ├── src/
│   │   ├── components/   # Componentes reutilizables
│   │   ├── screens/      # Pantallas de la aplicación
│   │   ├── navigation/   # Configuración de navegación
│   │   ├── services/     # Servicios y API calls
│   │   ├── context/      # Context API para estado global
│   │   └── theme/        # Estilos y tema de la app
│   └── App.tsx           # Punto de entrada
│
├── web-owners/           # Panel React + Vite para propietarios
│   └── src/
│       ├── components/   # Componentes del panel
│       ├── pages/        # Páginas del dashboard
│       └── services/     # Integración con API
│
├── web-admin/            # Panel React + Vite para administración
│   └── src/
│       ├── components/   # Componentes administrativos
│       ├── pages/        # Páginas de gestión
│       └── services/     # Servicios de administración
│
└── docs/                 # Documentación y scripts
    └── database-schema.sql
```

---

## Instalación y Configuración

### Requisitos Previos
- Node.js versión 18 o superior
- PostgreSQL versión 15 o superior
- Expo Go instalado en dispositivo móvil (para pruebas)
- Git para clonar el repositorio

### Configuración de la Base de Datos

1. Crear una base de datos PostgreSQL:
```sql
CREATE DATABASE savorsync;
```

2. Ejecutar el script de creación de tablas:
```bash
psql -U postgres -d savorsync -f docs/database-schema.sql
```

3. Configurar las variables de entorno en cada componente

### Instalación del Backend

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con las credenciales de la base de datos
npm run dev
```

El servidor estará disponible en `http://localhost:5000`

### Instalación de la App Móvil

```bash
cd mobile
npm install
npx expo start
```

Escanear el código QR con Expo Go para probar en dispositivo físico

### Instalación del Panel de Propietarios

```bash
cd web-owners
npm install
npm run dev
```

Acceder en `http://localhost:3000`

### Instalación del Panel Administrativo

```bash
cd web-admin
npm install
npm run dev
```

Acceder en `http://localhost:3001`

---

## Seguridad

El sistema implementa múltiples capas de seguridad:

- **Autenticación JWT**: Tokens seguros con expiración configurable
- **Encriptación de contraseñas**: Usando bcrypt con 12 rounds
- **Validación de datos**: En todos los endpoints de la API
- **Protección CORS**: Configurado para dominios específicos
- **Rate limiting**: Prevención de abuso de endpoints
- **Sanitización de inputs**: Protección contra inyección SQL y XSS
- **Sesiones seguras**: Gestión de sesiones por dispositivo y plataforma

---

## Estado del Proyecto

Este proyecto representa un prototipo funcional desarrollado como trabajo de grado. Incluye:

- ✅ Arquitectura completa del sistema
- ✅ Base de datos con 23 tablas interrelacionadas
- ✅ API RESTful con todos los endpoints principales
- ✅ Sistema de autenticación y autorización
- ✅ Aplicación móvil con funcionalidades core
- ✅ Estructura base de paneles web
- ✅ Integración con servicios externos (Google Maps, Cloudinary)

---

## Autores

**Santiago Antonio Buelvas Chacon**  
**David Felipe Rojas Botero**

**Universidad Manuela Beltrán**  
**Ingeniería de Software - 2025**

---

## Licencia

Este proyecto ha sido desarrollado con fines educativos como parte del trabajo de grado en Ingeniería de Software.

---

**Repositorio:** https://github.com/Rojasb-dav/Proyecto-de-Grado-App-SavorSync
