# 🍕 Foodies - Prototipo Híbrido (Proyecto de Grado)

## 📋 Descripción del Proyecto

Foodies es un prototipo de aplicación híbrida para descubrir y compartir restaurantes, diseñado como proyecto de grado. La arquitectura consiste en tres plataformas principales:

- 📱 **Aplicación Móvil** (React Native + Expo) - Para foodies que descubren restaurantes
- 🌐 **Panel Web Propietarios** (React + Vite) - Para dueños de restaurantes
- 💻 **Panel Web Administración** (React + Vite) - Para administradores del sistema

## 🏗️ Arquitectura

```
📱 MÓVIL (React Native) ──┐
                          ├──🔌 API CENTRAL (Node.js + Express)──🗄️ POSTGRESQL (25 tablas)
🌐 WEB PROPIETARIOS ─────┤
                          │
💻 WEB ADMIN ────────────┘
```

## 🗄️ Base de Datos

- **PostgreSQL 15+** con 25 tablas realistas
- **Modelo relacional completo** para arquitectura híbrida
- **Distribución por plataforma:**
  - 🏢 Core System (4 tablas): users, restaurants, posts, likes
  - 🔐 Autenticación (3 tablas): auth_sessions, password_resets, email_verifications
  - 📱 Móvil Foodies (4 tablas): follows, user_favorites, search_history, user_locations
  - 🌐 Web Propietarios (4 tablas): restaurant_menu, restaurant_hours, restaurant_promotions, reservation_settings
  - 💻 Web Admin (5 tablas): admin_users, system_settings, content_moderation, user_reports, system_logs
  - 📢 Notificaciones (2 tablas): notifications, notification_queue
  - 📁 Multimedia (1 tabla): file_uploads

## 🛠️ Stack Tecnológico

### Frontend Móvil
- **React Native + Expo** - Desarrollo móvil rápido
- **TypeScript** - Tipado estático
- **React Navigation** - Navegación móvil
- **React Native Paper** - Componentes Material Design
- **React Query** - Manejo de datos del servidor
- **Axios** - Cliente HTTP

### Frontend Web (Propietarios + Admin)
- **React 18 + Vite** - Desarrollo web rápido
- **TypeScript** - Consistencia con móvil
- **TailwindCSS** - Framework CSS
- **React Router** - Navegación web
- **React Hook Form** - Formularios optimizados
- **Recharts** - Visualización de datos

### Backend Central
- **Node.js + Express** - API RESTful
- **TypeScript** - Consistencia total
- **PostgreSQL** - Base de datos relacional
- **Prisma** - ORM moderno
- **JWT + bcrypt** - Autenticación segura
- **Socket.io** - Notificaciones en tiempo real

## 🚀 Requerimientos Funcionales Implementados

### ✅ Login y Autenticación
- **Sistema de login seguro** con JWT
- **Múltiples roles de usuario** (foodies, propietarios, administradores)
- **Sesiones multiplataforma** con Redis
- **Recuperación de contraseña** por email
- **Verificación de email** para nuevos usuarios

### ✅ Gestión de Usuarios
- **Registro de usuarios** con validación
- **Perfiles de usuario** con información personal
- **Sistema de seguidores** entre usuarios
- **Favoritos de restaurantes**
- **Historial de búsquedas**

### ✅ Gestión de Restaurantes
- **CRUD completo** de restaurantes
- **Gestión de menús** con categorías
- **Horarios de operación** por día
- **Sistema de promociones**
- **Configuración de reservas**

### ✅ Sistema de Publicaciones
- **Posts con imágenes** y calificaciones
- **Sistema de likes** automático
- **Comentarios en publicaciones**
- **Posts destacados**
- **Moderación de contenido**

## 📁 Estructura del Proyecto

```
Aplicación/
├── backend/                 # API Central (Node.js + Express)
│   ├── src/
│   │   ├── controllers/     # Controladores de API
│   │   ├── middleware/      # Middleware de autenticación
│   │   ├── models/          # Modelos de base de datos
│   │   ├── routes/          # Rutas de la API
│   │   └── utils/           # Utilidades varias
│   ├── prisma/              # Schema y migraciones
│   └── package.json
├── mobile/                  # App Móvil (React Native + Expo)
│   ├── src/
│   │   ├── components/      # Componentes UI
│   │   ├── screens/         # Pantallas de la app
│   │   ├── navigation/      # Configuración de navegación
│   │   ├── services/        # Servicios API
│   │   └── utils/           # Utilidades varias
│   └── package.json
├── web-owners/              # Panel Web Propietarios (React + Vite)
│   ├── src/
│   │   ├── components/      # Componentes de restaurante
│   │   ├── pages/           # Páginas del panel
│   │   ├── hooks/           # Hooks personalizados
│   │   └── services/        # Servicios API
│   └── package.json
├── web-admin/               # Panel Web Admin (React + Vite)
│   ├── src/
│   │   ├── components/      # Componentes de administración
│   │   ├── pages/           # Páginas de admin
│   │   ├── hooks/           # Hooks personalizados
│   │   └── services/        # Servicios API
│   └── package.json
└── docs/                    # Documentación técnica
    └── database-schema.sql  # Script de base de datos
```

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- PostgreSQL 15+
- Expo Go (para pruebas móviles)

### Configuración de la Base de Datos
1. Crear base de datos PostgreSQL
2. Ejecutar script `docs/database-schema.sql`
3. Configurar variables de entorno

### Ejecutar el Proyecto
```bash
# Backend
cd backend
npm install
npm run dev

# App Móvil
cd mobile
npm install
npx expo start

# Panel Web Propietarios
cd web-owners
npm install
npm run dev

# Panel Web Admin
cd web-admin
npm install
npm run dev
```

## 🔐 Acceso Seguro

El repositorio implementa:
- **Autenticación JWT** para todas las plataformas
- **Roles y permisos** diferenciados
- **Sesiones seguras** con expiración
- **Validación de inputs** en todos los endpoints
- **CORS configurado** para dominios permitidos

## 📊 Estado del Prototipo

### ✅ Funcionalidades Completadas
- [x] Base de datos con 25 tablas
- [x] API RESTful centralizada
- [x] Sistema de autenticación completo
- [x] Estructura de proyecto híbrido
- [x] Configuración de desarrollo local

### 🚧 Próximos Pasos
- [ ] Implementar screens de la app móvil
- [ ] Desarrollar panel de propietarios
- [ ] Crear panel de administración
- [ ] Integrar notificaciones push
- [ ] Agregar tests unitarios

## 👥 Autores

- **David Rojas** - Desarrollo completo del prototipo
- **Proyecto de Grado** - Ingeniería de Sistemas

## 📄 Licencia

Este proyecto es desarrollado como prototipo educativo para proyecto de grado.

---

**🎓 Prototipo funcional listo para demostración técnica y evaluación académica**
