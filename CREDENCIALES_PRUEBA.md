# 🔐 Credenciales de Prueba - Foodies

## 👤 Usuario de Prueba (Simple)

### Para Login en la App Móvil:

```
Email:    test@test.com
Password: 123456
```

## 👤 Usuario Administrador

### Para Login en la App Móvil:

```
Email:    admin@foodies.com
Username: admin
Password: admin123
```

---

## 📱 Cómo Usar:

1. **Abre la app en Expo Go**
2. **En la pantalla de Login:**
   - Campo Email: `admin@foodies.com`
   - Campo Password: `Admin123`
3. **Toca "Iniciar Sesión"**

---

## 🔄 Alternativa con Username:

Si la app permite login con username:
```
Username: Admin
Password: Admin123
```

---

## 🗄️ Información de la Base de Datos:

- **Base de datos:** foodies_prototype
- **Tabla:** users
- **Usuario creado:** ✅ Activo y verificado
- **Email verificado:** ✅ Sí
- **Estado:** ✅ Activo

---

## 🔧 Para Crear Más Usuarios:

Si necesitas crear más usuarios de prueba, usa este comando:

```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('TU_CONTRASEÑA', 10));"
```

Luego inserta en la base de datos:

```sql
INSERT INTO users (id, email, username, password, full_name, is_active, email_verified, created_at, updated_at) 
VALUES (
  gen_random_uuid(), 
  'email@ejemplo.com', 
  'username', 
  'HASH_GENERADO', 
  'Nombre Completo', 
  true, 
  true, 
  NOW(), 
  NOW()
);
```

---

## 📝 Notas:

- ✅ Usuario creado el: 11 de Noviembre de 2025
- ✅ Password hasheado con bcrypt (10 rounds)
- ✅ Email y cuenta verificados automáticamente
- ⚠️ Estas son credenciales de DESARROLLO, no usar en producción

---

**Creado por:** Cascade AI  
**Proyecto:** Foodies - Prototipo
