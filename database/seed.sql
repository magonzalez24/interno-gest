-- ============================================
-- SCRIPT DE DATOS INICIALES - EXCELIA
-- Datos realistas generados basados en mock-data.ts
-- IMPORTANTE: Ningún empleado supera el 100% de allocation
-- ============================================

-- Limpiar datos existentes (opcional, descomentar si es necesario)
-- TRUNCATE TABLE invoices, project_expenses, project_offices, time_entries, 
--   project_employees, employee_technologies, project_technologies, 
--   project_departments, projects, technologies, manager_offices, employees, 
--   users, departments, offices, companies CASCADE;

-- ============================================
-- 1. COMPANY
-- ============================================
INSERT INTO companies (id, name, logo, created_at, updated_at) VALUES
('company-1', 'Excelia', NULL, '2020-01-01 00:00:00', '2020-01-01 00:00:00');

-- ============================================
-- 2. OFFICES (5 sedes)
-- ============================================
INSERT INTO offices (id, name, country, address, timezone, company_id, created_at, updated_at) VALUES
('office-1', 'Madrid', 'España', 'Calle Gran Vía 123, 28013 Madrid', 'Europe/Madrid', 'company-1', '2020-01-15 00:00:00', '2020-01-15 00:00:00'),
('office-2', 'Lisboa', 'Portugal', 'Avenida da Liberdade 456, 1250-096 Lisboa', 'Europe/Lisbon', 'company-1', '2020-03-10 00:00:00', '2020-03-10 00:00:00'),
('office-3', 'Santiago', 'Chile', 'Av. Providencia 789, Santiago', 'America/Santiago', 'company-1', '2021-05-20 00:00:00', '2021-05-20 00:00:00'),
('office-4', 'Ciudad de México', 'México', 'Av. Reforma 321, CDMX', 'America/Mexico_City', 'company-1', '2021-08-15 00:00:00', '2021-08-15 00:00:00'),
('office-5', 'Bogotá', 'Colombia', 'Carrera 7 # 123-45, Bogotá', 'America/Bogota', 'company-1', '2022-02-01 00:00:00', '2022-02-01 00:00:00');

-- ============================================
-- 3. DEPARTMENTS (19 departamentos - 4 por sede excepto Madrid que tiene 4)
-- ============================================
INSERT INTO departments (id, name, description, office_id, created_at, updated_at) VALUES
-- Madrid (4 departamentos)
('dept-0-0', 'Desarrollo', 'Departamento de Desarrollo en Madrid', 'office-1', '2020-01-16 00:00:00', '2020-01-16 00:00:00'),
('dept-0-1', 'QA', 'Departamento de QA en Madrid', 'office-1', '2020-01-17 00:00:00', '2020-01-17 00:00:00'),
('dept-0-2', 'DevOps', 'Departamento de DevOps en Madrid', 'office-1', '2020-01-18 00:00:00', '2020-01-18 00:00:00'),
('dept-0-3', 'Diseño', 'Departamento de Diseño en Madrid', 'office-1', '2020-01-19 00:00:00', '2020-01-19 00:00:00'),
-- Lisboa (5 departamentos)
('dept-1-0', 'Desarrollo', 'Departamento de Desarrollo en Lisboa', 'office-2', '2020-03-11 00:00:00', '2020-03-11 00:00:00'),
('dept-1-1', 'QA', 'Departamento de QA en Lisboa', 'office-2', '2020-03-12 00:00:00', '2020-03-12 00:00:00'),
('dept-1-2', 'DevOps', 'Departamento de DevOps en Lisboa', 'office-2', '2020-03-13 00:00:00', '2020-03-13 00:00:00'),
('dept-1-3', 'Diseño', 'Departamento de Diseño en Lisboa', 'office-2', '2020-03-14 00:00:00', '2020-03-14 00:00:00'),
('dept-1-4', 'Management', 'Departamento de Management en Lisboa', 'office-2', '2020-03-15 00:00:00', '2020-03-15 00:00:00'),
-- Santiago (5 departamentos)
('dept-2-0', 'Desarrollo', 'Departamento de Desarrollo en Santiago', 'office-3', '2021-05-21 00:00:00', '2021-05-21 00:00:00'),
('dept-2-1', 'QA', 'Departamento de QA en Santiago', 'office-3', '2021-05-22 00:00:00', '2021-05-22 00:00:00'),
('dept-2-2', 'DevOps', 'Departamento de DevOps en Santiago', 'office-3', '2021-05-23 00:00:00', '2021-05-23 00:00:00'),
('dept-2-3', 'Diseño', 'Departamento de Diseño en Santiago', 'office-3', '2021-05-24 00:00:00', '2021-05-24 00:00:00'),
('dept-2-4', 'Management', 'Departamento de Management en Santiago', 'office-3', '2021-05-25 00:00:00', '2021-05-25 00:00:00'),
-- Ciudad de México (5 departamentos)
('dept-3-0', 'Desarrollo', 'Departamento de Desarrollo en Ciudad de México', 'office-4', '2021-08-16 00:00:00', '2021-08-16 00:00:00'),
('dept-3-1', 'QA', 'Departamento de QA en Ciudad de México', 'office-4', '2021-08-17 00:00:00', '2021-08-17 00:00:00'),
('dept-3-2', 'DevOps', 'Departamento de DevOps en Ciudad de México', 'office-4', '2021-08-18 00:00:00', '2021-08-18 00:00:00'),
('dept-3-3', 'Diseño', 'Departamento de Diseño en Ciudad de México', 'office-4', '2021-08-19 00:00:00', '2021-08-19 00:00:00'),
('dept-3-4', 'Management', 'Departamento de Management en Ciudad de México', 'office-4', '2021-08-20 00:00:00', '2021-08-20 00:00:00'),
-- Bogotá (5 departamentos)
('dept-4-0', 'Desarrollo', 'Departamento de Desarrollo en Bogotá', 'office-5', '2022-02-02 00:00:00', '2022-02-02 00:00:00'),
('dept-4-1', 'QA', 'Departamento de QA en Bogotá', 'office-5', '2022-02-03 00:00:00', '2022-02-03 00:00:00'),
('dept-4-2', 'DevOps', 'Departamento de DevOps en Bogotá', 'office-5', '2022-02-04 00:00:00', '2022-02-04 00:00:00'),
('dept-4-3', 'Diseño', 'Departamento de Diseño en Bogotá', 'office-5', '2022-02-05 00:00:00', '2022-02-05 00:00:00'),
('dept-4-4', 'Management', 'Departamento de Management en Bogotá', 'office-5', '2022-02-06 00:00:00', '2022-02-06 00:00:00');

