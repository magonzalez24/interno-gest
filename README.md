# Sistema de Gestión Excelia

Aplicación web frontend completa para gestión interna de proyectos y trabajadores usando React, TypeScript, React Router, Tailwind CSS y shadcn/ui.

## 🚀 Características

- **Sistema de Autenticación**: Login con diferentes roles (DIRECTOR, MANAGER, EMPLOYEE)
- **Gestión de Proyectos**: Crear, editar, ver y gestionar proyectos
- **Gestión de Empleados**: Perfiles completos con tecnologías y proyectos asignados
- **Gestión de Departamentos**: Organización por departamentos
- **Tecnologías**: Catálogo de tecnologías utilizadas
- **Sedes**: Gestión de múltiples sedes (España, Portugal, Chile, México, Colombia)
- **Dashboard**: Métricas y estadísticas según el rol del usuario
- **Sistema de Permisos**: Control de acceso basado en roles

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn

## 🛠️ Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Inicia el servidor de desarrollo:
```bash
npm run dev
```

3. Abre tu navegador en `http://localhost:5173`

## 👤 Usuarios de Prueba

La aplicación incluye usuarios mock para testing:

- **Director**: `director@excelia.com` / `password123`
- **Manager España**: `manager.es@excelia.com` / `password123`
- **Manager Latam**: `manager.latam@excelia.com` / `password123`
- **Empleado**: `juan.perez@excelia.com` / `password123`

## 📁 Estructura del Proyecto

```
/src
  /components
    /ui          # Componentes shadcn/ui
    /layout      # Layout principal (Sidebar, Navbar)
    /auth        # Componentes de autenticación
  /contexts      # Context API (Auth, Offices)
  /hooks         # Custom hooks
  /lib           # Utilidades, mock data, API mock
  /pages         # Páginas de la aplicación
  /routes        # Configuración de rutas
  /types         # Tipos TypeScript
```

## 🎨 Tecnologías Utilizadas

- **React 18** con TypeScript
- **React Router v6** para navegación
- **Tailwind CSS** para estilos
- **shadcn/ui** para componentes UI
- **React Hook Form** + **Zod** para formularios y validación
- **date-fns** para manejo de fechas
- **Lucide React** para iconos
- **Vite** como build tool

## 🔐 Sistema de Permisos

- **DIRECTOR**: Acceso total a todas las sedes y funcionalidades
- **MANAGER**: Acceso a sedes asignadas, puede gestionar proyectos y empleados
- **EMPLOYEE**: Acceso limitado a su propia información y proyectos asignados

## 📊 Datos Mock

La aplicación incluye datos mock realistas:
- 5 Sedes
- 20 Departamentos
- 45 Usuarios (1 Director, 4 Managers, 40 Empleados)
- 25 Proyectos
- 50 Tecnologías
- Relaciones completas entre entidades

## 🚧 Próximos Pasos

Para integrar con backend real:
1. Reemplazar `mockApi` en `/src/lib/mock-api.ts` con llamadas reales
2. Configurar variables de entorno para URLs de API
3. Implementar manejo de tokens JWT
4. Actualizar tipos según el schema real de base de datos

## 📝 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run preview` - Previsualiza build de producción
- `npm run lint` - Ejecuta el linter

## 🎯 Funcionalidades Principales

### Para Empleados
- Ver proyectos asignados
- Ver perfil personal
- Explorar tecnologías

### Para Managers
- Dashboard con métricas
- Gestionar proyectos y empleados
- Ver reportes
- Gestionar departamentos

### Para Directores
- Vista global de todas las sedes
- Gestionar usuarios
- Gestionar sedes
- Acceso completo al sistema

## 📄 Licencia

Este proyecto es privado y de uso interno.

