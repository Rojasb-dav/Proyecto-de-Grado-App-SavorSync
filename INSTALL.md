# 🍕 Foodies - Prototipo Híbrido
## Guía de Instalación y Configuración

### 📋 Requisitos Previos

- **Node.js** 18+ 
- **PostgreSQL** 15+
- **Git**
- **Expo CLI** (para desarrollo móvil)
- **Android Studio** o **Xcode** (para emuladores)

---

## 🚀 Instalación Rápida

### 1. Clonar el Repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd Proyecto-Grado/Aplicación
```

### 2. Configurar Base de Datos
```bash
# Conectarse a PostgreSQL
psql -U postgres

# Ejecutar script de base de datos
\i docs/database-schema.sql
```

### 3. Instalar Dependencias del Backend
```bash
cd backend
npm install

# Copiar variables de entorno
cp .env.example .env

# Editar .env con tus configuraciones
nano .env
```

### 4. Instalar Dependencias del Frontend

#### Web Propietarios
```bash
cd ../web-owners
npm install
```

#### Web Administración
```bash
cd ../web-admin
npm install
```

#### Aplicación Móvil
```bash
cd ../mobile
npm install

# Instalar Expo CLI globalmente
npm install -g @expo/cli
```

---

## ⚙️ Configuración

### Variables de Entorno (Backend)
```bash
# Database
DATABASE_URL="postgresql://foodies_user:foodies_secure_password_2025@localhost:5432/foodies_prototype"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Email (opcional)
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Cloudinary (opcional)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

---

## 🏃‍♂️ Ejecutar la Aplicación

### 1. Iniciar Backend
```bash
cd backend
npm run dev
# Servidor corriendo en http://localhost:5000
```

### 2. Iniciar Web Propietarios
```bash
cd web-owners
npm run dev
# Servidor corriendo en http://localhost:3000
```

### 3. Iniciar Web Administración
```bash
cd web-admin
npm run dev
# Servidor corriendo en http://localhost:3001
```

### 4. Iniciar Aplicación Móvil
```bash
cd mobile
npm start
# Escanear código QR con Expo Go
```

---

## 📱 Acceso a las Plataformas

| Plataforma | URL | Usuario Demo | Contraseña |
|------------|-----|-------------|------------|
| **Web Propietarios** | http://localhost:3000 | owner@demo.com | demo123 |
| **Web Administración** | http://localhost:3001 | admin@demo.com | admin123 |
| **API Backend** | http://localhost:5000 | - | - |
| **App Móvil** | Expo Go | user@demo.com | demo123 |

---

## 🔧 Comandos Útiles

### Backend
```bash
npm run dev          # Iniciar desarrollo
npm run build        # Compilar TypeScript
npm run start        # Producción
npm run db:migrate   # Migrar base de datos
npm run db:seed      # Poblar datos de prueba
```

### Frontend Web
```bash
npm run dev          # Iniciar desarrollo
npm run build        # Compilar para producción
npm run preview      # Previsualizar producción
npm run lint         # Verificar código
```

### Móvil
```bash
npm start            # Iniciar Expo
npm run android      # Ejecutar en Android
npm run ios          # Ejecutar en iOS
npm run web          # Ejecutar en navegador
```

---

## 🗂️ Estructura del Proyecto

```
Aplicación/
├── backend/              # API Node.js + Express + TypeScript
│   ├── src/
│   │   ├── routes/       # Rutas API
│   │   ├── middleware/   # Middleware
│   │   ├── utils/        # Utilidades
│   │   └── index.ts      # Servidor principal
│   ├── prisma/           # Schema de base de datos
│   └── package.json
├── mobile/               # App React Native + Expo
│   ├── src/
│   │   ├── screens/      # Pantallas
│   │   ├── components/   # Componentes
│   │   ├── context/      # Context API
│   │   └── services/     # Servicios
│   └── package.json
├── web-owners/           # React + Vite para propietarios
│   ├── src/
│   │   ├── pages/        # Páginas
│   │   ├── components/   # Componentes
│   │   └── contexts/     # Contextos
│   └── package.json
├── web-admin/            # React + Vite para administración
│   ├── src/
│   │   ├── pages/        # Páginas
│   │   ├── components/   # Componentes
│   │   └── contexts/     # Contextos
│   └── package.json
└── docs/                 # Documentación
    └── database-schema.sql
```

---

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Error de conexión a base de datos**
   - Verificar que PostgreSQL esté corriendo
   - Confirmar credenciales en .env
   - Ejecutar script de base de datos

2. **Error de dependencias**
   - Eliminar node_modules y package-lock.json
   - Ejecutar `npm install` nuevamente

3. **Error en Expo**
   - Actualizar Expo CLI: `npm install -g @expo/cli@latest`
   - Limpiar caché: `expo start -c`

4. **Error de CORS**
   - Verificar configuración en backend/src/index.ts
   - Confirmar URLs permitidas

---

## 📚 Documentación Adicional

- **Manual Técnico**: `../MANUAL_TECNICO/`
- **Base de Datos**: `docs/database-schema.sql`
- **API Endpoints**: `docs/api-endpoints.md` (próximamente)

---

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama de características
3. Commit de cambios
4. Push a la rama
5. Pull Request

---

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.

---

## 📞 Soporte

Para problemas o preguntas:
- **Email**: david.rojas@example.com
- **GitHub Issues**: Crear issue en el repositorio

---

**¡Listo para usar Foodies! 🎉**