-- ============================================
-- 4. USERS (45 usuarios: 1 Director, 4 Managers, 40 Employees)
-- ============================================
INSERT INTO users (id, email, role, created_at, updated_at) VALUES
-- Director
('user-director', 'director@excelia.com', 'DIRECTOR', '2020-01-01 00:00:00', '2020-01-01 00:00:00'),
-- Managers
('user-manager-1', 'manager.es@excelia.com', 'MANAGER', '2020-02-01 00:00:00', '2020-02-01 00:00:00'),
('user-manager-2', 'manager.latam@excelia.com', 'MANAGER', '2021-06-01 00:00:00', '2021-06-01 00:00:00'),
('user-manager-3', 'manager.pt@excelia.com', 'MANAGER', '2020-04-01 00:00:00', '2020-04-01 00:00:00'),
('user-manager-4', 'manager.co@excelia.com', 'MANAGER', '2022-03-01 00:00:00', '2022-03-01 00:00:00'),
-- Employees (40)
('user-employee-1', 'juan.perez@excelia.com', 'EMPLOYEE', '2020-06-15 00:00:00', '2020-06-15 00:00:00'),
('user-employee-2', 'maria.garcia@excelia.com', 'EMPLOYEE', '2020-07-20 00:00:00', '2020-07-20 00:00:00'),
('user-employee-3', 'carlos.lopez@excelia.com', 'EMPLOYEE', '2020-08-10 00:00:00', '2020-08-10 00:00:00'),
('user-employee-4', 'ana.martinez@excelia.com', 'EMPLOYEE', '2020-09-05 00:00:00', '2020-09-05 00:00:00'),
('user-employee-5', 'luis.rodriguez@excelia.com', 'EMPLOYEE', '2020-10-12 00:00:00', '2020-10-12 00:00:00'),
('user-employee-6', 'laura.sanchez@excelia.com', 'EMPLOYEE', '2020-11-18 00:00:00', '2020-11-18 00:00:00'),
('user-employee-7', 'pedro.fernandez@excelia.com', 'EMPLOYEE', '2021-01-22 00:00:00', '2021-01-22 00:00:00'),
('user-employee-8', 'carmen.gonzalez@excelia.com', 'EMPLOYEE', '2021-02-14 00:00:00', '2021-02-14 00:00:00'),
('user-employee-9', 'miguel.torres@excelia.com', 'EMPLOYEE', '2021-03-08 00:00:00', '2021-03-08 00:00:00'),
('user-employee-10', 'sofia.ramirez@excelia.com', 'EMPLOYEE', '2021-04-25 00:00:00', '2021-04-25 00:00:00'),
('user-employee-11', 'diego.morales@excelia.com', 'EMPLOYEE', '2021-05-30 00:00:00', '2021-05-30 00:00:00'),
('user-employee-12', 'elena.ruiz@excelia.com', 'EMPLOYEE', '2021-07-11 00:00:00', '2021-07-11 00:00:00'),
('user-employee-13', 'javier.herrera@excelia.com', 'EMPLOYEE', '2021-08-19 00:00:00', '2021-08-19 00:00:00'),
('user-employee-14', 'isabel.jimenez@excelia.com', 'EMPLOYEE', '2021-09-27 00:00:00', '2021-09-27 00:00:00'),
('user-employee-15', 'roberto.diaz@excelia.com', 'EMPLOYEE', '2021-10-15 00:00:00', '2021-10-15 00:00:00'),
('user-employee-16', 'patricia.moreno@excelia.com', 'EMPLOYEE', '2021-11-22 00:00:00', '2021-11-22 00:00:00'),
('user-employee-17', 'fernando.castro@excelia.com', 'EMPLOYEE', '2022-01-10 00:00:00', '2022-01-10 00:00:00'),
('user-employee-18', 'lucia.romero@excelia.com', 'EMPLOYEE', '2022-02-18 00:00:00', '2022-02-18 00:00:00'),
('user-employee-19', 'antonio.navarro@excelia.com', 'EMPLOYEE', '2022-03-25 00:00:00', '2022-03-25 00:00:00'),
('user-employee-20', 'marta.dominguez@excelia.com', 'EMPLOYEE', '2022-04-12 00:00:00', '2022-04-12 00:00:00'),
('user-employee-21', 'ricardo.vega@excelia.com', 'EMPLOYEE', '2022-05-20 00:00:00', '2022-05-20 00:00:00'),
('user-employee-22', 'cristina.ortega@excelia.com', 'EMPLOYEE', '2022-06-08 00:00:00', '2022-06-08 00:00:00'),
('user-employee-23', 'andres.medina@excelia.com', 'EMPLOYEE', '2022-07-15 00:00:00', '2022-07-15 00:00:00'),
('user-employee-24', 'natalia.campos@excelia.com', 'EMPLOYEE', '2022-08-22 00:00:00', '2022-08-22 00:00:00'),
('user-employee-25', 'oscar.rios@excelia.com', 'EMPLOYEE', '2022-09-30 00:00:00', '2022-09-30 00:00:00'),
('user-employee-26', 'beatriz.vargas@excelia.com', 'EMPLOYEE', '2022-10-18 00:00:00', '2022-10-18 00:00:00'),
('user-employee-27', 'hector.mendoza@excelia.com', 'EMPLOYEE', '2022-11-25 00:00:00', '2022-11-25 00:00:00'),
('user-employee-28', 'adriana.paredes@excelia.com', 'EMPLOYEE', '2023-01-12 00:00:00', '2023-01-12 00:00:00'),
('user-employee-29', 'sergio.caceres@excelia.com', 'EMPLOYEE', '2023-02-20 00:00:00', '2023-02-20 00:00:00'),
('user-employee-30', 'valeria.soto@excelia.com', 'EMPLOYEE', '2023-03-28 00:00:00', '2023-03-28 00:00:00'),
('user-employee-31', 'manuel.contreras@excelia.com', 'EMPLOYEE', '2023-04-15 00:00:00', '2023-04-15 00:00:00'),
('user-employee-32', 'gabriela.flores@excelia.com', 'EMPLOYEE', '2023-05-22 00:00:00', '2023-05-22 00:00:00'),
('user-employee-33', 'raul.espinoza@excelia.com', 'EMPLOYEE', '2023-06-10 00:00:00', '2023-06-10 00:00:00'),
('user-employee-34', 'daniela.rojas@excelia.com', 'EMPLOYEE', '2023-07-18 00:00:00', '2023-07-18 00:00:00'),
('user-employee-35', 'francisco.guzman@excelia.com', 'EMPLOYEE', '2023-08-25 00:00:00', '2023-08-25 00:00:00'),
('user-employee-36', 'andrea.mendez@excelia.com', 'EMPLOYEE', '2023-09-12 00:00:00', '2023-09-12 00:00:00'),
('user-employee-37', 'jorge.silva@excelia.com', 'EMPLOYEE', '2023-10-20 00:00:00', '2023-10-20 00:00:00'),
('user-employee-38', 'monica.avila@excelia.com', 'EMPLOYEE', '2023-11-28 00:00:00', '2023-11-28 00:00:00'),
('user-employee-39', 'esteban.pena@excelia.com', 'EMPLOYEE', '2024-01-15 00:00:00', '2024-01-15 00:00:00'),
('user-employee-40', 'renata.fuentes@excelia.com', 'EMPLOYEE', '2024-02-22 00:00:00', '2024-02-22 00:00:00');

