import type { 
  User, 
  Employee, 
  Office, 
  Department, 
  Project, 
  Technology,
  ProjectEmployee,
  EmployeeTechnology,
  ProjectDepartment,
  ProjectTechnology,
  ProjectStatus,
  DashboardStats,
  TimeEntry,
  ProjectExpense
} from './database';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface MockApi {
  // Auth
  login: (email: string, password: string) => Promise<User & { employee?: Employee }>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<User & { employee?: Employee }>;
  
  // Offices
  getOffices: () => Promise<Office[]>;
  getOfficeById: (id: string) => Promise<Office>;
  getUserOffices: (userId: string) => Promise<Office[]>;
  createOffice: (data: Partial<Office>) => Promise<Office>;
  updateOffice: (id: string, data: Partial<Office>) => Promise<Office>;
  
  // Departments
  getDepartments: (officeId?: string) => Promise<Department[]>;
  getDepartmentById: (id: string) => Promise<Department>;
  createDepartment: (data: Partial<Department>) => Promise<Department>;
  updateDepartment: (id: string, data: Partial<Department>) => Promise<Department>;
  deleteDepartment: (id: string) => Promise<void>;
  
  // Employees
  getEmployees: (filters?: { officeId?: string; departmentId?: string }) => Promise<Employee[]>;
  getEmployeeById: (id: string) => Promise<Employee>;
  createEmployee: (data: Partial<Employee>) => Promise<Employee>;
  updateEmployee: (id: string, data: Partial<Employee>) => Promise<Employee>;
  deleteEmployee: (id: string) => Promise<void>;
  
  // Projects
  getProjects: (filters?: { officeId?: string; status?: ProjectStatus }) => Promise<Project[]>;
  getProjectById: (id: string) => Promise<Project>;
  createProject: (data: Partial<Project>) => Promise<Project>;
  updateProject: (id: string, data: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  
  // Technologies
  getTechnologies: () => Promise<Technology[]>;
  getTechnologyById: (id: string) => Promise<Technology>;
  createTechnology: (data: Partial<Technology>) => Promise<Technology>;
  updateTechnology: (id: string, data: Partial<Technology>) => Promise<Technology>;
  deleteTechnology: (id: string) => Promise<void>;
  
  // Relations
  assignEmployeeToProject: (data: Partial<ProjectEmployee>) => Promise<ProjectEmployee>;
  removeEmployeeFromProject: (projectId: string, employeeId: string) => Promise<void>;
  addTechnologyToEmployee: (data: Partial<EmployeeTechnology>) => Promise<EmployeeTechnology>;
  addDepartmentToProject: (data: Partial<ProjectDepartment>) => Promise<ProjectDepartment>;
  addTechnologyToProject: (data: Partial<ProjectTechnology>) => Promise<ProjectTechnology>;
  
  // Analytics/Dashboard
  getDashboardStats: (officeIds?: string[]) => Promise<DashboardStats>;
  
  // Time Entries
  getTimeEntries: (employeeId?: string) => Promise<TimeEntry[]>;
  getTimeEntryById: (id: string) => Promise<TimeEntry>;
  createTimeEntry: (data: Partial<TimeEntry>) => Promise<TimeEntry>;
  updateTimeEntry: (id: string, data: Partial<TimeEntry>) => Promise<TimeEntry>;
  deleteTimeEntry: (id: string) => Promise<void>;
  
  // Project Expenses
  getProjectExpenses: (projectId: string) => Promise<ProjectExpense[]>;
  getProjectExpenseById: (id: string) => Promise<ProjectExpense>;
  createProjectExpense: (data: Partial<ProjectExpense>) => Promise<ProjectExpense>;
  updateProjectExpense: (id: string, data: Partial<ProjectExpense>) => Promise<ProjectExpense>;
  deleteProjectExpense: (id: string) => Promise<void>;
}

