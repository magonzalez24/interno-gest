import { API_BASE_URL, getAuthToken, setAuthToken, removeAuthToken } from './config';
import type { Api } from '../types/api';
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
  TimeEntry,
  ProjectExpense,
  ProjectStatus,
  DashboardStats,
} from '../types/database';

// Helper para hacer peticiones HTTP
const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  // Asegurar que el endpoint empiece con /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${normalizedEndpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    const errorMessage = error.error || `Error ${response.status}: ${response.statusText}`;
    console.error(`API Error [${url}]:`, errorMessage);
    throw new Error(errorMessage);
  }

  // Si la respuesta es 204 (No Content), retornar void
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
};

// Helper para formatear fechas a ISO string (YYYY-MM-DD)
const formatDate = (date: Date | string | undefined): string | undefined => {
  if (!date) return undefined;
  if (typeof date === 'string') {
    // Si ya es una string, verificar formato
    if (date.includes('T')) {
      return date.split('T')[0];
    }
    return date;
  }
  // Convertir Date a YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const api: Api = {
  // Auth
  login: async (email: string, password: string) => {
    const response = await fetchApi<{ token: string } & User & { employee?: Employee }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );

    // Guardar token si viene en la respuesta
    if (response.token) {
      setAuthToken(response.token);
      // Remover token del objeto de respuesta
      const { token, ...userData } = response;
      return userData;
    }

    return response;
  },

  logout: async () => {
    try {
      await fetchApi('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      removeAuthToken();
    }
  },

  getCurrentUser: async () => {
    return fetchApi<User & { employee?: Employee }>('/auth/me');
  },

  // Offices
  getOffices: async () => {
    return fetchApi<Office[]>('/offices');
  },

  getOfficeById: async (id: string) => {
    return fetchApi<Office>(`/offices/${id}`);
  },

  getUserOffices: async (userId: string) => {
    return fetchApi<Office[]>(`/users/${userId}/offices`);
  },

  createOffice: async (data: Partial<Office>) => {
    return fetchApi<Office>('/offices', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateOffice: async (id: string, data: Partial<Office>) => {
    return fetchApi<Office>(`/offices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Departments
  getDepartments: async (officeId?: string) => {
    const query = officeId ? `?officeId=${officeId}` : '';
    return fetchApi<Department[]>(`/departments${query}`);
  },

  getDepartmentById: async (id: string) => {
    return fetchApi<Department>(`/departments/${id}`);
  },

  createDepartment: async (data: Partial<Department>) => {
    return fetchApi<Department>('/departments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateDepartment: async (id: string, data: Partial<Department>) => {
    return fetchApi<Department>(`/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteDepartment: async (id: string) => {
    return fetchApi<void>(`/departments/${id}`, {
      method: 'DELETE',
    });
  },

  // Employees
  getEmployees: async (filters?: { officeId?: string; departmentId?: string }) => {
    const params = new URLSearchParams();
    if (filters?.officeId) params.append('officeId', filters.officeId);
    if (filters?.departmentId) params.append('departmentId', filters.departmentId);
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchApi<Employee[]>(`/employees${query}`);
  },

  getEmployeeById: async (id: string) => {
    return fetchApi<Employee>(`/employees/${id}`);
  },

  createEmployee: async (data: Partial<Employee>) => {
    return fetchApi<Employee>('/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateEmployee: async (id: string, data: Partial<Employee>) => {
    return fetchApi<Employee>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteEmployee: async (id: string) => {
    return fetchApi<void>(`/employees/${id}`, {
      method: 'DELETE',
    });
  },

  // Projects
  getProjects: async (filters?: { officeId?: string; status?: ProjectStatus }) => {
    const params = new URLSearchParams();
    if (filters?.officeId) params.append('officeId', filters.officeId);
    if (filters?.status) params.append('status', filters.status);
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchApi<Project[]>(`/projects${query}`);
  },

  getProjectById: async (id: string) => {
    return fetchApi<Project>(`/projects/${id}`);
  },

  createProject: async (data: Partial<Project>) => {
    const body = {
      ...data,
      startDate: formatDate(data.startDate),
      endDate: formatDate(data.endDate),
    };
    return fetchApi<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  updateProject: async (id: string, data: Partial<Project>) => {
    const body = {
      ...data,
      startDate: data.startDate ? formatDate(data.startDate) : undefined,
      endDate: data.endDate ? formatDate(data.endDate) : undefined,
    };
    return fetchApi<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  deleteProject: async (id: string) => {
    return fetchApi<void>(`/projects/${id}`, {
      method: 'DELETE',
    });
  },

  // Technologies
  getTechnologies: async () => {
    return fetchApi<Technology[]>('/technologies');
  },

  getTechnologyById: async (id: string) => {
    return fetchApi<Technology>(`/technologies/${id}`);
  },

  getTechnologyStats: async (id: string) => {
    return fetchApi<{ employeeCount: number; projectCount: number }>(`/technologies/${id}/stats`);
  },

  getTechnologyEmployees: async (id: string) => {
    return fetchApi<EmployeeTechnology[]>(`/technologies/${id}/employees`);
  },

  getTechnologyProjects: async (id: string) => {
    return fetchApi<ProjectTechnology[]>(`/technologies/${id}/projects`);
  },

  createTechnology: async (data: Partial<Technology>) => {
    return fetchApi<Technology>('/technologies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateTechnology: async (id: string, data: Partial<Technology>) => {
    return fetchApi<Technology>(`/technologies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteTechnology: async (id: string) => {
    return fetchApi<void>(`/technologies/${id}`, {
      method: 'DELETE',
    });
  },

  // Relations
  assignEmployeeToProject: async (data: Partial<ProjectEmployee>) => {
    const body = {
      ...data,
      startDate: formatDate(data.startDate),
      endDate: data.endDate ? formatDate(data.endDate) : undefined,
    };
    return fetchApi<ProjectEmployee>(`/projects/${data.projectId}/employees`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  removeEmployeeFromProject: async (projectId: string, employeeId: string) => {
    return fetchApi<void>(`/projects/${projectId}/employees/${employeeId}`, {
      method: 'DELETE',
    });
  },

  addTechnologyToEmployee: async (data: Partial<EmployeeTechnology>) => {
    return fetchApi<EmployeeTechnology>(`/employees/${data.employeeId}/technologies`, {
      method: 'POST',
      body: JSON.stringify({
        technologyId: data.technologyId,
        level: data.level,
        yearsOfExp: data.yearsOfExp,
      }),
    });
  },

  addDepartmentToProject: async (data: Partial<ProjectDepartment>) => {
    return fetchApi<ProjectDepartment>(`/projects/${data.projectId}/departments`, {
      method: 'POST',
      body: JSON.stringify({
        departmentId: data.departmentId,
      }),
    });
  },

  addTechnologyToProject: async (data: Partial<ProjectTechnology>) => {
    return fetchApi<ProjectTechnology>(`/projects/${data.projectId}/technologies`, {
      method: 'POST',
      body: JSON.stringify({
        technologyId: data.technologyId,
      }),
    });
  },

  // Analytics/Dashboard
  getDashboardStats: async (officeIds?: string[]) => {
    const params = new URLSearchParams();
    if (officeIds && officeIds.length > 0) {
      officeIds.forEach(id => params.append('officeIds', id));
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchApi<DashboardStats>(`/dashboard/stats${query}`);
  },

  // Time Entries
  getTimeEntries: async (employeeId?: string) => {
    const query = employeeId ? `?employeeId=${employeeId}` : '';
    return fetchApi<TimeEntry[]>(`/time-entries${query}`);
  },

  getTimeEntryById: async (id: string) => {
    return fetchApi<TimeEntry>(`/time-entries/${id}`);
  },

  createTimeEntry: async (data: Partial<TimeEntry>) => {
    const body = {
      ...data,
      date: formatDate(data.date),
    };
    return fetchApi<TimeEntry>('/time-entries', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  updateTimeEntry: async (id: string, data: Partial<TimeEntry>) => {
    const body = {
      ...data,
      date: data.date ? formatDate(data.date) : undefined,
    };
    return fetchApi<TimeEntry>(`/time-entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  deleteTimeEntry: async (id: string) => {
    return fetchApi<void>(`/time-entries/${id}`, {
      method: 'DELETE',
    });
  },

  // Project Expenses
  getProjectExpenses: async (projectId: string) => {
    return fetchApi<ProjectExpense[]>(`/projects/${projectId}/expenses`);
  },

  getProjectExpenseById: async (id: string) => {
    return fetchApi<ProjectExpense>(`/projects/expenses/${id}`);
  },

  createProjectExpense: async (data: Partial<ProjectExpense>) => {
    const body = {
      ...data,
      startDate: formatDate(data.startDate),
      endDate: data.endDate ? formatDate(data.endDate) : undefined,
    };
    return fetchApi<ProjectExpense>(`/projects/${data.projectId}/expenses`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  updateProjectExpense: async (id: string, data: Partial<ProjectExpense>) => {
    const body = {
      ...data,
      startDate: data.startDate ? formatDate(data.startDate) : undefined,
      endDate: data.endDate ? formatDate(data.endDate) : undefined,
    };
    return fetchApi<ProjectExpense>(`/projects/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  deleteProjectExpense: async (id: string) => {
    return fetchApi<void>(`/projects/expenses/${id}`, {
      method: 'DELETE',
    });
  },

  // Users
  getUsers: async () => {
    return fetchApi<User[]>('/users');
  },

  // Invoices
  getProjectInvoices: async (projectId: string) => {
    return fetchApi<any[]>(`/projects/${projectId}/invoices`);
  },

  getInvoiceById: async (id: string) => {
    return fetchApi<any>(`/projects/invoices/${id}`);
  },

  createInvoice: async (projectId: string, data: Partial<any>) => {
    const body = {
      ...data,
      issueDate: formatDate(data.issueDate),
      dueDate: formatDate(data.dueDate),
    };
    return fetchApi<any>(`/projects/${projectId}/invoices`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  updateInvoice: async (id: string, data: Partial<any>) => {
    const body = {
      ...data,
      issueDate: data.issueDate ? formatDate(data.issueDate) : undefined,
      dueDate: data.dueDate ? formatDate(data.dueDate) : undefined,
    };
    return fetchApi<any>(`/projects/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  deleteInvoice: async (id: string) => {
    return fetchApi<void>(`/projects/invoices/${id}`, {
      method: 'DELETE',
    });
  },
};