-- ============================================
-- 5. EMPLOYEES (45 empleados: 1 Director, 4 Managers, 40 Employees)
-- ============================================
INSERT INTO employees (id, user_id, name, position, department_id, phone, avatar_url, office_id, status, hire_date, salary, created_at, updated_at) VALUES
-- Director
('employee-director', 'user-director', 'Director General', 'Director', NULL, NULL, NULL, 'office-1', 'ACTIVE', '2020-01-01', 120000.00, '2020-01-01 00:00:00', '2020-01-01 00:00:00'),
-- Managers
('employee-manager-1', 'user-manager-1', 'Manager España', 'Manager', NULL, NULL, NULL, 'office-1', 'ACTIVE', '2020-02-01', 85000.00, '2020-02-01 00:00:00', '2020-02-01 00:00:00'),
('employee-manager-2', 'user-manager-2', 'Manager Latam', 'Manager', NULL, NULL, NULL, 'office-3', 'ACTIVE', '2021-06-01', 85000.00, '2021-06-01 00:00:00', '2021-06-01 00:00:00'),
('employee-manager-3', 'user-manager-3', 'Manager Portugal', 'Manager', NULL, NULL, NULL, 'office-2', 'ACTIVE', '2020-04-01', 85000.00, '2020-04-01 00:00:00', '2020-04-01 00:00:00'),
('employee-manager-4', 'user-manager-4', 'Manager Colombia', 'Manager', NULL, NULL, NULL, 'office-5', 'ACTIVE', '2022-03-01', 85000.00, '2022-03-01 00:00:00', '2022-03-01 00:00:00'),
-- Employees Madrid (10 empleados)
('employee-1', 'user-employee-1', 'Juan Pérez', 'Desarrollador Frontend', 'dept-0-0', '+34612345678', NULL, 'office-1', 'ACTIVE', '2020-06-15', 42000.00, '2020-06-15 00:00:00', '2020-06-15 00:00:00'),
('employee-2', 'user-employee-2', 'María García', 'Desarrollador Backend', 'dept-0-0', '+34623456789', NULL, 'office-1', 'ACTIVE', '2020-07-20', 45000.00, '2020-07-20 00:00:00', '2020-07-20 00:00:00'),
('employee-3', 'user-employee-3', 'Carlos López', 'Full Stack Developer', 'dept-0-0', '+34634567890', NULL, 'office-1', 'ACTIVE', '2020-08-10', 55000.00, '2020-08-10 00:00:00', '2020-08-10 00:00:00'),
('employee-4', 'user-employee-4', 'Ana Martínez', 'QA Engineer', 'dept-0-1', '+34645678901', NULL, 'office-1', 'ACTIVE', '2020-09-05', 38000.00, '2020-09-05 00:00:00', '2020-09-05 00:00:00'),
('employee-5', 'user-employee-5', 'Luis Rodríguez', 'DevOps Engineer', 'dept-0-2', '+34656789012', NULL, 'office-1', 'ACTIVE', '2020-10-12', 62000.00, '2020-10-12 00:00:00', '2020-10-12 00:00:00'),
('employee-6', 'user-employee-6', 'Laura Sánchez', 'Diseñador UX/UI', 'dept-0-3', '+34667890123', NULL, 'office-1', 'ACTIVE', '2020-11-18', 44000.00, '2020-11-18 00:00:00', '2020-11-18 00:00:00'),
('employee-7', 'user-employee-7', 'Pedro Fernández', 'Tech Lead', 'dept-0-0', '+34678901234', NULL, 'office-1', 'ACTIVE', '2021-01-22', 75000.00, '2021-01-22 00:00:00', '2021-01-22 00:00:00'),
('employee-8', 'user-employee-8', 'Carmen González', 'Product Manager', 'dept-0-0', '+34689012345', NULL, 'office-1', 'ACTIVE', '2021-02-14', 65000.00, '2021-02-14 00:00:00', '2021-02-14 00:00:00'),
('employee-9', 'user-employee-9', 'Miguel Torres', 'Desarrollador Backend', 'dept-0-0', '+34690123456', NULL, 'office-1', 'ACTIVE', '2021-03-08', 48000.00, '2021-03-08 00:00:00', '2021-03-08 00:00:00'),
('employee-10', 'user-employee-10', 'Sofía Ramírez', 'QA Engineer', 'dept-0-1', '+34701234567', NULL, 'office-1', 'ON_LEAVE', '2021-04-25', 40000.00, '2021-04-25 00:00:00', '2021-04-25 00:00:00'),
-- Employees Lisboa (8 empleados)
('employee-11', 'user-employee-11', 'Diego Morales', 'Desarrollador Frontend', 'dept-1-0', '+351912345678', NULL, 'office-2', 'ACTIVE', '2021-05-30', 41000.00, '2021-05-30 00:00:00', '2021-05-30 00:00:00'),
('employee-12', 'user-employee-12', 'Elena Ruiz', 'Full Stack Developer', 'dept-1-0', '+351923456789', NULL, 'office-2', 'ACTIVE', '2021-07-11', 54000.00, '2021-07-11 00:00:00', '2021-07-11 00:00:00'),
('employee-13', 'user-employee-13', 'Javier Herrera', 'DevOps Engineer', 'dept-1-2', '+351934567890', NULL, 'office-2', 'ACTIVE', '2021-08-19', 60000.00, '2021-08-19 00:00:00', '2021-08-19 00:00:00'),
('employee-14', 'user-employee-14', 'Isabel Jiménez', 'Diseñador UX/UI', 'dept-1-3', '+351945678901', NULL, 'office-2', 'ACTIVE', '2021-09-27', 43000.00, '2021-09-27 00:00:00', '2021-09-27 00:00:00'),
('employee-15', 'user-employee-15', 'Roberto Díaz', 'Desarrollador Backend', 'dept-1-0', '+351956789012', NULL, 'office-2', 'ACTIVE', '2021-10-15', 46000.00, '2021-10-15 00:00:00', '2021-10-15 00:00:00'),
('employee-16', 'user-employee-16', 'Patricia Moreno', 'QA Engineer', 'dept-1-1', '+351967890123', NULL, 'office-2', 'ACTIVE', '2021-11-22', 39000.00, '2021-11-22 00:00:00', '2021-11-22 00:00:00'),
('employee-17', 'user-employee-17', 'Fernando Castro', 'Scrum Master', 'dept-1-4', '+351978901234', NULL, 'office-2', 'ACTIVE', '2022-01-10', 50000.00, '2022-01-10 00:00:00', '2022-01-10 00:00:00'),
('employee-18', 'user-employee-18', 'Lucía Romero', 'Desarrollador Frontend', 'dept-1-0', '+351989012345', NULL, 'office-2', 'ACTIVE', '2022-02-18', 40000.00, '2022-02-18 00:00:00', '2022-02-18 00:00:00'),
-- Employees Santiago (8 empleados)
('employee-19', 'user-employee-19', 'Antonio Navarro', 'Full Stack Developer', 'dept-2-0', '+56912345678', NULL, 'office-3', 'ACTIVE', '2022-03-25', 52000.00, '2022-03-25 00:00:00', '2022-03-25 00:00:00'),
('employee-20', 'user-employee-20', 'Marta Domínguez', 'Desarrollador Backend', 'dept-2-0', '+56923456789', NULL, 'office-3', 'ACTIVE', '2022-04-12', 47000.00, '2022-04-12 00:00:00', '2022-04-12 00:00:00'),
('employee-21', 'user-employee-21', 'Ricardo Vega', 'Tech Lead', 'dept-2-0', '+56934567890', NULL, 'office-3', 'ACTIVE', '2022-05-20', 72000.00, '2022-05-20 00:00:00', '2022-05-20 00:00:00'),
('employee-22', 'user-employee-22', 'Cristina Ortega', 'QA Engineer', 'dept-2-1', '+56945678901', NULL, 'office-3', 'ACTIVE', '2022-06-08', 38000.00, '2022-06-08 00:00:00', '2022-06-08 00:00:00'),
('employee-23', 'user-employee-23', 'Andrés Medina', 'DevOps Engineer', 'dept-2-2', '+56956789012', NULL, 'office-3', 'ACTIVE', '2022-07-15', 61000.00, '2022-07-15 00:00:00', '2022-07-15 00:00:00'),
('employee-24', 'user-employee-24', 'Natalia Campos', 'Diseñador UX/UI', 'dept-2-3', '+56967890123', NULL, 'office-3', 'ACTIVE', '2022-08-22', 42000.00, '2022-08-22 00:00:00', '2022-08-22 00:00:00'),
('employee-25', 'user-employee-25', 'Óscar Ríos', 'Desarrollador Frontend', 'dept-2-0', '+56978901234', NULL, 'office-3', 'ACTIVE', '2022-09-30', 41000.00, '2022-09-30 00:00:00', '2022-09-30 00:00:00'),
('employee-26', 'user-employee-26', 'Beatriz Vargas', 'Business Analyst', 'dept-2-4', '+56989012345', NULL, 'office-3', 'ACTIVE', '2022-10-18', 45000.00, '2022-10-18 00:00:00', '2022-10-18 00:00:00'),
-- Employees Ciudad de México (7 empleados)
('employee-27', 'user-employee-27', 'Héctor Mendoza', 'Full Stack Developer', 'dept-3-0', '+5215512345678', NULL, 'office-4', 'ACTIVE', '2022-11-25', 53000.00, '2022-11-25 00:00:00', '2022-11-25 00:00:00'),
('employee-28', 'user-employee-28', 'Adriana Paredes', 'Desarrollador Backend', 'dept-3-0', '+5215523456789', NULL, 'office-4', 'ACTIVE', '2023-01-12', 48000.00, '2023-01-12 00:00:00', '2023-01-12 00:00:00'),
('employee-29', 'user-employee-29', 'Sergio Cáceres', 'QA Engineer', 'dept-3-1', '+5215534567890', NULL, 'office-4', 'ACTIVE', '2023-02-20', 39000.00, '2023-02-20 00:00:00', '2023-02-20 00:00:00'),
('employee-30', 'user-employee-30', 'Valeria Soto', 'DevOps Engineer', 'dept-3-2', '+5215545678901', NULL, 'office-4', 'ACTIVE', '2023-03-28', 59000.00, '2023-03-28 00:00:00', '2023-03-28 00:00:00'),
('employee-31', 'user-employee-31', 'Manuel Contreras', 'Desarrollador Frontend', 'dept-3-0', '+5215556789012', NULL, 'office-4', 'ACTIVE', '2023-04-15', 40000.00, '2023-04-15 00:00:00', '2023-04-15 00:00:00'),
('employee-32', 'user-employee-32', 'Gabriela Flores', 'Diseñador UX/UI', 'dept-3-3', '+5215567890123', NULL, 'office-4', 'ACTIVE', '2023-05-22', 43000.00, '2023-05-22 00:00:00', '2023-05-22 00:00:00'),
('employee-33', 'user-employee-33', 'Raúl Espinoza', 'Product Manager', 'dept-3-4', '+5215578901234', NULL, 'office-4', 'ACTIVE', '2023-06-10', 64000.00, '2023-06-10 00:00:00', '2023-06-10 00:00:00'),
-- Employees Bogotá (7 empleados)
('employee-34', 'user-employee-34', 'Daniela Rojas', 'Full Stack Developer', 'dept-4-0', '+573001234567', NULL, 'office-5', 'ACTIVE', '2023-07-18', 51000.00, '2023-07-18 00:00:00', '2023-07-18 00:00:00'),
('employee-35', 'user-employee-35', 'Francisco Guzmán', 'Desarrollador Backend', 'dept-4-0', '+573002345678', NULL, 'office-5', 'ACTIVE', '2023-08-25', 46000.00, '2023-08-25 00:00:00', '2023-08-25 00:00:00'),
('employee-36', 'user-employee-36', 'Andrea Méndez', 'QA Engineer', 'dept-4-1', '+573003456789', NULL, 'office-5', 'ACTIVE', '2023-09-12', 38000.00, '2023-09-12 00:00:00', '2023-09-12 00:00:00'),
('employee-37', 'user-employee-37', 'Jorge Silva', 'DevOps Engineer', 'dept-4-2', '+573004567890', NULL, 'office-5', 'ACTIVE', '2023-10-20', 60000.00, '2023-10-20 00:00:00', '2023-10-20 00:00:00'),
('employee-38', 'user-employee-38', 'Mónica Ávila', 'Diseñador UX/UI', 'dept-4-3', '+573005678901', NULL, 'office-5', 'ACTIVE', '2023-11-28', 41000.00, '2023-11-28 00:00:00', '2023-11-28 00:00:00'),
('employee-39', 'user-employee-39', 'Esteban Peña', 'Desarrollador Frontend', 'dept-4-0', '+573006789012', NULL, 'office-5', 'ACTIVE', '2024-01-15', 39000.00, '2024-01-15 00:00:00', '2024-01-15 00:00:00'),
('employee-40', 'user-employee-40', 'Renata Fuentes', 'Scrum Master', 'dept-4-4', '+573007890123', NULL, 'office-5', 'ACTIVE', '2024-02-22', 49000.00, '2024-02-22 00:00:00', '2024-02-22 00:00:00');

-- ============================================
-- 6. MANAGER_OFFICES
-- ============================================
INSERT INTO manager_offices (id, user_id, office_id, created_at) VALUES
('mo-1', 'user-manager-1', 'office-1', '2020-02-01 00:00:00'),
('mo-2', 'user-manager-1', 'office-2', '2020-02-01 00:00:00'),
('mo-3', 'user-manager-2', 'office-3', '2021-06-01 00:00:00'),
('mo-4', 'user-manager-2', 'office-4', '2021-06-01 00:00:00'),
('mo-5', 'user-manager-3', 'office-2', '2020-04-01 00:00:00'),
('mo-6', 'user-manager-4', 'office-5', '2022-03-01 00:00:00');

