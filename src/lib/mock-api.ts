import { delay } from './utils';
import {
  mockUsers,
  mockEmployees,
  mockOffices,
  mockDepartments,
  mockProjects,
  mockTechnologies,
  mockProjectEmployees,
  mockEmployeeTechnologies,
  mockProjectTechnologies,
  mockProjectDepartments,
  mockManagerOffices,
  mockTimeEntries,
  populateRelations,
  generateId,
} from './mock-data';
import { ProjectStatus, UserRole } from '../types/database';
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
} from '../types/database';
import type { MockApi } from '../types/api';

// Simular delay de red
const randomDelay = () => delay(Math.floor(Math.random() * 500) + 300);

// Helper para encontrar usuario por email (sin relaciones circulares)
const findUserByEmail = (email: string): (User & { employee?: Employee }) | null => {
  const user = mockUsers.find(u => u.email === email);
  if (!user) return null;
  
  const employee = mockEmployees.find(e => e.userId === user.id);
  if (!employee) {
    return { ...user };
  }
  
  // Crear versión limpia del employee sin relaciones circulares
  const cleanEmployee: Employee = {
    ...employee,
    // Solo incluir referencias básicas, no las relaciones pobladas que causan círculos
    user: undefined,
    office: employee.office ? {
      id: employee.office.id,
      name: employee.office.name,
      country: employee.office.country,
      address: employee.office.address,
      timezone: employee.office.timezone,
      companyId: employee.office.companyId,
      createdAt: employee.office.createdAt,
      updatedAt: employee.office.updatedAt,
    } : undefined,
    department: employee.department ? {
      id: employee.department.id,
      name: employee.department.name,
      description: employee.department.description,
      officeId: employee.department.officeId,
      createdAt: employee.department.createdAt,
      updatedAt: employee.department.updatedAt,
    } : undefined,
    projects: undefined, // Excluir proyectos para evitar círculos
    technologies: undefined, // Excluir tecnologías para evitar círculos
  };
  
  return { ...user, employee: cleanEmployee };
};

// Helper para verificar password (mock - siempre acepta "password123")
const verifyPassword = (password: string): boolean => {
  return password === 'password123';
};

