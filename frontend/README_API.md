# Integración del Backend en el Frontend

Este documento describe cómo se ha integrado el backend real en el frontend, reemplazando el sistema mock anterior.

## 🔄 Cambios Realizados

### 1. Nuevo Cliente API (`src/lib/api.ts`)

Se creó un nuevo cliente API que utiliza `fetch` para comunicarse con el backend real:

- **Autenticación JWT**: Maneja tokens automáticamente
- **Formateo de fechas**: Convierte fechas JavaScript a formato ISO (YYYY-MM-DD)
- **Manejo de errores**: Captura y lanza errores apropiados
- **Headers automáticos**: Incluye token de autenticación en todas las peticiones

### 2. Configuración (`src/lib/config.ts`)

Archivo de configuración centralizado:

- `API_BASE_URL`: URL base del backend (configurable mediante variable de entorno)
- Funciones para manejar tokens: `getAuthToken()`, `setAuthToken()`, `removeAuthToken()`

### 3. Variables de Entorno

Crear un archivo `.env` en la raíz del frontend:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### 4. Reemplazo de Referencias

Se reemplazaron todas las referencias de `mockApi` por `api` en:

- ✅ `contexts/AuthContext.tsx`
- ✅ `contexts/OfficeContext.tsx`
- ✅ `hooks/useProjects.ts`
- ✅ `hooks/useTechnologies.ts`
- ✅ `hooks/useEmployees.ts`
- ✅ `hooks/useDepartments.ts`
- ✅ Todas las páginas y componentes

## 🔐 Autenticación

El sistema de autenticación ahora funciona con JWT:

1. **Login**: El usuario envía email y password
2. **Backend responde**: Con el usuario y un token JWT
3. **Frontend guarda**: El token en localStorage
4. **Peticiones siguientes**: Incluyen automáticamente el token en el header `Authorization: Bearer <token>`

### Flujo de Autenticación

```typescript
// Login
const userData = await api.login(email, password);
// El token se guarda automáticamente

// Peticiones autenticadas
const projects = await api.getProjects();
// El token se incluye automáticamente en el header
```

## 📝 Formato de Datos

### Fechas

El backend espera fechas en formato `YYYY-MM-DD`. El cliente API convierte automáticamente:

```typescript
// Frontend envía
{ startDate: new Date('2024-01-15') }

// Se convierte a
{ startDate: '2024-01-15' }
```

### Respuestas del Backend

El backend devuelve datos con relaciones pobladas (por ejemplo, `project.office`, `employee.user`, etc.), por lo que el frontend puede acceder directamente a estas propiedades.

## 🚀 Uso

### Desarrollo

1. Asegúrate de que el backend esté corriendo en `http://localhost:3001`
2. Configura `.env` con la URL correcta
3. Inicia el frontend normalmente

### Producción

1. Configura `VITE_API_BASE_URL` con la URL de producción del backend
2. Rebuild del frontend para incluir la nueva configuración

## 🔍 Debugging

### Verificar Conexión

Abre la consola del navegador y verifica:

1. **Peticiones HTTP**: Deben ir a `http://localhost:3001/api/...`
2. **Headers**: Deben incluir `Authorization: Bearer <token>` (excepto en login)
3. **Errores**: Si hay errores 401, el token puede haber expirado

### Errores Comunes

#### 401 Unauthorized
- El token ha expirado o es inválido
- Solución: Hacer logout y login nuevamente

#### CORS Error
- El backend no está configurado para aceptar peticiones del frontend
- Solución: Verificar configuración de CORS en el backend

#### 404 Not Found
- La URL del endpoint es incorrecta
- Solución: Verificar que el endpoint existe en el backend

## 📚 Archivos Clave

- `src/lib/api.ts` - Cliente API principal
- `src/lib/config.ts` - Configuración y helpers de autenticación
- `src/contexts/AuthContext.tsx` - Manejo de autenticación
- `src/types/api.ts` - Tipos TypeScript para la API

## 🔄 Migración desde Mock

El archivo `mock-api.ts` se mantiene por compatibilidad, pero ya no se usa. Todos los componentes ahora usan `api.ts` que se comunica con el backend real.

## ✅ Checklist de Verificación

- [x] Cliente API creado
- [x] Configuración de URL del backend
- [x] Manejo de tokens JWT
- [x] Formateo de fechas
- [x] Reemplazo de todas las referencias a mockApi
- [x] Actualización de AuthContext
- [x] Actualización de todos los hooks
- [x] Actualización de todas las páginas
- [x] Actualización de todos los componentes