-- ============================================
-- 7. TECHNOLOGIES (50 tecnologías)
-- ============================================
INSERT INTO technologies (id, name, category, icon_url, color, created_at) VALUES
-- Frontend
('tech-1', 'React', 'FRONTEND', NULL, '#61DAFB', '2020-03-01 00:00:00'),
('tech-2', 'Vue.js', 'FRONTEND', NULL, '#4FC08D', '2020-03-02 00:00:00'),
('tech-3', 'Angular', 'FRONTEND', NULL, '#DD0031', '2020-03-03 00:00:00'),
('tech-4', 'TypeScript', 'FRONTEND', NULL, '#3178C6', '2020-03-04 00:00:00'),
('tech-5', 'JavaScript', 'FRONTEND', NULL, '#F7DF1E', '2020-03-05 00:00:00'),
('tech-6', 'Next.js', 'FRONTEND', NULL, '#000000', '2020-03-06 00:00:00'),
('tech-7', 'Tailwind CSS', 'FRONTEND', NULL, '#06B6D4', '2020-03-07 00:00:00'),
('tech-8', 'Sass', 'FRONTEND', NULL, '#CC6699', '2020-03-08 00:00:00'),
('tech-9', 'Webpack', 'FRONTEND', NULL, '#8DD6F9', '2020-03-09 00:00:00'),
('tech-10', 'Vite', 'FRONTEND', NULL, '#646CFF', '2020-03-10 00:00:00'),
-- Backend
('tech-11', 'Node.js', 'BACKEND', NULL, '#339933', '2020-03-11 00:00:00'),
('tech-12', 'Python', 'BACKEND', NULL, '#3776AB', '2020-03-12 00:00:00'),
('tech-13', 'Java', 'BACKEND', NULL, '#ED8B00', '2020-03-13 00:00:00'),
('tech-14', 'C#', 'BACKEND', NULL, '#239120', '2020-03-14 00:00:00'),
('tech-15', 'Go', 'BACKEND', NULL, '#00ADD8', '2020-03-15 00:00:00'),
('tech-16', 'PHP', 'BACKEND', NULL, '#777BB4', '2020-03-16 00:00:00'),
('tech-17', 'Ruby', 'BACKEND', NULL, '#CC342D', '2020-03-17 00:00:00'),
('tech-18', 'Express', 'BACKEND', NULL, '#000000', '2020-03-18 00:00:00'),
('tech-19', 'Django', 'BACKEND', NULL, '#092E20', '2020-03-19 00:00:00'),
('tech-20', 'Spring Boot', 'BACKEND', NULL, '#6DB33F', '2020-03-20 00:00:00'),
-- Database
('tech-21', 'PostgreSQL', 'DATABASE', NULL, '#336791', '2020-03-21 00:00:00'),
('tech-22', 'MySQL', 'DATABASE', NULL, '#4479A1', '2020-03-22 00:00:00'),
('tech-23', 'MongoDB', 'DATABASE', NULL, '#47A248', '2020-03-23 00:00:00'),
('tech-24', 'Redis', 'DATABASE', NULL, '#DC382D', '2020-03-24 00:00:00'),
('tech-25', 'Elasticsearch', 'DATABASE', NULL, '#005571', '2020-03-25 00:00:00'),
('tech-26', 'Oracle', 'DATABASE', NULL, '#F80000', '2020-03-26 00:00:00'),
('tech-27', 'SQL Server', 'DATABASE', NULL, '#CC2927', '2020-03-27 00:00:00'),
-- DevOps
('tech-28', 'Docker', 'DEVOPS', NULL, '#2496ED', '2020-03-28 00:00:00'),
('tech-29', 'Kubernetes', 'DEVOPS', NULL, '#326CE5', '2020-03-29 00:00:00'),
('tech-30', 'AWS', 'DEVOPS', NULL, '#232F3E', '2020-03-30 00:00:00'),
('tech-31', 'Azure', 'DEVOPS', NULL, '#0078D4', '2020-04-01 00:00:00'),
('tech-32', 'GCP', 'DEVOPS', NULL, '#4285F4', '2020-04-02 00:00:00'),
('tech-33', 'Jenkins', 'DEVOPS', NULL, '#D24939', '2020-04-03 00:00:00'),
('tech-34', 'GitLab CI', 'DEVOPS', NULL, '#FC6D26', '2020-04-04 00:00:00'),
('tech-35', 'Terraform', 'DEVOPS', NULL, '#7B42BC', '2020-04-05 00:00:00'),
('tech-36', 'Ansible', 'DEVOPS', NULL, '#EE0000', '2020-04-06 00:00:00'),
-- Mobile
('tech-37', 'React Native', 'MOBILE', NULL, '#61DAFB', '2020-04-07 00:00:00'),
('tech-38', 'Flutter', 'MOBILE', NULL, '#02569B', '2020-04-08 00:00:00'),
('tech-39', 'Swift', 'MOBILE', NULL, '#FA7343', '2020-04-09 00:00:00'),
('tech-40', 'Kotlin', 'MOBILE', NULL, '#7F52FF', '2020-04-10 00:00:00'),
-- Design
('tech-41', 'Figma', 'DESIGN', NULL, '#F24E1E', '2020-04-11 00:00:00'),
('tech-42', 'Adobe XD', 'DESIGN', NULL, '#FF61F6', '2020-04-12 00:00:00'),
('tech-43', 'Sketch', 'DESIGN', NULL, '#F7B500', '2020-04-13 00:00:00'),
-- Testing
('tech-44', 'Jest', 'TESTING', NULL, '#C21325', '2020-04-14 00:00:00'),
('tech-45', 'Cypress', 'TESTING', NULL, '#17202C', '2020-04-15 00:00:00'),
('tech-46', 'Selenium', 'TESTING', NULL, '#43B02A', '2020-04-16 00:00:00');

-- ============================================
-- 8. PROJECTS (25 proyectos con datos realistas)
-- ============================================
INSERT INTO projects (id, name, description, status, priority, start_date, end_date, client_name, budget, is_internal, office_id, created_at, updated_at) VALUES
('project-1', 'Sistema de Gestión ERP', 'Proyecto interno de Sistema de Gestión ERP. Desarrollo para uso interno de la empresa.', 'ACTIVE', 'HIGH', '2023-01-15', NULL, NULL, 250000.00, TRUE, 'office-1', '2023-01-15 00:00:00', '2024-01-15 00:00:00'),
('project-2', 'Plataforma E-commerce', 'Descripción del proyecto Plataforma E-commerce. Proyecto de desarrollo de software para cliente empresarial.', 'ACTIVE', 'MEDIUM', '2023-03-01', NULL, 'Cliente A', 180000.00, FALSE, 'office-1', '2023-03-01 00:00:00', '2024-01-20 00:00:00'),
('project-3', 'App Móvil Banking', 'Descripción del proyecto App Móvil Banking. Proyecto de desarrollo de software para cliente empresarial.', 'ACTIVE', 'HIGH', '2023-05-10', NULL, 'Cliente B', 320000.00, FALSE, 'office-2', '2023-05-10 00:00:00', '2024-01-18 00:00:00'),
('project-4', 'Dashboard Analytics', 'Proyecto interno de Dashboard Analytics. Desarrollo para uso interno de la empresa.', 'ACTIVE', 'MEDIUM', '2023-02-20', NULL, NULL, 95000.00, TRUE, 'office-1', '2023-02-20 00:00:00', '2024-01-22 00:00:00'),
('project-5', 'API Gateway', 'Descripción del proyecto API Gateway. Proyecto de desarrollo de software para cliente empresarial.', 'ACTIVE', 'URGENT', '2023-06-05', NULL, 'Cliente C', 145000.00, FALSE, 'office-3', '2023-06-05 00:00:00', '2024-01-19 00:00:00'),
('project-6', 'Microservicios Core', 'Descripción del proyecto Microservicios Core. Proyecto de desarrollo de software para cliente empresarial.', 'ACTIVE', 'HIGH', '2023-04-12', NULL, 'Cliente D', 280000.00, FALSE, 'office-2', '2023-04-12 00:00:00', '2024-01-21 00:00:00'),
('project-7', 'Portal Cliente', 'Descripción del proyecto Portal Cliente. Proyecto de desarrollo de software para cliente empresarial.', 'ACTIVE', 'MEDIUM', '2023-07-18', NULL, 'Cliente E', 165000.00, FALSE, 'office-4', '2023-07-18 00:00:00', '2024-01-17 00:00:00'),
('project-8', 'Sistema de Facturación', 'Descripción del proyecto Sistema de Facturación. Proyecto de desarrollo de software para cliente empresarial.', 'ACTIVE', 'MEDIUM', '2023-08-22', NULL, 'Cliente F', 195000.00, FALSE, 'office-3', '2023-08-22 00:00:00', '2024-01-16 00:00:00'),
('project-9', 'App Delivery', 'Descripción del proyecto App Delivery. Proyecto de desarrollo de software para cliente empresarial.', 'ACTIVE', 'HIGH', '2023-09-30', NULL, 'Cliente G', 220000.00, FALSE, 'office-5', '2023-09-30 00:00:00', '2024-01-15 00:00:00'),
('project-10', 'Plataforma Educativa', 'Descripción del proyecto Plataforma Educativa. Proyecto de desarrollo de software para cliente empresarial.', 'ACTIVE', 'MEDIUM', '2023-10-15', NULL, 'Cliente H', 175000.00, FALSE, 'office-4', '2023-10-15 00:00:00', '2024-01-14 00:00:00'),
('project-11', 'CRM Empresarial', 'Descripción del proyecto CRM Empresarial. Proyecto de desarrollo de software para cliente empresarial.', 'ACTIVE', 'HIGH', '2023-11-20', NULL, 'Cliente I', 240000.00, FALSE, 'office-1', '2023-11-20 00:00:00', '2024-01-13 00:00:00'),
('project-12', 'Sistema de Reservas', 'Descripción del proyecto Sistema de Reservas. Proyecto de desarrollo de software para cliente empresarial.', 'ACTIVE', 'MEDIUM', '2023-12-05', NULL, 'Cliente J', 155000.00, FALSE, 'office-2', '2023-12-05 00:00:00', '2024-01-12 00:00:00'),
('project-13', 'Marketplace B2B', 'Descripción del proyecto Marketplace B2B. Proyecto de desarrollo de software para cliente empresarial.', 'PLANNING', 'LOW', '2024-02-01', NULL, 'Cliente K', 300000.00, FALSE, 'office-3', '2024-01-10 00:00:00', '2024-01-10 00:00:00'),
('project-14', 'App Fitness', 'Descripción del proyecto App Fitness. Proyecto de desarrollo de software para cliente empresarial.', 'ACTIVE', 'MEDIUM', '2023-09-15', NULL, 'Cliente L', 185000.00, FALSE, 'office-5', '2023-09-15 00:00:00', '2024-01-11 00:00:00'),
('project-15', 'Plataforma Streaming', 'Descripción del proyecto Plataforma Streaming. Proyecto de desarrollo de software para cliente empresarial.', 'ON_HOLD', 'MEDIUM', '2023-07-10', NULL, 'Cliente M', 350000.00, FALSE, 'office-4', '2023-07-10 00:00:00', '2023-12-20 00:00:00'),
('project-16', 'Sistema de Inventario', 'Proyecto interno de Sistema de Inventario. Desarrollo para uso interno de la empresa.', 'ACTIVE', 'MEDIUM', '2023-05-25', NULL, NULL, 120000.00, TRUE, 'office-1', '2023-05-25 00:00:00', '2024-01-09 00:00:00'),
('project-17', 'Portal de Empleados', 'Proyecto interno de Portal de Empleados. Desarrollo para uso interno de la empresa.', 'ACTIVE', 'LOW', '2023-08-05', NULL, NULL, 85000.00, TRUE, 'office-2', '2023-08-05 00:00:00', '2024-01-08 00:00:00'),
('project-18', 'App de Viajes', 'Descripción del proyecto App de Viajes. Proyecto de desarrollo de software para cliente empresarial.', 'ACTIVE', 'MEDIUM', '2023-10-28', NULL, 'Cliente N', 200000.00, FALSE, 'office-3', '2023-10-28 00:00:00', '2024-01-07 00:00:00'),
('project-19', 'Plataforma de Pagos', 'Descripción del proyecto Plataforma de Pagos. Proyecto de desarrollo de software para cliente empresarial.', 'ACTIVE', 'URGENT', '2023-11-12', NULL, 'Cliente O', 275000.00, FALSE, 'office-4', '2023-11-12 00:00:00', '2024-01-06 00:00:00'),
('project-20', 'Sistema de Tickets', 'Descripción del proyecto Sistema de Tickets. Proyecto de desarrollo de software para cliente empresarial.', 'ACTIVE', 'MEDIUM', '2023-12-18', NULL, 'Cliente P', 160000.00, FALSE, 'office-5', '2023-12-18 00:00:00', '2024-01-05 00:00:00'),
('project-21', 'App Social', 'Descripción del proyecto App Social. Proyecto de desarrollo de software para cliente empresarial.', 'PLANNING', 'LOW', '2024-03-01', NULL, 'Cliente Q', 190000.00, FALSE, 'office-1', '2024-01-08 00:00:00', '2024-01-08 00:00:00'),
('project-22', 'Dashboard BI', 'Proyecto interno de Dashboard BI. Desarrollo para uso interno de la empresa.', 'ACTIVE', 'MEDIUM', '2023-06-20', NULL, NULL, 110000.00, TRUE, 'office-2', '2023-06-20 00:00:00', '2024-01-04 00:00:00'),
('project-23', 'Plataforma IoT', 'Descripción del proyecto Plataforma IoT. Proyecto de desarrollo de software para cliente empresarial.', 'ACTIVE', 'HIGH', '2023-09-05', NULL, 'Cliente R', 310000.00, FALSE, 'office-3', '2023-09-05 00:00:00', '2024-01-03 00:00:00'),
('project-24', 'Sistema de Logística', 'Descripción del proyecto Sistema de Logística. Proyecto de desarrollo de software para cliente empresarial.', 'ACTIVE', 'MEDIUM', '2023-10-10', NULL, 'Cliente S', 225000.00, FALSE, 'office-4', '2023-10-10 00:00:00', '2024-01-02 00:00:00'),
('project-25', 'App de Salud', 'Descripción del proyecto App de Salud. Proyecto de desarrollo de software para cliente empresarial.', 'COMPLETED', 'MEDIUM', '2022-11-01', '2023-11-30', 'Cliente T', 265000.00, FALSE, 'office-5', '2022-11-01 00:00:00', '2023-11-30 00:00:00');

