# Backend - Sistema de Gestión Interna

Backend API desarrollado con Express, Prisma y PostgreSQL para el sistema de gestión interna de Excelia.

## 🚀 Tecnologías

- **Node.js** con **TypeScript**
- **Express** - Framework web
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Hash de contraseñas

## 📋 Requisitos Previos

- Node.js 18+ 
- PostgreSQL 12+
- npm o yarn

## 🔧 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales de PostgreSQL:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/excelia_db?schema=public"
JWT_SECRET="tu-secret-key-segura"
PORT=3001
NODE_ENV=development
```

3. Crear la base de datos:
```bash
createdb excelia_db
```

4. Generar el cliente de Prisma:
```bash
npm run prisma:generate
```

5. Ejecutar migraciones:
```bash
npm run prisma:migrate
```

6. Poblar la base de datos con datos iniciales:
```bash
npm run prisma:seed
```

## 🏃 Ejecución

### Desarrollo
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3001`

### Producción
```bash
npm run build
npm start
```

## 📚 Estructura del Proyecto

```
backend/
├── prisma/
│   ├── schema.prisma      # Schema de la base de datos
│   └── seed.ts            # Datos iniciales
├── src/
│   ├── controllers/       # Controladores de endpoints
│   ├── routes/            # Definición de rutas
│   ├── middleware/        # Middleware (auth, etc.)
│   ├── utils/            # Utilidades
│   ├── app.ts            # Configuración de Express
│   └── server.ts         # Punto de entrada
├── .env.example          # Ejemplo de variables de entorno
├── package.json
└── tsconfig.json
```

## 🔐 Autenticación

Todos los endpoints (excepto `/api/auth/login`) requieren autenticación mediante JWT.

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "director@excelia.com",
  "password": "password123"
}
```

Respuesta incluye un token JWT que debe enviarse en el header:
```
Authorization: Bearer <token>
```

### Usuarios por defecto

Todos los usuarios tienen la contraseña: `password123`

- **Director**: `director@excelia.com`
- **Managers**: `manager.es@excelia.com`, `manager.latam@excelia.com`, etc.
- **Employees**: `juan.perez@excelia.com`, `maria.garcia@excelia.com`, etc.

## 📡 Endpoints Principales

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Usuario actual

### Oficinas
- `GET /api/offices` - Listar oficinas
- `GET /api/offices/:id` - Obtener oficina
- `GET /api/users/:userId/offices` - Oficinas de usuario
- `POST /api/offices` - Crear oficina (solo DIRECTOR)
- `PUT /api/offices/:id` - Actualizar oficina (solo DIRECTOR)

### Empleados
- `GET /api/employees` - Listar empleados
- `GET /api/employees/:id` - Obtener empleado
- `POST /api/employees` - Crear empleado
- `PUT /api/employees/:id` - Actualizar empleado
- `DELETE /api/employees/:id` - Eliminar empleado
- `POST /api/employees/:employeeId/technologies` - Añadir tecnología a empleado

### Proyectos
- `GET /api/projects` - Listar proyectos
- `GET /api/projects/:id` - Obtener proyecto
- `POST /api/projects` - Crear proyecto
- `PUT /api/projects/:id` - Actualizar proyecto
- `DELETE /api/projects/:id` - Eliminar proyecto
- `POST /api/projects/:projectId/employees` - Asignar empleado
- `DELETE /api/projects/:projectId/employees/:employeeId` - Remover empleado
- `POST /api/projects/:projectId/technologies` - Añadir tecnología
- `POST /api/projects/:projectId/departments` - Añadir departamento
- `POST /api/projects/:projectId/offices` - Añadir oficinas adicionales

### Tecnologías
- `GET /api/technologies` - Listar tecnologías
- `GET /api/technologies/:id` - Obtener tecnología
- `GET /api/technologies/:id/stats` - Estadísticas de tecnología
- `GET /api/technologies/:id/employees` - Empleados con la tecnología
- `GET /api/technologies/:id/projects` - Proyectos con la tecnología
- `POST /api/technologies` - Crear tecnología
- `PUT /api/technologies/:id` - Actualizar tecnología
- `DELETE /api/technologies/:id` - Eliminar tecnología

### Imputaciones de Tiempo
- `GET /api/time-entries` - Listar imputaciones
- `GET /api/time-entries/:id` - Obtener imputación
- `POST /api/time-entries` - Crear imputación
- `PUT /api/time-entries/:id` - Actualizar imputación
- `DELETE /api/time-entries/:id` - Eliminar imputación

### Gastos de Proyecto
- `GET /api/projects/:projectId/expenses` - Listar gastos
- `GET /api/projects/expenses/:id` - Obtener gasto
- `POST /api/projects/:projectId/expenses` - Crear gasto
- `PUT /api/projects/expenses/:id` - Actualizar gasto
- `DELETE /api/projects/expenses/:id` - Eliminar gasto

### Facturas
- `GET /api/projects/:projectId/invoices` - Listar facturas
- `GET /api/projects/invoices/:id` - Obtener factura
- `POST /api/projects/:projectId/invoices` - Crear factura
- `PUT /api/projects/invoices/:id` - Actualizar factura
- `DELETE /api/projects/invoices/:id` - Eliminar factura

### Dashboard
- `GET /api/dashboard/stats` - Estadísticas del dashboard

### Usuarios
- `GET /api/users` - Listar usuarios (solo DIRECTOR/MANAGER)

## 🗄️ Base de Datos

### Prisma Studio
Para visualizar y editar datos directamente:
```bash
npm run prisma:studio
```

### Migraciones
Crear una nueva migración:
```bash
npm run prisma:migrate
```

## 🔒 Roles y Permisos

- **DIRECTOR**: Acceso completo a todas las funcionalidades
- **MANAGER**: Acceso a sus oficinas asignadas y sus datos
- **EMPLOYEE**: Acceso limitado a sus propios datos y proyectos asignados

## 📝 Notas

- Todos los IDs son strings manuales (no UUIDs) para mantener compatibilidad con el frontend
- Las contraseñas se hashean con bcrypt (10 rounds)
- Los tokens JWT expiran en 7 días
- El servidor incluye manejo de errores y validación básica

## 🐛 Troubleshooting

### Error de conexión a la base de datos
- Verificar que PostgreSQL esté corriendo
- Verificar las credenciales en `.env`
- Verificar que la base de datos exista

### Error al ejecutar migraciones
- Asegurarse de que la base de datos esté vacía o usar `--force` con cuidado
- Verificar que el schema.prisma esté correcto

### Error de autenticación
- Verificar que el token JWT sea válido
- Verificar que el JWT_SECRET esté configurado correctamente

