-- ============================================
-- SCHEMA DE BASE DE DATOS - EXCELIA
-- Generado basado en mock-data.ts
-- ============================================

-- ============================================
-- ENUMS / TIPOS
-- ============================================

CREATE TYPE user_role AS ENUM ('EMPLOYEE', 'MANAGER', 'DIRECTOR');
CREATE TYPE employee_status AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED');
CREATE TYPE project_status AS ENUM ('PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED');
CREATE TYPE priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE tech_category AS ENUM ('FRONTEND', 'BACKEND', 'DATABASE', 'DEVOPS', 'MOBILE', 'DESIGN', 'TESTING', 'OTHER');
CREATE TYPE skill_level AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');
CREATE TYPE invoice_status AS ENUM ('DRAFT', 'SENT', 'PAID', 'OVERDUE');
CREATE TYPE expense_category AS ENUM ('SERVER', 'INFRASTRUCTURE', 'LICENSE', 'TOOL', 'SERVICE', 'OTHER');

-- ============================================
-- TABLAS PRINCIPALES
-- ============================================

-- 1. Company (Empresa)
CREATE TABLE companies (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Offices (Sedes)
CREATE TABLE offices (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  address TEXT,
  timezone VARCHAR(100) NOT NULL,
  company_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_office_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE INDEX idx_offices_company ON offices(company_id);

-- 3. Departments (Departamentos)
CREATE TABLE departments (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  office_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_department_office FOREIGN KEY (office_id) REFERENCES offices(id) ON DELETE CASCADE
);

CREATE INDEX idx_departments_office ON departments(office_id);

-- 4. Users (Usuarios)
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  role user_role NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- 5. Employees (Empleados)
CREATE TABLE employees (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  department_id VARCHAR(50),
  phone VARCHAR(50),
  avatar_url TEXT,
  office_id VARCHAR(50) NOT NULL,
  status employee_status NOT NULL DEFAULT 'ACTIVE',
  hire_date DATE NOT NULL,
  salary DECIMAL(12, 2),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_employee_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_employee_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  CONSTRAINT fk_employee_office FOREIGN KEY (office_id) REFERENCES offices(id) ON DELETE CASCADE
);

CREATE INDEX idx_employees_user ON employees(user_id);
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_office ON employees(office_id);
CREATE INDEX idx_employees_status ON employees(status);

-- 6. ManagerOffice (Asignación de Managers a Oficinas)
CREATE TABLE manager_offices (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  office_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_manager_office_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_manager_office_office FOREIGN KEY (office_id) REFERENCES offices(id) ON DELETE CASCADE,
  CONSTRAINT uk_manager_office UNIQUE (user_id, office_id)
);

CREATE INDEX idx_manager_offices_user ON manager_offices(user_id);
CREATE INDEX idx_manager_offices_office ON manager_offices(office_id);

-- 7. Technologies (Tecnologías)
CREATE TABLE technologies (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  category tech_category NOT NULL,
  icon_url TEXT,
  color VARCHAR(7),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_technologies_category ON technologies(category);

-- 8. Projects (Proyectos)
CREATE TABLE projects (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status project_status NOT NULL DEFAULT 'PLANNING',
  priority priority NOT NULL DEFAULT 'MEDIUM',
  start_date DATE NOT NULL,
  end_date DATE,
  client_name VARCHAR(255),
  budget DECIMAL(15, 2),
  is_internal BOOLEAN DEFAULT FALSE,
  office_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_project_office FOREIGN KEY (office_id) REFERENCES offices(id) ON DELETE CASCADE,
  CONSTRAINT chk_project_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE INDEX idx_projects_office ON projects(office_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_priority ON projects(priority);
CREATE INDEX idx_projects_internal ON projects(is_internal);

-- ============================================
-- TABLAS DE RELACIÓN (Many-to-Many)
-- ============================================

-- 9. ProjectEmployee (Relación Proyecto-Empleado)
CREATE TABLE project_employees (
  id VARCHAR(50) PRIMARY KEY,
  project_id VARCHAR(50) NOT NULL,
  employee_id VARCHAR(50) NOT NULL,
  role VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  allocation INTEGER NOT NULL CHECK (allocation >= 0 AND allocation <= 100),
  hours INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_project_employee_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_project_employee_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  CONSTRAINT chk_project_employee_dates CHECK (end_date IS NULL OR end_date >= start_date),
  CONSTRAINT uk_project_employee UNIQUE (project_id, employee_id, start_date)
);

CREATE INDEX idx_project_employees_project ON project_employees(project_id);
CREATE INDEX idx_project_employees_employee ON project_employees(employee_id);

-- 10. EmployeeTechnology (Relación Empleado-Tecnología)
CREATE TABLE employee_technologies (
  id VARCHAR(50) PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL,
  technology_id VARCHAR(50) NOT NULL,
  level skill_level NOT NULL,
  years_of_exp INTEGER NOT NULL CHECK (years_of_exp >= 0),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_employee_technology_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  CONSTRAINT fk_employee_technology_technology FOREIGN KEY (technology_id) REFERENCES technologies(id) ON DELETE CASCADE,
  CONSTRAINT uk_employee_technology UNIQUE (employee_id, technology_id)
);

CREATE INDEX idx_employee_technologies_employee ON employee_technologies(employee_id);
CREATE INDEX idx_employee_technologies_technology ON employee_technologies(technology_id);

-- 11. ProjectTechnology (Relación Proyecto-Tecnología)
CREATE TABLE project_technologies (
  id VARCHAR(50) PRIMARY KEY,
  project_id VARCHAR(50) NOT NULL,
  technology_id VARCHAR(50) NOT NULL,
  CONSTRAINT fk_project_technology_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_project_technology_technology FOREIGN KEY (technology_id) REFERENCES technologies(id) ON DELETE CASCADE,
  CONSTRAINT uk_project_technology UNIQUE (project_id, technology_id)
);

CREATE INDEX idx_project_technologies_project ON project_technologies(project_id);
CREATE INDEX idx_project_technologies_technology ON project_technologies(technology_id);

-- 12. ProjectDepartment (Relación Proyecto-Departamento)
CREATE TABLE project_departments (
  id VARCHAR(50) PRIMARY KEY,
  project_id VARCHAR(50) NOT NULL,
  department_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_project_department_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_project_department_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
  CONSTRAINT uk_project_department UNIQUE (project_id, department_id)
);

CREATE INDEX idx_project_departments_project ON project_departments(project_id);
CREATE INDEX idx_project_departments_department ON project_departments(department_id);

-- 13. TimeEntries (Imputaciones de Horas)
CREATE TABLE time_entries (
  id VARCHAR(50) PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL,
  project_id VARCHAR(50) NOT NULL,
  hours DECIMAL(5, 2) NOT NULL CHECK (hours > 0 AND hours <= 24),
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_time_entry_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  CONSTRAINT fk_time_entry_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX idx_time_entries_employee ON time_entries(employee_id);
CREATE INDEX idx_time_entries_project ON time_entries(project_id);
CREATE INDEX idx_time_entries_date ON time_entries(date);
CREATE INDEX idx_time_entries_employee_date ON time_entries(employee_id, date);

-- 14. ProjectOffice (Relación Proyecto-Oficina Adicional)
CREATE TABLE project_offices (
  id VARCHAR(50) PRIMARY KEY,
  project_id VARCHAR(50) NOT NULL,
  office_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_project_office_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_project_office_office FOREIGN KEY (office_id) REFERENCES offices(id) ON DELETE CASCADE,
  CONSTRAINT uk_project_office UNIQUE (project_id, office_id)
);

CREATE INDEX idx_project_offices_project ON project_offices(project_id);
CREATE INDEX idx_project_offices_office ON project_offices(office_id);

-- 15. ProjectExpenses (Gastos de Proyectos)
CREATE TABLE project_expenses (
  id VARCHAR(50) PRIMARY KEY,
  project_id VARCHAR(50) NOT NULL,
  category expense_category NOT NULL,
  description VARCHAR(255) NOT NULL,
  cost DECIMAL(12, 2) NOT NULL CHECK (cost >= 0),
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_project_expense_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT chk_project_expense_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE INDEX idx_project_expenses_project ON project_expenses(project_id);
CREATE INDEX idx_project_expenses_category ON project_expenses(category);

-- 16. Invoices (Facturas)
CREATE TABLE invoices (
  id VARCHAR(50) PRIMARY KEY,
  invoice_number VARCHAR(255) NOT NULL UNIQUE,
  project_id VARCHAR(50) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL CHECK (amount >= 0),
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status invoice_status NOT NULL DEFAULT 'DRAFT',
  description TEXT,
  pdf_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_invoice_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT chk_invoice_dates CHECK (due_date >= issue_date)
);

CREATE INDEX idx_invoices_project ON invoices(project_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);

-- ============================================
-- TRIGGERS PARA UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offices_updated_at BEFORE UPDATE ON offices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_entries_updated_at BEFORE UPDATE ON time_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_expenses_updated_at BEFORE UPDATE ON project_expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista: Empleados con información completa
CREATE OR REPLACE VIEW v_employees_full AS
SELECT 
  e.id,
  e.name,
  e.position,
  e.status,
  e.hire_date,
  e.salary,
  u.email,
  u.role as user_role,
  o.name as office_name,
  o.country as office_country,
  d.name as department_name,
  e.created_at,
  e.updated_at
FROM employees e
INNER JOIN users u ON e.user_id = u.id
INNER JOIN offices o ON e.office_id = o.id
LEFT JOIN departments d ON e.department_id = d.id;

-- Vista: Proyectos con información completa
CREATE OR REPLACE VIEW v_projects_full AS
SELECT 
  p.id,
  p.name,
  p.description,
  p.status,
  p.priority,
  p.start_date,
  p.end_date,
  p.client_name,
  p.budget,
  p.is_internal,
  o.name as office_name,
  o.country as office_country,
  COUNT(DISTINCT pe.employee_id) as total_employees,
  COUNT(DISTINCT pt.technology_id) as total_technologies,
  COUNT(DISTINCT pd.department_id) as total_departments,
  COALESCE(SUM(te.hours), 0) as total_hours_logged,
  p.created_at,
  p.updated_at
FROM projects p
INNER JOIN offices o ON p.office_id = o.id
LEFT JOIN project_employees pe ON p.id = pe.project_id
LEFT JOIN project_technologies pt ON p.id = pt.project_id
LEFT JOIN project_departments pd ON p.id = pd.project_id
LEFT JOIN time_entries te ON p.id = te.project_id
GROUP BY p.id, o.name, o.country;

-- Vista: Estadísticas de empleados por tecnología
CREATE OR REPLACE VIEW v_employee_tech_stats AS
SELECT 
  t.id as technology_id,
  t.name as technology_name,
  t.category,
  COUNT(DISTINCT et.employee_id) as total_employees,
  COUNT(CASE WHEN et.level = 'EXPERT' THEN 1 END) as expert_count,
  COUNT(CASE WHEN et.level = 'ADVANCED' THEN 1 END) as advanced_count,
  COUNT(CASE WHEN et.level = 'INTERMEDIATE' THEN 1 END) as intermediate_count,
  COUNT(CASE WHEN et.level = 'BEGINNER' THEN 1 END) as beginner_count,
  AVG(et.years_of_exp) as avg_years_experience
FROM technologies t
LEFT JOIN employee_technologies et ON t.id = et.technology_id
GROUP BY t.id, t.name, t.category;

-- ============================================
-- COMENTARIOS EN TABLAS
-- ============================================

COMMENT ON TABLE companies IS 'Tabla principal de empresas';
COMMENT ON TABLE offices IS 'Sedes u oficinas de la empresa';
COMMENT ON TABLE departments IS 'Departamentos dentro de cada oficina';
COMMENT ON TABLE users IS 'Usuarios del sistema con roles';
COMMENT ON TABLE employees IS 'Empleados de la empresa con información detallada';
COMMENT ON TABLE manager_offices IS 'Asignación de managers a oficinas';
COMMENT ON TABLE technologies IS 'Catálogo de tecnologías utilizadas';
COMMENT ON TABLE projects IS 'Proyectos internos y externos';
COMMENT ON TABLE project_employees IS 'Asignación de empleados a proyectos';
COMMENT ON TABLE employee_technologies IS 'Habilidades tecnológicas de los empleados';
COMMENT ON TABLE project_technologies IS 'Tecnologías utilizadas en proyectos';
COMMENT ON TABLE project_departments IS 'Departamentos involucrados en proyectos';
COMMENT ON TABLE time_entries IS 'Registro de horas imputadas por empleados en proyectos';
COMMENT ON TABLE project_offices IS 'Oficinas adicionales involucradas en proyectos';
COMMENT ON TABLE project_expenses IS 'Gastos asociados a proyectos (servidores, licencias, etc.)';
COMMENT ON TABLE invoices IS 'Facturas emitidas para proyectos';