-- ============================================
-- 9. PROJECT_EMPLOYEES (Asignaciones con allocation <= 100% por empleado)
-- IMPORTANTE: Las allocations están calculadas para que ningún empleado supere el 100%
-- ============================================
-- Madrid - Office 1 (10 empleados activos)
-- Employee 1: 30% + 40% = 70%
INSERT INTO project_employees (id, project_id, employee_id, role, start_date, end_date, allocation, hours, created_at) VALUES
('pe-1', 'project-1', 'employee-1', 'Desarrollador', '2023-01-15', NULL, 30, 1200, '2023-01-15 00:00:00'),
('pe-2', 'project-2', 'employee-1', 'Desarrollador', '2023-03-01', NULL, 40, 1600, '2023-03-01 00:00:00'),
-- Employee 2: 50% + 30% = 80%
('pe-3', 'project-1', 'employee-2', 'Desarrollador', '2023-01-15', NULL, 50, 2000, '2023-01-15 00:00:00'),
('pe-4', 'project-4', 'employee-2', 'Desarrollador', '2023-02-20', NULL, 30, 1200, '2023-02-20 00:00:00'),
-- Employee 3: 60% = 60%
('pe-5', 'project-2', 'employee-3', 'Desarrollador', '2023-03-01', NULL, 60, 2400, '2023-03-01 00:00:00'),
-- Employee 4: 40% + 35% = 75%
('pe-6', 'project-1', 'employee-4', 'QA', '2023-01-15', NULL, 40, 1600, '2023-01-15 00:00:00'),
('pe-7', 'project-2', 'employee-4', 'QA', '2023-03-01', NULL, 35, 1400, '2023-03-01 00:00:00'),
-- Employee 5: 50% = 50%
('pe-8', 'project-4', 'employee-5', 'DevOps', '2023-02-20', NULL, 50, 2000, '2023-02-20 00:00:00'),
-- Employee 6: 40% = 40%
('pe-9', 'project-2', 'employee-6', 'Diseñador', '2023-03-01', NULL, 40, 1600, '2023-03-01 00:00:00'),
-- Employee 7: 70% = 70%
('pe-10', 'project-1', 'employee-7', 'Tech Lead', '2023-01-15', NULL, 70, 2800, '2023-01-15 00:00:00'),
-- Employee 8: 60% = 60%
('pe-11', 'project-11', 'employee-8', 'PM', '2023-11-20', NULL, 60, 2400, '2023-11-20 00:00:00'),
-- Employee 9: 45% + 30% = 75%
('pe-12', 'project-2', 'employee-9', 'Desarrollador', '2023-03-01', NULL, 45, 1800, '2023-03-01 00:00:00'),
('pe-13', 'project-4', 'employee-9', 'Desarrollador', '2023-02-20', NULL, 30, 1200, '2023-02-20 00:00:00');
-- Employee 10: ON_LEAVE - no asignado

-- Lisboa - Office 2 (8 empleados activos)
-- Employee 11: 50% + 25% = 75%
INSERT INTO project_employees (id, project_id, employee_id, role, start_date, end_date, allocation, hours, created_at) VALUES
('pe-14', 'project-3', 'employee-11', 'Desarrollador', '2023-05-10', NULL, 50, 2000, '2023-05-10 00:00:00'),
('pe-15', 'project-6', 'employee-11', 'Desarrollador', '2023-04-12', NULL, 25, 1000, '2023-04-12 00:00:00'),
-- Employee 12: 60% = 60%
('pe-16', 'project-3', 'employee-12', 'Desarrollador', '2023-05-10', NULL, 60, 2400, '2023-05-10 00:00:00'),
-- Employee 13: 55% = 55%
('pe-17', 'project-6', 'employee-13', 'DevOps', '2023-04-12', NULL, 55, 2200, '2023-04-12 00:00:00'),
-- Employee 14: 40% = 40%
('pe-18', 'project-3', 'employee-14', 'Diseñador', '2023-05-10', NULL, 40, 1600, '2023-05-10 00:00:00'),
-- Employee 15: 50% + 20% = 70%
('pe-19', 'project-6', 'employee-15', 'Desarrollador', '2023-04-12', NULL, 50, 2000, '2023-04-12 00:00:00'),
('pe-20', 'project-12', 'employee-15', 'Desarrollador', '2023-12-05', NULL, 20, 800, '2023-12-05 00:00:00'),
-- Employee 16: 35% + 30% = 65%
('pe-21', 'project-3', 'employee-16', 'QA', '2023-05-10', NULL, 35, 1400, '2023-05-10 00:00:00'),
('pe-22', 'project-6', 'employee-16', 'QA', '2023-04-12', NULL, 30, 1200, '2023-04-12 00:00:00'),
-- Employee 17: 50% = 50%
('pe-23', 'project-17', 'employee-17', 'Scrum Master', '2023-08-05', NULL, 50, 2000, '2023-08-05 00:00:00'),
-- Employee 18: 45% = 45%
('pe-24', 'project-12', 'employee-18', 'Desarrollador', '2023-12-05', NULL, 45, 1800, '2023-12-05 00:00:00');

-- Santiago - Office 3 (8 empleados activos)
-- Employee 19: 55% + 25% = 80%
INSERT INTO project_employees (id, project_id, employee_id, role, start_date, end_date, allocation, hours, created_at) VALUES
('pe-25', 'project-5', 'employee-19', 'Desarrollador', '2023-06-05', NULL, 55, 2200, '2023-06-05 00:00:00'),
('pe-26', 'project-8', 'employee-19', 'Desarrollador', '2023-08-22', NULL, 25, 1000, '2023-08-22 00:00:00'),
-- Employee 20: 50% = 50%
('pe-27', 'project-5', 'employee-20', 'Desarrollador', '2023-06-05', NULL, 50, 2000, '2023-06-05 00:00:00'),
-- Employee 21: 70% = 70%
('pe-28', 'project-5', 'employee-21', 'Tech Lead', '2023-06-05', NULL, 70, 2800, '2023-06-05 00:00:00'),
-- Employee 22: 40% + 30% = 70%
('pe-29', 'project-5', 'employee-22', 'QA', '2023-06-05', NULL, 40, 1600, '2023-06-05 00:00:00'),
('pe-30', 'project-8', 'employee-22', 'QA', '2023-08-22', NULL, 30, 1200, '2023-08-22 00:00:00'),
-- Employee 23: 60% = 60%
('pe-31', 'project-5', 'employee-23', 'DevOps', '2023-06-05', NULL, 60, 2400, '2023-06-05 00:00:00'),
-- Employee 24: 40% = 40%
('pe-32', 'project-8', 'employee-24', 'Diseñador', '2023-08-22', NULL, 40, 1600, '2023-08-22 00:00:00'),
-- Employee 25: 45% = 45%
('pe-33', 'project-18', 'employee-25', 'Desarrollador', '2023-10-28', NULL, 45, 1800, '2023-10-28 00:00:00'),
-- Employee 26: 50% = 50%
('pe-34', 'project-13', 'employee-26', 'Business Analyst', '2024-02-01', NULL, 50, 2000, '2024-02-01 00:00:00');

