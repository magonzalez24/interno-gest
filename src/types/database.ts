export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
  DIRECTOR = 'DIRECTOR'
}

export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  TERMINATED = 'TERMINATED'
}

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum TechCategory {
  FRONTEND = 'FRONTEND',
  BACKEND = 'BACKEND',
  DATABASE = 'DATABASE',
  DEVOPS = 'DEVOPS',
  MOBILE = 'MOBILE',
  DESIGN = 'DESIGN',
  TESTING = 'TESTING',
  OTHER = 'OTHER'
}

export enum SkillLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Office {
  id: string;
  name: string;
  country: string;
  address?: string;
  timezone: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  officeId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Employee {
  id: string;
  userId: string;
  name: string;
  position: string;
  departmentId?: string;
  phone?: string;
  avatarUrl?: string;
  officeId: string;
  status: EmployeeStatus;
  hireDate: Date;
  salary?: number; // Salario bruto anual
  createdAt: Date;
  updatedAt: Date;
  // Relations (populated)
  user?: User;
  office?: Office;
  department?: Department;
  projects?: ProjectEmployee[];
  technologies?: EmployeeTechnology[];
}

export interface ManagerOffice {
  id: string;
  userId: string;
  officeId: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  priority: Priority;
  startDate: Date;
  endDate?: Date;
  clientName?: string;
  budget?: number;
  isInternal?: boolean; // true para proyectos internos, false para externos
  officeId: string;
  createdAt: Date;
  updatedAt: Date;
  // Relations (populated)
  office?: Office;
  departments?: ProjectDepartment[];
  employees?: ProjectEmployee[];
  technologies?: ProjectTechnology[];
}

export interface Technology {
  id: string;
  name: string;
  category: TechCategory;
  iconUrl?: string;
  color?: string;
  createdAt: Date;
}

export interface ProjectEmployee {
  id: string;
  projectId: string;
  employeeId: string;
  role: string;
  startDate: Date;
  endDate?: Date;
  allocation: number; // 0-100
  hours?: number; // Horas imputadas al proyecto
  createdAt: Date;
  // Relations
  project?: Project;
  employee?: Employee;
}

export interface EmployeeTechnology {
  id: string;
  employeeId: string;
  technologyId: string;
  level: SkillLevel;
  yearsOfExp: number;
  createdAt: Date;
  // Relations
  employee?: Employee;
  technology?: Technology;
}

export interface ProjectTechnology {
  id: string;
  projectId: string;
  technologyId: string;
  // Relations
  project?: Project;
  technology?: Technology;
}

export interface ProjectDepartment {
  id: string;
  projectId: string;
  departmentId: string;
  createdAt: Date;
  // Relations
  project?: Project;
  department?: Department;
}

export interface TimeEntry {
  id: string;
  employeeId: string;
  projectId: string;
  hours: number;
  description?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  employee?: Employee;
  project?: Project;
}

export interface DashboardStats {
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