export const mockApi: MockApi = {
  // Auth
  login: async (email: string, password: string) => {
    await randomDelay();
    
    if (!verifyPassword(password)) {
      throw new Error('Credenciales inválidas');
    }
    
    const userData = findUserByEmail(email);
    if (!userData) {
      throw new Error('Usuario no encontrado');
    }
    
    // Guardar en localStorage (userData ya está limpio sin relaciones circulares)
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    return userData;
  },

  logout: async () => {
    await randomDelay();
    localStorage.removeItem('currentUser');
  },

  getCurrentUser: async () => {
    await randomDelay();
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      return JSON.parse(stored);
    }
    throw new Error('No hay usuario autenticado');
  },

  // Offices
  getOffices: async () => {
    await randomDelay();
    return [...mockOffices];
  },

  getOfficeById: async (id: string) => {
    await randomDelay();
    const office = mockOffices.find(o => o.id === id);
    if (!office) throw new Error('Sede no encontrada');
    return office;
  },

  getUserOffices: async (userId: string) => {
    await randomDelay();
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return [];
    
    if (user.role === UserRole.DIRECTOR) {
      return [...mockOffices];
    }
    
    if (user.role === UserRole.MANAGER) {
      const managerOffices = mockManagerOffices
        .filter(mo => mo.userId === userId)
        .map(mo => mockOffices.find(o => o.id === mo.officeId))
        .filter((o): o is Office => o !== undefined);
      return managerOffices;
    }
    
    // EMPLOYEE - solo su sede
    const employee = mockEmployees.find(e => e.userId === userId);
    if (employee) {
      const office = mockOffices.find(o => o.id === employee.officeId);
      return office ? [office] : [];
    }
    
    return [];
  },

  // Departments
  getDepartments: async (officeId?: string) => {
    await randomDelay();
    let depts = [...mockDepartments];
    if (officeId) {
      depts = depts.filter(d => d.officeId === officeId);
    }
    return depts;
  },

  getDepartmentById: async (id: string) => {
    await randomDelay();
    const dept = mockDepartments.find(d => d.id === id);
    if (!dept) throw new Error('Departamento no encontrado');
    return dept;
  },

  createDepartment: async (data: Partial<Department>) => {
    await randomDelay();
    const newDept: Department = {
      id: `dept-${Date.now()}`,
      name: data.name || 'Nuevo Departamento',
      description: data.description,
      officeId: data.officeId || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDepartments.push(newDept);
    return newDept;
  },

  updateDepartment: async (id: string, data: Partial<Department>) => {
    await randomDelay();
    const index = mockDepartments.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Departamento no encontrado');
    
    mockDepartments[index] = {
      ...mockDepartments[index],
      ...data,
      updatedAt: new Date(),
    };
    return mockDepartments[index];
  },

  deleteDepartment: async (id: string) => {
    await randomDelay();
    const index = mockDepartments.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Departamento no encontrado');
    mockDepartments.splice(index, 1);
  },

  // Employees
  getEmployees: async (filters?: { officeId?: string; departmentId?: string }) => {
    await randomDelay();
    populateRelations();
    let employees = [...mockEmployees];
    
    if (filters?.officeId) {
      employees = employees.filter(e => e.officeId === filters.officeId);
    }
    
    if (filters?.departmentId) {
      employees = employees.filter(e => e.departmentId === filters.departmentId);
    }
    
    return employees;
  },

  getEmployeeById: async (id: string) => {
    await randomDelay();
    populateRelations();
    const employee = mockEmployees.find(e => e.id === id);
    if (!employee) throw new Error('Empleado no encontrado');
    return employee;
  },

  createEmployee: async (data: Partial<Employee>) => {
    await randomDelay();
    const newEmployee: Employee = {
      id: `employee-${Date.now()}`,
      userId: data.userId || '',
      name: data.name || 'Nuevo Empleado',
      position: data.position || '',
      departmentId: data.departmentId,
      phone: data.phone,
      avatarUrl: data.avatarUrl,
      officeId: data.officeId || '',
      status: data.status || 'ACTIVE' as any,
      hireDate: data.hireDate || new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockEmployees.push(newEmployee);
    populateRelations();
    return newEmployee;
  },

  updateEmployee: async (id: string, data: Partial<Employee>) => {
    await randomDelay();
    const index = mockEmployees.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Empleado no encontrado');
    
    mockEmployees[index] = {
      ...mockEmployees[index],
      ...data,
      updatedAt: new Date(),
    };
    populateRelations();
    return mockEmployees[index];
  },

  deleteEmployee: async (id: string) => {
    await randomDelay();
    const index = mockEmployees.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Empleado no encontrado');
    mockEmployees.splice(index, 1);
  },

  // Projects
  getProjects: async (filters?: { officeId?: string; status?: ProjectStatus }) => {
    await randomDelay();
    populateRelations();
    let projects = [...mockProjects];
    
    if (filters?.officeId) {
      projects = projects.filter(p => p.officeId === filters.officeId);
    }
    
    if (filters?.status) {
      projects = projects.filter(p => p.status === filters.status);
    }
    
    return projects;
  },

  getProjectById: async (id: string) => {
    await randomDelay();
    populateRelations();
    const project = mockProjects.find(p => p.id === id);
    if (!project) throw new Error('Proyecto no encontrado');
    return project;
  },

  createProject: async (data: Partial<Project>) => {
    await randomDelay();
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: data.name || 'Nuevo Proyecto',
      description: data.description,
      status: data.status || 'PLANNING' as any,
      priority: data.priority || 'MEDIUM' as any,
      startDate: data.startDate || new Date(),
      endDate: data.endDate,
      clientName: data.clientName,
      budget: data.budget,
      isInternal: data.isInternal,
      officeId: data.officeId || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockProjects.push(newProject);
    populateRelations();
    return newProject;
  },

  updateProject: async (id: string, data: Partial<Project>) => {
    await randomDelay();
    const index = mockProjects.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Proyecto no encontrado');
    
    mockProjects[index] = {
      ...mockProjects[index],
      ...data,
      updatedAt: new Date(),
    };
    populateRelations();
    return mockProjects[index];
  },

  deleteProject: async (id: string) => {
    await randomDelay();
    const index = mockProjects.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Proyecto no encontrado');
    mockProjects.splice(index, 1);
  },

  // Technologies
  getTechnologies: async () => {
    await randomDelay();
    return [...mockTechnologies];
  },

  getTechnologyById: async (id: string) => {
    await randomDelay();
    const tech = mockTechnologies.find(t => t.id === id);
    if (!tech) throw new Error('Tecnología no encontrada');
    return tech;
  },

  createTechnology: async (data: Partial<Technology>) => {
    await randomDelay();
    const newTech: Technology = {
      id: `tech-${Date.now()}`,
      name: data.name || 'Nueva Tecnología',
      category: data.category || 'OTHER' as any,
      iconUrl: data.iconUrl,
      color: data.color,
      createdAt: new Date(),
    };
    mockTechnologies.push(newTech);
    return newTech;
  },

  updateTechnology: async (id: string, data: Partial<Technology>) => {
    await randomDelay();
    const index = mockTechnologies.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Tecnología no encontrada');
    
    mockTechnologies[index] = {
      ...mockTechnologies[index],
      ...data,
    };
    return mockTechnologies[index];
  },

  deleteTechnology: async (id: string) => {
    await randomDelay();
    const index = mockTechnologies.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Tecnología no encontrada');
    mockTechnologies.splice(index, 1);
  },

  // Relations
  assignEmployeeToProject: async (data: Partial<ProjectEmployee>) => {
    await randomDelay();
    const newPE: ProjectEmployee = {
      id: `pe-${Date.now()}`,
      projectId: data.projectId || '',
      employeeId: data.employeeId || '',
      role: data.role || 'Desarrollador',
      startDate: data.startDate || new Date(),
      endDate: data.endDate,
      allocation: data.allocation || 50,
      createdAt: new Date(),
    };
    mockProjectEmployees.push(newPE);
    populateRelations();
    return newPE;
  },

  removeEmployeeFromProject: async (projectId: string, employeeId: string) => {
    await randomDelay();
    const index = mockProjectEmployees.findIndex(
      pe => pe.projectId === projectId && pe.employeeId === employeeId
    );
    if (index !== -1) {
      mockProjectEmployees.splice(index, 1);
    }
    populateRelations();
  },

  addTechnologyToEmployee: async (data: Partial<EmployeeTechnology>) => {
    await randomDelay();
    const newET: EmployeeTechnology = {
      id: `et-${Date.now()}`,
      employeeId: data.employeeId || '',
      technologyId: data.technologyId || '',
      level: data.level || 'INTERMEDIATE' as any,
      yearsOfExp: data.yearsOfExp || 1,
      createdAt: new Date(),
    };
    mockEmployeeTechnologies.push(newET);
    populateRelations();
    return newET;
  },

  addDepartmentToProject: async (data: Partial<ProjectDepartment>) => {
    await randomDelay();
    const newPD: ProjectDepartment = {
      id: `pd-${Date.now()}`,
      projectId: data.projectId || '',
      departmentId: data.departmentId || '',
      createdAt: new Date(),
    };
    mockProjectDepartments.push(newPD);
    populateRelations();
    return newPD;
  },

  addTechnologyToProject: async (data: Partial<ProjectTechnology>) => {
    await randomDelay();
    const newPT: ProjectTechnology = {
      id: generateId(),
      projectId: data.projectId || '',
      technologyId: data.technologyId || '',
    };
    mockProjectTechnologies.push(newPT);
    populateRelations();
    return newPT;
  },

  // Analytics/Dashboard
  getDashboardStats: async (officeIds?: string[]) => {
    await randomDelay();
    populateRelations();
    
    let projects = [...mockProjects];
    let employees = [...mockEmployees];
    
    if (officeIds && officeIds.length > 0) {
      projects = projects.filter(p => officeIds.includes(p.officeId));
      employees = employees.filter(e => officeIds.includes(e.officeId));
    }
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const projectsByStatus: Record<ProjectStatus, number> = {
      PLANNING: 0,
      ACTIVE: 0,
      ON_HOLD: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };
    
    projects.forEach(p => {
      projectsByStatus[p.status] = (projectsByStatus[p.status] || 0) + 1;
    });
    
    const completedThisMonth = projects.filter(
      p => p.status === ProjectStatus.COMPLETED && p.endDate && p.endDate >= startOfMonth
    ).length;
    
    const employeesByDepartment: Record<string, number> = {};
    employees.forEach(e => {
      if (e.departmentId) {
        const dept = mockDepartments.find(d => d.id === e.departmentId);
        const deptName = dept?.name || 'Sin departamento';
        employeesByDepartment[deptName] = (employeesByDepartment[deptName] || 0) + 1;
      }
    });
    
    const departments = officeIds && officeIds.length > 0
      ? mockDepartments.filter(d => officeIds.includes(d.officeId))
      : mockDepartments;

    // Presupuesto anual: suma de budgets de todos los proyectos considerados
    const annualBudget = projects.reduce((total, project) => {
      if (!project.budget) return total;
      return total + project.budget;
    }, 0);

    // Gastos anuales: coste aproximado de los empleados asignados a cada proyecto,
    // prorrateado por su porcentaje de dedicación (allocation)
    const annualExpenses = projects.reduce((totalProjectsCost, project) => {
      const projectEmployees = mockProjectEmployees.filter(pe => pe.projectId === project.id);

      const projectCost = projectEmployees.reduce((projectSum, pe) => {
        const employee = mockEmployees.find(e => e.id === pe.employeeId);
        if (!employee || !employee.salary) return projectSum;

        const allocationFactor = pe.allocation ? pe.allocation / 100 : 1;
        return projectSum + employee.salary * allocationFactor;
      }, 0);

      return totalProjectsCost + projectCost;
    }, 0);

    const annualProfit = annualBudget - annualExpenses;
    
    return {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === ProjectStatus.ACTIVE).length,
      totalEmployees: employees.length,
      totalDepartments: departments.length,
      completedProjectsThisMonth: completedThisMonth,
      projectsByStatus,
      employeesByDepartment,
      annualBudget,
      annualExpenses,
      annualProfit,
    };
  },

  // Time Entries
  getTimeEntries: async (employeeId?: string) => {
    await randomDelay();
    let entries = [...mockTimeEntries];
    
    if (employeeId) {
      entries = entries.filter(te => te.employeeId === employeeId);
    }
    
    populateRelations();
    return entries.sort((a, b) => b.date.getTime() - a.date.getTime());
  },

  getTimeEntryById: async (id: string) => {
    await randomDelay();
    const entry = mockTimeEntries.find(te => te.id === id);
    if (!entry) throw new Error('Imputación no encontrada');
    populateRelations();
    return entry;
  },

  createTimeEntry: async (data: Partial<TimeEntry>) => {
    await randomDelay();
    if (!data.employeeId || !data.projectId || !data.hours) {
      throw new Error('Faltan campos requeridos');
    }
    
    const newEntry: TimeEntry = {
      id: `te-${Date.now()}`,
      employeeId: data.employeeId,
      projectId: data.projectId,
      hours: data.hours,
      description: data.description,
      date: data.date || new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockTimeEntries.push(newEntry);
    populateRelations();
    return newEntry;
  },

  updateTimeEntry: async (id: string, data: Partial<TimeEntry>) => {
    await randomDelay();
    const index = mockTimeEntries.findIndex(te => te.id === id);
    if (index === -1) throw new Error('Imputación no encontrada');
    
    mockTimeEntries[index] = {
      ...mockTimeEntries[index],
      ...data,
      updatedAt: new Date(),
    };
    
    populateRelations();
    return mockTimeEntries[index];
  },

  deleteTimeEntry: async (id: string) => {
    await randomDelay();
    const index = mockTimeEntries.findIndex(te => te.id === id);
    if (index === -1) throw new Error('Imputación no encontrada');
    mockTimeEntries.splice(index, 1);
  },
};