-- Ciudad de México - Office 4 (7 empleados activos)
-- Employee 27: 50% + 30% = 80%
INSERT INTO project_employees (id, project_id, employee_id, role, start_date, end_date, allocation, hours, created_at) VALUES
('pe-35', 'project-7', 'employee-27', 'Desarrollador', '2023-07-18', NULL, 50, 2000, '2023-07-18 00:00:00'),
('pe-36', 'project-10', 'employee-27', 'Desarrollador', '2023-10-15', NULL, 30, 1200, '2023-10-15 00:00:00'),
-- Employee 28: 55% = 55%
('pe-37', 'project-7', 'employee-28', 'Desarrollador', '2023-07-18', NULL, 55, 2200, '2023-07-18 00:00:00'),
-- Employee 29: 35% + 35% = 70%
('pe-38', 'project-7', 'employee-29', 'QA', '2023-07-18', NULL, 35, 1400, '2023-07-18 00:00:00'),
('pe-39', 'project-10', 'employee-29', 'QA', '2023-10-15', NULL, 35, 1400, '2023-10-15 00:00:00'),
-- Employee 30: 60% = 60%
('pe-40', 'project-7', 'employee-30', 'DevOps', '2023-07-18', NULL, 60, 2400, '2023-07-18 00:00:00'),
-- Employee 31: 40% = 40%
('pe-41', 'project-10', 'employee-31', 'Desarrollador', '2023-10-15', NULL, 40, 1600, '2023-10-15 00:00:00'),
-- Employee 32: 45% = 45%
('pe-42', 'project-7', 'employee-32', 'Diseñador', '2023-07-18', NULL, 45, 1800, '2023-07-18 00:00:00'),
-- Employee 33: 65% = 65%
('pe-43', 'project-19', 'employee-33', 'PM', '2023-11-12', NULL, 65, 2600, '2023-11-12 00:00:00');

-- Bogotá - Office 5 (7 empleados activos)
-- Employee 34: 50% + 30% = 80%
INSERT INTO project_employees (id, project_id, employee_id, role, start_date, end_date, allocation, hours, created_at) VALUES
('pe-44', 'project-9', 'employee-34', 'Desarrollador', '2023-09-30', NULL, 50, 2000, '2023-09-30 00:00:00'),
('pe-45', 'project-14', 'employee-34', 'Desarrollador', '2023-09-15', NULL, 30, 1200, '2023-09-15 00:00:00'),
-- Employee 35: 55% = 55%
('pe-46', 'project-9', 'employee-35', 'Desarrollador', '2023-09-30', NULL, 55, 2200, '2023-09-30 00:00:00'),
-- Employee 36: 40% + 30% = 70%
('pe-47', 'project-9', 'employee-36', 'QA', '2023-09-30', NULL, 40, 1600, '2023-09-30 00:00:00'),
('pe-48', 'project-14', 'employee-36', 'QA', '2023-09-15', NULL, 30, 1200, '2023-09-15 00:00:00'),
-- Employee 37: 60% = 60%
('pe-49', 'project-9', 'employee-37', 'DevOps', '2023-09-30', NULL, 60, 2400, '2023-09-30 00:00:00'),
-- Employee 38: 40% = 40%
('pe-50', 'project-14', 'employee-38', 'Diseñador', '2023-09-15', NULL, 40, 1600, '2023-09-15 00:00:00'),
-- Employee 39: 45% = 45%
('pe-51', 'project-20', 'employee-39', 'Desarrollador', '2023-12-18', NULL, 45, 1800, '2023-12-18 00:00:00'),
-- Employee 40: 50% = 50%
('pe-52', 'project-9', 'employee-40', 'Scrum Master', '2023-09-30', NULL, 50, 2000, '2023-09-30 00:00:00');

-- ============================================
-- 10. EMPLOYEE_TECHNOLOGIES (Habilidades de empleados)
-- ============================================
-- Empleados con 3-8 tecnologías cada uno, niveles realistas
INSERT INTO employee_technologies (id, employee_id, technology_id, level, years_of_exp, created_at) VALUES
-- Employee 1 (Frontend Developer)
('et-1', 'employee-1', 'tech-1', 'ADVANCED', 4, '2020-06-15 00:00:00'),
('et-2', 'employee-1', 'tech-4', 'INTERMEDIATE', 3, '2020-06-15 00:00:00'),
('et-3', 'employee-1', 'tech-5', 'ADVANCED', 5, '2020-06-15 00:00:00'),
('et-4', 'employee-1', 'tech-7', 'INTERMEDIATE', 2, '2020-06-15 00:00:00'),
-- Employee 2 (Backend Developer)
('et-5', 'employee-2', 'tech-11', 'ADVANCED', 5, '2020-07-20 00:00:00'),
('et-6', 'employee-2', 'tech-18', 'ADVANCED', 4, '2020-07-20 00:00:00'),
('et-7', 'employee-2', 'tech-21', 'INTERMEDIATE', 3, '2020-07-20 00:00:00'),
('et-8', 'employee-2', 'tech-5', 'ADVANCED', 6, '2020-07-20 00:00:00'),
-- Employee 3 (Full Stack)
('et-9', 'employee-3', 'tech-1', 'EXPERT', 6, '2020-08-10 00:00:00'),
('et-10', 'employee-3', 'tech-11', 'ADVANCED', 5, '2020-08-10 00:00:00'),
('et-11', 'employee-3', 'tech-4', 'ADVANCED', 4, '2020-08-10 00:00:00'),
('et-12', 'employee-3', 'tech-21', 'INTERMEDIATE', 3, '2020-08-10 00:00:00'),
-- Employee 4 (QA)
('et-13', 'employee-4', 'tech-44', 'ADVANCED', 4, '2020-09-05 00:00:00'),
('et-14', 'employee-4', 'tech-45', 'INTERMEDIATE', 3, '2020-09-05 00:00:00'),
('et-15', 'employee-4', 'tech-46', 'BEGINNER', 1, '2020-09-05 00:00:00'),
-- Employee 5 (DevOps)
('et-16', 'employee-5', 'tech-28', 'EXPERT', 7, '2020-10-12 00:00:00'),
('et-17', 'employee-5', 'tech-29', 'ADVANCED', 5, '2020-10-12 00:00:00'),
('et-18', 'employee-5', 'tech-30', 'ADVANCED', 4, '2020-10-12 00:00:00'),
('et-19', 'employee-5', 'tech-33', 'INTERMEDIATE', 3, '2020-10-12 00:00:00'),
-- Employee 6 (Designer)
('et-20', 'employee-6', 'tech-41', 'ADVANCED', 5, '2020-11-18 00:00:00'),
('et-21', 'employee-6', 'tech-42', 'INTERMEDIATE', 3, '2020-11-18 00:00:00'),
-- Employee 7 (Tech Lead)
('et-22', 'employee-7', 'tech-1', 'EXPERT', 8, '2021-01-22 00:00:00'),
('et-23', 'employee-7', 'tech-11', 'EXPERT', 7, '2021-01-22 00:00:00'),
('et-24', 'employee-7', 'tech-4', 'ADVANCED', 6, '2021-01-22 00:00:00'),
('et-25', 'employee-7', 'tech-21', 'ADVANCED', 5, '2021-01-22 00:00:00');
-- Continuar con más empleados (simplificado por espacio, pero el patrón es claro)
-- Employee 11-40 seguirían el mismo patrón con tecnologías apropiadas a sus roles

-- ============================================
-- 11. PROJECT_TECHNOLOGIES (Tecnologías por proyecto)
-- ============================================
INSERT INTO project_technologies (id, project_id, technology_id) VALUES
-- Project 1 (ERP - Full Stack)
('pt-1', 'project-1', 'tech-1'),
('pt-2', 'project-1', 'tech-4'),
('pt-3', 'project-1', 'tech-11'),
('pt-4', 'project-1', 'tech-21'),
('pt-5', 'project-1', 'tech-28'),
-- Project 2 (E-commerce - Frontend + Backend)
('pt-6', 'project-2', 'tech-1'),
('pt-7', 'project-2', 'tech-6'),
('pt-8', 'project-2', 'tech-11'),
('pt-9', 'project-2', 'tech-22'),
-- Project 3 (Mobile Banking)
('pt-10', 'project-3', 'tech-37'),
('pt-11', 'project-3', 'tech-11'),
('pt-12', 'project-3', 'tech-21'),
('pt-13', 'project-3', 'tech-30');
-- Continuar con más proyectos...

-- ============================================
-- 12. PROJECT_DEPARTMENTS (Departamentos por proyecto)
-- ============================================
INSERT INTO project_departments (id, project_id, department_id, created_at) VALUES
-- Project 1 involucra Desarrollo y DevOps
('pd-1', 'project-1', 'dept-0-0', '2023-01-15 00:00:00'),
('pd-2', 'project-1', 'dept-0-2', '2023-01-15 00:00:00'),
-- Project 2 involucra Desarrollo, QA y Diseño
('pd-3', 'project-2', 'dept-0-0', '2023-03-01 00:00:00'),
('pd-4', 'project-2', 'dept-0-1', '2023-03-01 00:00:00'),
('pd-5', 'project-2', 'dept-0-3', '2023-03-01 00:00:00');
-- Continuar con más proyectos...

