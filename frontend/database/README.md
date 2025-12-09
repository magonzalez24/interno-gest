# Schema de Base de Datos - Excelia

Este directorio contiene el schema de base de datos generado basado en los datos mock del proyecto.

## 📋 Archivos

- `schema.sql` - Schema completo de PostgreSQL con todas las tablas, relaciones, índices y triggers

## 🗄️ Estructura de la Base de Datos

### Tablas Principales

1. **companies** - Información de la empresa
2. **offices** - Sedes u oficinas (5 sedes: Madrid, Lisboa, Santiago, CDMX, Bogotá)
3. **departments** - Departamentos por oficina (Desarrollo, QA, DevOps, Diseño, Management)
4. **users** - Usuarios del sistema con roles (DIRECTOR, MANAGER, EMPLOYEE)
5. **employees** - Información detallada de empleados
6. **manager_offices** - Asignación de managers a oficinas
7. **technologies** - Catálogo de tecnologías (50 tecnologías)
8. **projects** - Proyectos internos y externos (25 proyectos)

### Tablas de Relación (Many-to-Many)

9. **project_employees** - Asignación de empleados a proyectos con roles y allocation
10. **employee_technologies** - Habilidades tecnológicas de empleados con nivel y años de experiencia
11. **project_technologies** - Tecnologías utilizadas en proyectos
12. **project_departments** - Departamentos involucrados en proyectos

### Tablas de Registro

13. **time_entries** - Registro de horas imputadas por empleados en proyectos

## 🔑 Relaciones Principales

```
Company
  └── Offices (1:N)
      ├── Departments (1:N)
      └── Projects (1:N)
          ├── ProjectEmployees (N:M)
          ├── ProjectTechnologies (N:M)
          └── ProjectDepartments (N:M)

Users (1:1) ──> Employees (1:N) ──> ProjectEmployees
                    ├── EmployeeTechnologies (N:M)
                    └── TimeEntries (1:N)

ManagerOffices (N:M) ──> Users ──> Offices
```

## 📊 Tipos de Datos (ENUMs)

- **user_role**: EMPLOYEE, MANAGER, DIRECTOR
- **employee_status**: ACTIVE, INACTIVE, ON_LEAVE, TERMINATED
- **project_status**: PLANNING, ACTIVE, ON_HOLD, COMPLETED, CANCELLED
- **priority**: LOW, MEDIUM, HIGH, URGENT
- **tech_category**: FRONTEND, BACKEND, DATABASE, DEVOPS, MOBILE, DESIGN, TESTING, OTHER
- **skill_level**: BEGINNER, INTERMEDIATE, ADVANCED, EXPERT

## 🚀 Uso

### PostgreSQL

Para crear la base de datos:

```bash
# Crear base de datos
createdb excelia_db

# Ejecutar schema
psql excelia_db < schema.sql
```

### Características Implementadas

- ✅ Constraints de integridad referencial (Foreign Keys)
- ✅ Constraints de validación (CHECK)
- ✅ Índices para optimización de consultas
- ✅ Triggers automáticos para `updated_at`
- ✅ Vistas útiles para consultas comunes
- ✅ Comentarios en tablas para documentación

## 📈 Vistas Disponibles

1. **v_employees_full** - Empleados con información completa (usuario, oficina, departamento)
2. **v_projects_full** - Proyectos con estadísticas agregadas
3. **v_employee_tech_stats** - Estadísticas de empleados por tecnología

## 🔄 Migraciones

Este schema está diseñado para ser compatible con:
- PostgreSQL 12+
- Herramientas de migración como Flyway, Liquibase, o Prisma

## 📝 Notas

- Todos los IDs son VARCHAR(50) para mantener compatibilidad con el sistema mock actual
- Los campos de fecha usan TIMESTAMP para precisión
- Los campos monetarios usan DECIMAL para precisión financiera
- Se incluyen constraints para validar rangos (allocation 0-100, hours > 0, etc.)

## 🔐 Seguridad

- Las foreign keys tienen `ON DELETE CASCADE` o `ON DELETE SET NULL` según corresponda
- Los índices están optimizados para las consultas más comunes
- Se recomienda implementar row-level security (RLS) en producción

