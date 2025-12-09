# Documentación de Endpoints API

Este documento lista todos los endpoints necesarios para replicar la funcionalidad del `mockApi` cuando se implemente la base de datos real.

## 📋 Índice

- [Autenticación](#autenticación)
- [Oficinas (Offices)](#oficinas-offices)
- [Departamentos](#departamentos)
- [Empleados](#empleados)
- [Proyectos](#proyectos)
- [Tecnologías](#tecnologías)
- [Relaciones](#relaciones)
- [Imputaciones de Tiempo](#imputaciones-de-tiempo)
- [Gastos de Proyecto](#gastos-de-proyecto)
- [Facturas](#facturas)
- [Documentos de Proyecto](#documentos-de-proyecto)
- [Dashboard y Analytics](#dashboard-y-analytics)
- [Usuarios](#usuarios)
- [Estadísticas y Relaciones](#estadísticas-y-relaciones)

---

## 🔐 Autenticación

### `POST /api/auth/login`
**Descripción:** Iniciar sesión de usuario  
**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Response:** `User & { employee?: Employee }`  
**Usado en:**
- `contexts/AuthContext.tsx`

### `POST /api/auth/logout`
**Descripción:** Cerrar sesión  
**Response:** `void`  
**Usado en:**
- `contexts/AuthContext.tsx`

### `GET /api/auth/me`
**Descripción:** Obtener usuario actual autenticado  
**Response:** `User & { employee?: Employee }`  
**Usado en:**
- `contexts/AuthContext.tsx`

---

## 🏢 Oficinas (Offices)

### `GET /api/offices`
**Descripción:** Obtener todas las oficinas  
**Response:** `Office[]`  
**Usado en:**
- `pages/offices/OfficesPage.tsx`

### `GET /api/offices/:id`
**Descripción:** Obtener oficina por ID  
**Response:** `Office`  
**Usado en:**
- `pages/offices/OfficeFormPage.tsx`
- `pages/offices/OfficeDetailPage.tsx`

### `GET /api/users/:userId/offices`
**Descripción:** Obtener oficinas asociadas a un usuario  
**Response:** `Office[]`  
**Usado en:**
- `contexts/OfficeContext.tsx`

### `POST /api/offices`
**Descripción:** Crear nueva oficina  
**Body:** `Partial<Office>`  
**Response:** `Office`  
**Usado en:**
- `pages/offices/OfficeFormPage.tsx`

### `PUT /api/offices/:id`
**Descripción:** Actualizar oficina  
**Body:** `Partial<Office>`  
**Response:** `Office`  
**Usado en:**
- `pages/offices/OfficeFormPage.tsx`

---

## 📁 Departamentos

### `GET /api/departments`
**Descripción:** Obtener departamentos (opcionalmente filtrados por officeId)  
**Query Params:** `?officeId=string`  
**Response:** `Department[]`  
**Usado en:**
- `pages/offices/OfficeDetailPage.tsx`
- `hooks/useDepartments.ts`

### `GET /api/departments/:id`
**Descripción:** Obtener departamento por ID  
**Response:** `Department`  
**Usado en:**
- `pages/departments/DepartmentDetailPage.tsx`

### `POST /api/departments`
**Descripción:** Crear nuevo departamento  
**Body:** `Partial<Department>`  
**Response:** `Department`  
**Nota:** Implementado en mockApi pero no usado directamente en pantallas

### `PUT /api/departments/:id`
**Descripción:** Actualizar departamento  
**Body:** `Partial<Department>`  
**Response:** `Department`  
**Nota:** Implementado en mockApi pero no usado directamente en pantallas

### `DELETE /api/departments/:id`
**Descripción:** Eliminar departamento  
**Response:** `void`  
**Nota:** Implementado en mockApi pero no usado directamente en pantallas

---

## 👥 Empleados

### `GET /api/employees`
**Descripción:** Obtener empleados con filtros opcionales  
**Query Params:** `?officeId=string&departmentId=string`  
**Response:** `Employee[]`  
**Usado en:**
- `pages/projects/ProjectFormPage.tsx`
- `components/projects/AddTeamMemberModal.tsx`
- `hooks/useEmployees.ts`

### `GET /api/employees/:id`
**Descripción:** Obtener empleado por ID  
**Response:** `Employee`  
**Usado en:**
- `pages/employees/EmployeeDetailPage.tsx`
- `pages/employees/EmployeeFormPage.tsx`

### `POST /api/employees`
**Descripción:** Crear nuevo empleado  
**Body:** `Partial<Employee>`  
**Response:** `Employee`  
**Usado en:**
- `pages/employees/EmployeeFormPage.tsx`

### `PUT /api/employees/:id`
**Descripción:** Actualizar empleado  
**Body:** `Partial<Employee>`  
**Response:** `Employee`  
**Usado en:**
- `pages/employees/EmployeeFormPage.tsx`

### `DELETE /api/employees/:id`
**Descripción:** Eliminar empleado  
**Response:** `void`  
**Nota:** Implementado en mockApi pero no usado directamente en pantallas

---

## 📊 Proyectos

### `GET /api/projects`
**Descripción:** Obtener proyectos con filtros opcionales  
**Query Params:** `?officeId=string&status=ProjectStatus`  
**Response:** `Project[]`  
**Usado en:**
- `components/time-entries/NewTimeEntryModal.tsx`
- `hooks/useProjects.ts`

### `GET /api/projects/:id`
**Descripción:** Obtener proyecto por ID  
**Response:** `Project`  
**Usado en:**
- `pages/projects/ProjectDetailPage.tsx`
- `pages/projects/ProjectFormPage.tsx`
- `pages/billing/ProjectInvoicesPage.tsx`

### `POST /api/projects`
**Descripción:** Crear nuevo proyecto  
**Body:** `Partial<Project>`  
**Response:** `Project`  
**Usado en:**
- `pages/projects/ProjectFormPage.tsx`

### `PUT /api/projects/:id`
**Descripción:** Actualizar proyecto  
**Body:** `Partial<Project>`  
**Response:** `Project`  
**Usado en:**
- `pages/projects/ProjectFormPage.tsx`

### `DELETE /api/projects/:id`
**Descripción:** Eliminar proyecto  
**Response:** `void`  
**Nota:** Implementado en mockApi pero no usado directamente en pantallas

---

## 💻 Tecnologías

### `GET /api/technologies`
**Descripción:** Obtener todas las tecnologías  
**Response:** `Technology[]`  
**Usado en:**
- `hooks/useTechnologies.ts`

### `GET /api/technologies/:id`
**Descripción:** Obtener tecnología por ID  
**Response:** `Technology`  
**Usado en:**
- `pages/technologies/TechnologyFormPage.tsx`

### `POST /api/technologies`
**Descripción:** Crear nueva tecnología  
**Body:** `Partial<Technology>`  
**Response:** `Technology`  
**Usado en:**
- `pages/technologies/TechnologyFormPage.tsx`

### `PUT /api/technologies/:id`
**Descripción:** Actualizar tecnología  
**Body:** `Partial<Technology>`  
**Response:** `Technology`  
**Usado en:**
- `pages/technologies/TechnologyFormPage.tsx`

### `DELETE /api/technologies/:id`
**Descripción:** Eliminar tecnología  
**Response:** `void`  
**Nota:** Implementado en mockApi pero no usado directamente en pantallas

---

## 🔗 Relaciones

### `POST /api/projects/:projectId/employees`
**Descripción:** Asignar empleado a proyecto  
**Body:**
```json
{
  "employeeId": "string",
  "role": "string",
  "allocation": "number",
  "startDate": "Date",
  "endDate": "Date (opcional)"
}
```
**Response:** `ProjectEmployee`  
**Usado en:**
- `pages/projects/ProjectFormPage.tsx`
- `components/projects/AddTeamMemberModal.tsx`

### `DELETE /api/projects/:projectId/employees/:employeeId`
**Descripción:** Remover empleado de proyecto  
**Response:** `void`  
**Nota:** Implementado en mockApi. Aunque no se usa directamente en pantallas, es necesario para la funcionalidad completa de gestión de equipos. Se podría usar en `ProjectDetailPage` o `ProjectFormPage` para remover miembros del equipo.

### `POST /api/employees/:employeeId/technologies`
**Descripción:** Añadir tecnología a empleado  
**Body:**
```json
{
  "technologyId": "string",
  "level": "SkillLevel",
  "yearsOfExp": "number"
}
```
**Response:** `EmployeeTechnology`  
**Usado en:**
- `pages/employees/EmployeeFormPage.tsx`

### `POST /api/projects/:projectId/technologies`
**Descripción:** Añadir tecnología a proyecto  
**Body:**
```json
{
  "technologyId": "string"
}
```
**Response:** `ProjectTechnology`  
**Usado en:**
- `pages/projects/ProjectFormPage.tsx`

### `POST /api/projects/:projectId/departments`
**Descripción:** Añadir departamento a proyecto  
**Body:**
```json
{
  "departmentId": "string"
}
```
**Response:** `ProjectDepartment`  
**Nota:** Implementado en mockApi pero no usado directamente en pantallas

### `POST /api/projects/:projectId/offices`
**Descripción:** Añadir oficinas adicionales a proyecto  
**Body:**
```json
{
  "officeIds": "string[]"
}
```
**Response:** `ProjectOffice[]`  
**Nota:** Comentado en `pages/projects/ProjectFormPage.tsx` (línea 251) - **NECESITA IMPLEMENTACIÓN**

---

## ⏱️ Imputaciones de Tiempo

### `GET /api/time-entries`
**Descripción:** Obtener imputaciones de tiempo (opcionalmente filtradas por employeeId)  
**Query Params:** `?employeeId=string`  
**Response:** `TimeEntry[]`  
**Usado en:**
- `pages/time-entries/TimeEntriesPage.tsx`
- `components/time-entries/PasteTimeEntriesModal.tsx`

### `GET /api/time-entries/:id`
**Descripción:** Obtener imputación por ID  
**Response:** `TimeEntry`  
**Nota:** Implementado en mockApi pero no usado directamente en pantallas

### `POST /api/time-entries`
**Descripción:** Crear nueva imputación de tiempo  
**Body:**
```json
{
  "employeeId": "string",
  "projectId": "string",
  "hours": "number",
  "description": "string (opcional)",
  "date": "Date"
}
```
**Response:** `TimeEntry`  
**Usado en:**
- `components/time-entries/NewTimeEntryModal.tsx`
- `components/time-entries/PasteTimeEntriesModal.tsx`

### `PUT /api/time-entries/:id`
**Descripción:** Actualizar imputación de tiempo  
**Body:** `Partial<TimeEntry>`  
**Response:** `TimeEntry`  
**Nota:** Implementado en mockApi. Aunque no se usa directamente en pantallas, sería útil añadir esta funcionalidad en `TimeEntryDetailModal` para permitir editar imputaciones.

### `DELETE /api/time-entries/:id`
**Descripción:** Eliminar imputación de tiempo  
**Response:** `void`  
**Nota:** Implementado en mockApi. Aunque no se usa directamente en pantallas, sería útil añadir esta funcionalidad en `TimeEntryDetailModal` o `TimeEntriesPage` para permitir eliminar imputaciones.

---

## 💰 Gastos de Proyecto

### `GET /api/projects/:projectId/expenses`
**Descripción:** Obtener gastos de un proyecto  
**Response:** `ProjectExpense[]`  
**Usado en:**
- `components/projects/AddExpenseModal.tsx` (implícito)

### `GET /api/projects/expenses/:id`
**Descripción:** Obtener gasto por ID  
**Response:** `ProjectExpense`  
**Nota:** Implementado en mockApi pero no usado directamente en pantallas

### `POST /api/projects/:projectId/expenses`
**Descripción:** Crear nuevo gasto de proyecto  
**Body:**
```json
{
  "category": "ExpenseCategory",
  "description": "string",
  "cost": "number",
  "startDate": "Date",
  "endDate": "Date (opcional)"
}
```
**Response:** `ProjectExpense`  
**Usado en:**
- `components/projects/AddExpenseModal.tsx`

### `PUT /api/projects/expenses/:id`
**Descripción:** Actualizar gasto de proyecto  
**Body:** `Partial<ProjectExpense>`  
**Response:** `ProjectExpense`  
**Usado en:**
- `components/projects/AddExpenseModal.tsx`

### `DELETE /api/projects/expenses/:id`
**Descripción:** Eliminar gasto de proyecto  
**Response:** `void`  
**Nota:** Implementado en mockApi. Aunque no se usa directamente en pantallas, sería útil añadir esta funcionalidad en `ProjectDetailPage` para permitir eliminar gastos.

---

## 🧾 Facturas

### `GET /api/projects/:projectId/invoices`
**Descripción:** Obtener facturas de un proyecto  
**Response:** `Invoice[]`  
**Nota:** **NECESITA IMPLEMENTACIÓN** - Actualmente mockeado en `pages/billing/ProjectInvoicesPage.tsx`

### `GET /api/invoices/:id`
**Descripción:** Obtener factura por ID  
**Response:** `Invoice`  
**Nota:** **NECESITA IMPLEMENTACIÓN**

### `POST /api/projects/:projectId/invoices`
**Descripción:** Crear nueva factura  
**Body:**
```json
{
  "invoiceNumber": "string (opcional, se genera automáticamente)",
  "amount": "number",
  "issueDate": "Date",
  "dueDate": "Date",
  "status": "DRAFT | SENT | PAID | OVERDUE",
  "description": "string (opcional)",
  "pdfUrl": "string"
}
```
**Response:** `Invoice`  
**Nota:** **NECESITA IMPLEMENTACIÓN** - Comentado en `components/billing/AddInvoiceModal.tsx` (línea 164)

### `PUT /api/invoices/:id`
**Descripción:** Actualizar factura  
**Body:** `Partial<Invoice>`  
**Response:** `Invoice`  
**Nota:** **NECESITA IMPLEMENTACIÓN**

### `DELETE /api/invoices/:id`
**Descripción:** Eliminar factura  
**Response:** `void`  
**Nota:** **NECESITA IMPLEMENTACIÓN**

### `POST /api/invoices/:id/pdf`
**Descripción:** Subir PDF de factura  
**Body:** `FormData` (archivo PDF)  
**Response:** `{ pdfUrl: string }`  
**Nota:** **NECESITA IMPLEMENTACIÓN** - Para subir archivos PDF

---

## 📄 Documentos de Proyecto

### `GET /api/projects/:projectId/documents`
**Descripción:** Obtener documentos de un proyecto  
**Response:** `ProjectDocument[]`  
**Nota:** **NECESITA IMPLEMENTACIÓN** - Actualmente mockeado en `pages/projects/ProjectDetailPage.tsx`

### `GET /api/projects/documents/:id`
**Descripción:** Obtener documento por ID  
**Response:** `ProjectDocument`  
**Nota:** **NECESITA IMPLEMENTACIÓN**

### `POST /api/projects/:projectId/documents`
**Descripción:** Crear nuevo documento de proyecto  
**Body:**
```json
{
  "name": "string",
  "type": "PLIEGO | DOCUMENTACION | CONTRATO | PROPUESTA | OTRO",
  "description": "string (opcional)",
  "pdfUrl": "string"
}
```
**Response:** `ProjectDocument`  
**Nota:** **NECESITA IMPLEMENTACIÓN** - Comentado en `components/projects/AddDocumentModal.tsx` (línea 156)

### `PUT /api/projects/documents/:id`
**Descripción:** Actualizar documento de proyecto  
**Body:** `Partial<ProjectDocument>`  
**Response:** `ProjectDocument`  
**Nota:** **NECESITA IMPLEMENTACIÓN**

### `DELETE /api/projects/documents/:id`
**Descripción:** Eliminar documento de proyecto  
**Response:** `void`  
**Nota:** **NECESITA IMPLEMENTACIÓN**

### `POST /api/projects/documents/:id/pdf`
**Descripción:** Subir PDF de documento  
**Body:** `FormData` (archivo PDF)  
**Response:** `{ pdfUrl: string }`  
**Nota:** **NECESITA IMPLEMENTACIÓN** - Para subir archivos PDF

---

## 📈 Dashboard y Analytics

### `GET /api/dashboard/stats`
**Descripción:** Obtener estadísticas del dashboard  
**Query Params:** `?officeIds=string[]` (opcional, para filtrar por oficinas)  
**Response:** `DashboardStats`  
**Usado en:**
- `pages/dashboard/DashboardPage.tsx`

**Estructura de respuesta:**
```typescript
{
  totalProjects: number;
  activeProjects: number;
  totalEmployees: number;
  totalDepartments: number;
  completedProjectsThisMonth: number;
  projectsByStatus: Record<ProjectStatus, number>;
  employeesByDepartment: Record<string, number>;
  annualBudget: number;
  annualExpenses: number;
  annualProfit: number;
}
```

---

## 👤 Usuarios

### `GET /api/users`
**Descripción:** Obtener todos los usuarios del sistema  
**Response:** `User[]`  
**Usado en:**
- `pages/users/UsersPage.tsx` (actualmente usa `mockUsers` directamente)

**Nota:** **NECESITA IMPLEMENTACIÓN** - Actualmente usa datos mock directamente

---

## 📊 Estadísticas y Relaciones

### `GET /api/technologies/:id/stats`
**Descripción:** Obtener estadísticas de una tecnología (número de empleados que la conocen, proyectos que la usan)  
**Response:**
```json
{
  "employeeCount": "number",
  "projectCount": "number"
}
```
**Usado en:**
- `pages/technologies/TechnologiesPage.tsx` (actualmente usa `mockEmployeeTechnologies` directamente)
- `pages/technologies/TechnologyFormPage.tsx` (actualmente usa `mockEmployeeTechnologies` y `mockProjectTechnologies` directamente)

**Nota:** **NECESITA IMPLEMENTACIÓN** - Actualmente usa datos mock directamente

### `GET /api/technologies/:id/employees`
**Descripción:** Obtener empleados que conocen una tecnología  
**Response:** `EmployeeTechnology[]`  
**Usado en:**
- `pages/technologies/TechnologyFormPage.tsx` (actualmente usa `mockEmployeeTechnologies` directamente)

**Nota:** **NECESITA IMPLEMENTACIÓN** - Actualmente usa datos mock directamente

### `GET /api/technologies/:id/projects`
**Descripción:** Obtener proyectos que usan una tecnología  
**Response:** `ProjectTechnology[]`  
**Usado en:**
- `pages/technologies/TechnologyFormPage.tsx` (actualmente usa `mockProjectTechnologies` directamente)

**Nota:** **NECESITA IMPLEMENTACIÓN** - Actualmente usa datos mock directamente

---

## 📝 Notas Importantes

### Endpoints que necesitan implementación:

1. **Facturas (Invoices):** Completamente mockeado, necesita implementación completa
2. **Documentos de Proyecto:** Completamente mockeado, necesita implementación completa
3. **Añadir oficinas adicionales a proyecto:** Comentado en código, necesita implementación
4. **Usuarios:** Actualmente usa `mockUsers` directamente, necesita endpoint
5. **Estadísticas de Tecnologías:** Actualmente usa `mockEmployeeTechnologies` y `mockProjectTechnologies` directamente, necesita endpoints

### Consideraciones para la implementación:

1. **Autenticación:** Todos los endpoints (excepto login) deben requerir autenticación mediante JWT o similar
2. **Autorización:** Verificar permisos según el rol del usuario (DIRECTOR, MANAGER, EMPLOYEE)
3. **Validación:** Implementar validación de datos en el backend
4. **Subida de archivos:** Los endpoints de PDF necesitan manejar multipart/form-data
5. **Filtrado:** Los endpoints de listado deben soportar filtros, paginación y ordenamiento
6. **Relaciones:** Asegurar que las relaciones se populen correctamente (employees, projects, technologies, etc.)
7. **Estadísticas:** Los endpoints de estadísticas deben calcularse en el backend para mejor rendimiento
8. **Operaciones de eliminación:** Aunque no se usan actualmente en todas las pantallas, es recomendable implementarlas para funcionalidad completa

### Tipos de datos:

Todos los tipos están definidos en `frontend/src/types/database.ts` y deben coincidir con los modelos de la base de datos.

---

## 🔄 Migración desde mockApi

Para migrar del `mockApi` a la API real:

1. Crear un archivo `api.ts` similar a `mock-api.ts` pero usando `fetch` o `axios`
2. Reemplazar todas las llamadas a `mockApi` por llamadas a la nueva API
3. Mantener la misma interfaz `MockApi` para facilitar la migración
4. Implementar manejo de errores y loading states
5. Agregar interceptores para autenticación y manejo de tokens