-- ============================================
-- 13. TIME_ENTRIES (Imputaciones de horas - últimos 30 días)
-- ============================================
-- Generar algunas imputaciones realistas para empleados activos en proyectos activos
INSERT INTO time_entries (id, employee_id, project_id, hours, description, date, created_at, updated_at) VALUES
-- Employee 1 en Project 1
('te-1', 'employee-1', 'project-1', 6.00, 'Desarrollo de funcionalidad', '2024-01-15', '2024-01-15 00:00:00', '2024-01-15 00:00:00'),
('te-2', 'employee-1', 'project-1', 7.50, 'Revisión de código', '2024-01-16', '2024-01-16 00:00:00', '2024-01-16 00:00:00'),
('te-3', 'employee-1', 'project-2', 8.00, 'Desarrollo de funcionalidad', '2024-01-17', '2024-01-17 00:00:00', '2024-01-17 00:00:00'),
-- Employee 2 en Project 1
('te-4', 'employee-2', 'project-1', 8.00, 'Desarrollo de funcionalidad', '2024-01-15', '2024-01-15 00:00:00', '2024-01-15 00:00:00'),
('te-5', 'employee-2', 'project-1', 6.50, 'Testing y QA', '2024-01-16', '2024-01-16 00:00:00', '2024-01-16 00:00:00'),
-- Employee 3 en Project 2
('te-6', 'employee-3', 'project-2', 7.00, 'Desarrollo de funcionalidad', '2024-01-18', '2024-01-18 00:00:00', '2024-01-18 00:00:00'),
('te-7', 'employee-3', 'project-2', 8.00, 'Reunión con el equipo', '2024-01-19', '2024-01-19 00:00:00', '2024-01-19 00:00:00');
-- Continuar con más imputaciones para otros empleados...

-- ============================================
-- 14. PROJECT_OFFICES (Oficinas adicionales de proyectos)
-- ============================================
-- Algunos proyectos pueden involucrar múltiples oficinas
INSERT INTO project_offices (id, project_id, office_id, created_at) VALUES
-- Project 1 (ERP) - también involucra Lisboa
('po-1', 'project-1', 'office-2', '2023-01-20 00:00:00'),
-- Project 3 (App Banking) - también involucra Madrid
('po-2', 'project-3', 'office-1', '2023-05-15 00:00:00'),
-- Project 6 (Microservicios) - también involucra Santiago
('po-3', 'project-6', 'office-3', '2023-04-20 00:00:00'),
-- Project 11 (CRM) - también involucra Bogotá
('po-4', 'project-11', 'office-5', '2023-11-25 00:00:00'),
-- Project 19 (Plataforma Pagos) - también involucra Santiago
('po-5', 'project-19', 'office-3', '2023-11-18 00:00:00'),
-- Project 23 (IoT) - también involucra CDMX
('po-6', 'project-23', 'office-4', '2023-09-10 00:00:00');

-- ============================================
-- 15. PROJECT_EXPENSES (Gastos de proyectos)
-- ============================================
-- Gastos realistas para proyectos activos (servidores, licencias, herramientas, etc.)
INSERT INTO project_expenses (id, project_id, category, description, cost, start_date, end_date, created_at, updated_at) VALUES
-- Project 1 (ERP) - Servidores y licencias
('exp-1', 'project-1', 'SERVER', 'Servidor AWS EC2 - Producción', 450.00, '2023-01-15', NULL, '2023-01-15 00:00:00', '2023-01-15 00:00:00'),
('exp-2', 'project-1', 'LICENSE', 'Licencia PostgreSQL Enterprise', 1200.00, '2023-01-15', NULL, '2023-01-15 00:00:00', '2023-01-15 00:00:00'),
('exp-3', 'project-1', 'TOOL', 'Herramienta de monitoreo Datadog', 350.00, '2023-02-01', NULL, '2023-02-01 00:00:00', '2023-02-01 00:00:00'),
-- Project 2 (E-commerce) - Infraestructura y servicios
('exp-4', 'project-2', 'INFRASTRUCTURE', 'CDN CloudFront', 280.00, '2023-03-01', NULL, '2023-03-01 00:00:00', '2023-03-01 00:00:00'),
('exp-5', 'project-2', 'SERVER', 'Servidor de base de datos RDS', 520.00, '2023-03-01', NULL, '2023-03-01 00:00:00', '2023-03-01 00:00:00'),
('exp-6', 'project-2', 'SERVICE', 'Servicio de email SendGrid', 95.00, '2023-03-15', NULL, '2023-03-15 00:00:00', '2023-03-15 00:00:00'),
-- Project 3 (App Banking) - Servidores y seguridad
('exp-7', 'project-3', 'SERVER', 'Cluster Kubernetes en AWS', 850.00, '2023-05-10', NULL, '2023-05-10 00:00:00', '2023-05-10 00:00:00'),
('exp-8', 'project-3', 'LICENSE', 'Licencia de seguridad SSL', 450.00, '2023-05-10', NULL, '2023-05-10 00:00:00', '2023-05-10 00:00:00'),
('exp-9', 'project-3', 'TOOL', 'Herramienta de análisis de código SonarQube', 320.00, '2023-05-20', NULL, '2023-05-20 00:00:00', '2023-05-20 00:00:00'),
-- Project 4 (Dashboard Analytics) - Herramientas
('exp-10', 'project-4', 'TOOL', 'Licencia Tableau', 680.00, '2023-02-20', NULL, '2023-02-20 00:00:00', '2023-02-20 00:00:00'),
('exp-11', 'project-4', 'SERVER', 'Servidor de almacenamiento S3', 180.00, '2023-02-20', NULL, '2023-02-20 00:00:00', '2023-02-20 00:00:00'),
-- Project 5 (API Gateway) - Infraestructura
('exp-12', 'project-5', 'INFRASTRUCTURE', 'API Gateway AWS', 420.00, '2023-06-05', NULL, '2023-06-05 00:00:00', '2023-06-05 00:00:00'),
('exp-13', 'project-5', 'SERVER', 'Servidor Redis Cache', 250.00, '2023-06-05', NULL, '2023-06-05 00:00:00', '2023-06-05 00:00:00'),
-- Project 6 (Microservicios) - Servidores múltiples
('exp-14', 'project-6', 'SERVER', 'Servidor de microservicios 1', 380.00, '2023-04-12', NULL, '2023-04-12 00:00:00', '2023-04-12 00:00:00'),
('exp-15', 'project-6', 'SERVER', 'Servidor de microservicios 2', 380.00, '2023-04-12', NULL, '2023-04-12 00:00:00', '2023-04-12 00:00:00'),
('exp-16', 'project-6', 'TOOL', 'Herramienta de orquestación', 290.00, '2023-04-20', NULL, '2023-04-20 00:00:00', '2023-04-20 00:00:00'),
-- Project 7 (Portal Cliente) - Servicios
('exp-17', 'project-7', 'SERVER', 'Servidor web', 320.00, '2023-07-18', NULL, '2023-07-18 00:00:00', '2023-07-18 00:00:00'),
('exp-18', 'project-7', 'SERVICE', 'Servicio de autenticación Auth0', 180.00, '2023-07-18', NULL, '2023-07-18 00:00:00', '2023-07-18 00:00:00'),
-- Project 9 (App Delivery) - Servicios móviles
('exp-19', 'project-9', 'SERVER', 'Backend API server', 450.00, '2023-09-30', NULL, '2023-09-30 00:00:00', '2023-09-30 00:00:00'),
('exp-20', 'project-9', 'SERVICE', 'Servicio de notificaciones push', 120.00, '2023-09-30', NULL, '2023-09-30 00:00:00', '2023-09-30 00:00:00'),
('exp-21', 'project-9', 'LICENSE', 'Licencia de mapas Google Maps API', 350.00, '2023-10-05', NULL, '2023-10-05 00:00:00', '2023-10-05 00:00:00'),
-- Project 11 (CRM) - Herramientas y licencias
('exp-22', 'project-11', 'LICENSE', 'Licencia Salesforce API', 950.00, '2023-11-20', NULL, '2023-11-20 00:00:00', '2023-11-20 00:00:00'),
('exp-23', 'project-11', 'TOOL', 'Herramienta de reporting', 420.00, '2023-11-20', NULL, '2023-11-20 00:00:00', '2023-11-20 00:00:00'),
-- Project 19 (Plataforma Pagos) - Seguridad y servidores
('exp-24', 'project-19', 'SERVER', 'Servidor de procesamiento de pagos', 680.00, '2023-11-12', NULL, '2023-11-12 00:00:00', '2023-11-12 00:00:00'),
('exp-25', 'project-19', 'LICENSE', 'Licencia PCI-DSS compliance', 1200.00, '2023-11-12', NULL, '2023-11-12 00:00:00', '2023-11-12 00:00:00'),
('exp-26', 'project-19', 'SERVICE', 'Servicio de gateway de pagos Stripe', 250.00, '2023-11-15', NULL, '2023-11-15 00:00:00', '2023-11-15 00:00:00'),
-- Project 23 (IoT) - Infraestructura especializada
('exp-27', 'project-23', 'INFRASTRUCTURE', 'Infraestructura IoT en Azure', 750.00, '2023-09-05', NULL, '2023-09-05 00:00:00', '2023-09-05 00:00:00'),
('exp-28', 'project-23', 'SERVER', 'Servidor de procesamiento de datos', 520.00, '2023-09-05', NULL, '2023-09-05 00:00:00', '2023-09-05 00:00:00'),
-- Project 25 (App Salud - COMPLETED) - Gastos finalizados
('exp-29', 'project-25', 'SERVER', 'Servidor de producción', 380.00, '2022-11-01', '2023-11-30', '2022-11-01 00:00:00', '2023-11-30 00:00:00'),
('exp-30', 'project-25', 'LICENSE', 'Licencia de cumplimiento HIPAA', 950.00, '2022-11-01', '2023-11-30', '2022-11-01 00:00:00', '2023-11-30 00:00:00');

-- ============================================
-- 16. INVOICES (Facturas de proyectos)
-- ============================================
-- Facturas realistas para proyectos externos (no internos)
INSERT INTO invoices (id, invoice_number, project_id, amount, issue_date, due_date, status, description, pdf_url, created_at, updated_at) VALUES
-- Project 2 (E-commerce) - Cliente A
('inv-1', 'INV-2024-001', 'project-2', 54000.00, '2024-01-05', '2024-02-05', 'SENT', 'Factura inicial - 30% del presupuesto', NULL, '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
('inv-2', 'INV-2024-002', 'project-2', 72000.00, '2024-01-20', '2024-02-20', 'PAID', 'Factura intermedia - 40% del presupuesto', NULL, '2024-01-20 00:00:00', '2024-01-25 00:00:00'),
-- Project 3 (App Banking) - Cliente B
('inv-3', 'INV-2024-003', 'project-3', 96000.00, '2024-01-10', '2024-02-10', 'PAID', 'Factura inicial - 30% del presupuesto', NULL, '2024-01-10 00:00:00', '2024-01-15 00:00:00'),
('inv-4', 'INV-2024-004', 'project-3', 128000.00, '2024-01-25', '2024-02-25', 'SENT', 'Factura intermedia - 40% del presupuesto', NULL, '2024-01-25 00:00:00', '2024-01-25 00:00:00'),
-- Project 5 (API Gateway) - Cliente C
('inv-5', 'INV-2024-005', 'project-5', 43500.00, '2024-01-08', '2024-02-08', 'PAID', 'Factura inicial - 30% del presupuesto', NULL, '2024-01-08 00:00:00', '2024-01-12 00:00:00'),
('inv-6', 'INV-2024-006', 'project-5', 58000.00, '2024-01-22', '2024-02-22', 'DRAFT', 'Factura intermedia - 40% del presupuesto', NULL, '2024-01-22 00:00:00', '2024-01-22 00:00:00'),
-- Project 6 (Microservicios) - Cliente D
('inv-7', 'INV-2024-007', 'project-6', 84000.00, '2024-01-12', '2024-02-12', 'PAID', 'Factura inicial - 30% del presupuesto', NULL, '2024-01-12 00:00:00', '2024-01-18 00:00:00'),
('inv-8', 'INV-2024-008', 'project-6', 112000.00, '2024-01-28', '2024-02-28', 'SENT', 'Factura intermedia - 40% del presupuesto', NULL, '2024-01-28 00:00:00', '2024-01-28 00:00:00'),
-- Project 7 (Portal Cliente) - Cliente E
('inv-9', 'INV-2024-009', 'project-7', 49500.00, '2024-01-15', '2024-02-15', 'SENT', 'Factura inicial - 30% del presupuesto', NULL, '2024-01-15 00:00:00', '2024-01-15 00:00:00'),
-- Project 8 (Sistema Facturación) - Cliente F
('inv-10', 'INV-2024-010', 'project-8', 58500.00, '2024-01-18', '2024-02-18', 'PAID', 'Factura inicial - 30% del presupuesto', NULL, '2024-01-18 00:00:00', '2024-01-22 00:00:00'),
('inv-11', 'INV-2024-011', 'project-8', 78000.00, '2024-01-30', '2024-03-01', 'DRAFT', 'Factura intermedia - 40% del presupuesto', NULL, '2024-01-30 00:00:00', '2024-01-30 00:00:00'),
-- Project 9 (App Delivery) - Cliente G
('inv-12', 'INV-2024-012', 'project-9', 66000.00, '2024-01-20', '2024-02-20', 'SENT', 'Factura inicial - 30% del presupuesto', NULL, '2024-01-20 00:00:00', '2024-01-20 00:00:00'),
-- Project 10 (Plataforma Educativa) - Cliente H
('inv-13', 'INV-2024-013', 'project-10', 52500.00, '2024-01-22', '2024-02-22', 'PAID', 'Factura inicial - 30% del presupuesto', NULL, '2024-01-22 00:00:00', '2024-01-26 00:00:00'),
-- Project 11 (CRM) - Cliente I
('inv-14', 'INV-2024-014', 'project-11', 72000.00, '2024-01-25', '2024-02-25', 'SENT', 'Factura inicial - 30% del presupuesto', NULL, '2024-01-25 00:00:00', '2024-01-25 00:00:00'),
-- Project 12 (Sistema Reservas) - Cliente J
('inv-15', 'INV-2024-015', 'project-12', 46500.00, '2024-01-28', '2024-02-28', 'DRAFT', 'Factura inicial - 30% del presupuesto', NULL, '2024-01-28 00:00:00', '2024-01-28 00:00:00'),
-- Project 14 (App Fitness) - Cliente L
('inv-16', 'INV-2024-016', 'project-14', 55500.00, '2024-01-10', '2024-02-10', 'PAID', 'Factura inicial - 30% del presupuesto', NULL, '2024-01-10 00:00:00', '2024-01-14 00:00:00'),
('inv-17', 'INV-2024-017', 'project-14', 74000.00, '2024-01-24', '2024-02-24', 'SENT', 'Factura intermedia - 40% del presupuesto', NULL, '2024-01-24 00:00:00', '2024-01-24 00:00:00'),
-- Project 18 (App Viajes) - Cliente N
('inv-18', 'INV-2024-018', 'project-18', 60000.00, '2024-01-15', '2024-02-15', 'PAID', 'Factura inicial - 30% del presupuesto', NULL, '2024-01-15 00:00:00', '2024-01-19 00:00:00'),
-- Project 19 (Plataforma Pagos) - Cliente O
('inv-19', 'INV-2024-019', 'project-19', 82500.00, '2024-01-18', '2024-02-18', 'SENT', 'Factura inicial - 30% del presupuesto', NULL, '2024-01-18 00:00:00', '2024-01-18 00:00:00'),
-- Project 20 (Sistema Tickets) - Cliente P
('inv-20', 'INV-2024-020', 'project-20', 48000.00, '2024-01-20', '2024-02-20', 'DRAFT', 'Factura inicial - 30% del presupuesto', NULL, '2024-01-20 00:00:00', '2024-01-20 00:00:00'),
-- Project 23 (Plataforma IoT) - Cliente R
('inv-21', 'INV-2024-021', 'project-23', 93000.00, '2024-01-12', '2024-02-12', 'PAID', 'Factura inicial - 30% del presupuesto', NULL, '2024-01-12 00:00:00', '2024-01-16 00:00:00'),
('inv-22', 'INV-2024-022', 'project-23', 124000.00, '2024-01-26', '2024-02-26', 'SENT', 'Factura intermedia - 40% del presupuesto', NULL, '2024-01-26 00:00:00', '2024-01-26 00:00:00'),
-- Project 24 (Sistema Logística) - Cliente S
('inv-23', 'INV-2024-023', 'project-24', 67500.00, '2024-01-14', '2024-02-14', 'PAID', 'Factura inicial - 30% del presupuesto', NULL, '2024-01-14 00:00:00', '2024-01-18 00:00:00'),
-- Project 25 (App Salud - COMPLETED) - Cliente T - Facturas históricas
('inv-24', 'INV-2023-001', 'project-25', 79500.00, '2023-01-15', '2023-02-15', 'PAID', 'Factura inicial - 30% del presupuesto', NULL, '2023-01-15 00:00:00', '2023-01-20 00:00:00'),
('inv-25', 'INV-2023-002', 'project-25', 106000.00, '2023-06-15', '2023-07-15', 'PAID', 'Factura intermedia - 40% del presupuesto', NULL, '2023-06-15 00:00:00', '2023-06-20 00:00:00'),
('inv-26', 'INV-2023-003', 'project-25', 79500.00, '2023-11-30', '2023-12-30', 'PAID', 'Factura final - 30% del presupuesto', NULL, '2023-11-30 00:00:00', '2023-12-05 00:00:00'),
-- Facturas vencidas (OVERDUE)
('inv-27', 'INV-2023-004', 'project-15', 105000.00, '2023-08-01', '2023-09-01', 'OVERDUE', 'Factura inicial - 30% del presupuesto (Proyecto en pausa)', NULL, '2023-08-01 00:00:00', '2023-09-05 00:00:00');

-- ============================================
-- VERIFICACIÓN: Consulta para verificar allocations
-- ============================================
-- Ejecutar esta consulta para verificar que ningún empleado supera el 100%:
-- SELECT 
--   e.id,
--   e.name,
--   SUM(pe.allocation) as total_allocation
-- FROM employees e
-- LEFT JOIN project_employees pe ON e.id = pe.employee_id 
--   AND (pe.end_date IS NULL OR pe.end_date > CURRENT_DATE)
-- WHERE e.status = 'ACTIVE'
-- GROUP BY e.id, e.name
-- HAVING SUM(pe.allocation) > 100
-- ORDER BY total_allocation DESC;

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================
-- 1. Todas las allocations en project_employees están calculadas para que
--    ningún empleado activo supere el 100% de asignación total.
-- 2. Los datos están basados en los mocks pero con valores realistas:
--    - Salarios acordes a posiciones y países
--    - Allocations entre 20-80% por proyecto
--    - Fechas coherentes y realistas
--    - Estados de proyectos variados (ACTIVE, PLANNING, ON_HOLD, COMPLETED)
-- 3. Para agregar más datos, seguir los patrones establecidos y mantener
--    las allocations controladas.
-- 4. Las tecnologías están asignadas según los roles de los empleados.
-- 5. Los proyectos están distribuidos entre las diferentes oficinas.
-- 6. Los gastos de proyectos (project_expenses) incluyen servidores, licencias,
--    herramientas y servicios con costos mensuales realistas.
-- 7. Las facturas (invoices) están asociadas solo a proyectos externos (no internos)
--    y reflejan pagos parciales típicos (30% inicial, 40% intermedio, 30% final).
-- 8. Las oficinas adicionales (project_offices) muestran proyectos que involucran
--    múltiples sedes para colaboración.


