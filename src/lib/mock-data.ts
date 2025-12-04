import type {
  Company,
  Office,
  Department,
  User,
  Employee,
  ManagerOffice,
  Project,
  Technology,
  ProjectEmployee,
  EmployeeTechnology,
  ProjectTechnology,
  ProjectDepartment,
  TimeEntry,
  ProjectExpense,
} from '../types/database';
import {
  UserRole,
  EmployeeStatus,
  ProjectStatus,
  Priority,
  TechCategory,
  SkillLevel,
  ExpenseCategory,
} from '../types/database';

// Helper para generar IDs
export const generateId = () => Math.random().toString(36).substring(2, 15);

// Helper para fechas
const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

// 1. Company
export const mockCompany: Company = {
  id: 'company-1',
  name: 'Excelia',
  logo: undefined,
  createdAt: new Date('2020-01-01'),
  updatedAt: new Date('2020-01-01'),
};

// 2. Offices (5 sedes)
export const mockOffices: Office[] = [
  {
    id: 'office-1',
    name: 'Madrid',
    country: 'España',
    address: 'Calle Gran Vía 123, 28013 Madrid',
    timezone: 'Europe/Madrid',
    companyId: mockCompany.id,
    createdAt: new Date('2020-01-15'),
    updatedAt: new Date('2020-01-15'),
  },
  {
    id: 'office-2',
    name: 'Lisboa',
    country: 'Portugal',
    address: 'Avenida da Liberdade 456, 1250-096 Lisboa',
    timezone: 'Europe/Lisbon',
    companyId: mockCompany.id,
    createdAt: new Date('2020-03-10'),
    updatedAt: new Date('2020-03-10'),
  },
  {
    id: 'office-3',
    name: 'Santiago',
    country: 'Chile',
    address: 'Av. Providencia 789, Santiago',
    timezone: 'America/Santiago',
    companyId: mockCompany.id,
    createdAt: new Date('2021-05-20'),
    updatedAt: new Date('2021-05-20'),
  },
  {
    id: 'office-4',
    name: 'Ciudad de México',
    country: 'México',
    address: 'Av. Reforma 321, CDMX',
    timezone: 'America/Mexico_City',
    companyId: mockCompany.id,
    createdAt: new Date('2021-08-15'),
    updatedAt: new Date('2021-08-15'),
  },
  {
    id: 'office-5',
    name: 'Bogotá',
    country: 'Colombia',
    address: 'Carrera 7 # 123-45, Bogotá',
    timezone: 'America/Bogota',
    companyId: mockCompany.id,
    createdAt: new Date('2022-02-01'),
    updatedAt: new Date('2022-02-01'),
  },
];

// 3. Departments (4 por sede = 20 total)
const departmentNames = ['Desarrollo', 'QA', 'DevOps', 'Diseño', 'Management'];
export const mockDepartments: Department[] = [];

mockOffices.forEach((office, officeIndex) => {
  departmentNames.forEach((deptName, deptIndex) => {
    if (officeIndex === 0 && deptIndex === 4) return; // Skip Management for first office
    mockDepartments.push({
      id: `dept-${officeIndex}-${deptIndex}`,
      name: deptName,
      description: `Departamento de ${deptName} en ${office.name}`,
      officeId: office.id,
      createdAt: new Date(office.createdAt.getTime() + deptIndex * 86400000),
      updatedAt: new Date(office.createdAt.getTime() + deptIndex * 86400000),
    });
  });
});

// 4. Users (1 Director, 4 Managers, 40 Employees = 45 total)
export const mockUsers: User[] = [
  // Director
  {
    id: 'user-director',
    email: 'director@excelia.com',
    role: UserRole.DIRECTOR,
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2020-01-01'),
  },
  // Managers
  {
    id: 'user-manager-1',
    email: 'manager.es@excelia.com',
    role: UserRole.MANAGER,
    createdAt: new Date('2020-02-01'),
    updatedAt: new Date('2020-02-01'),
  },
  {
    id: 'user-manager-2',
    email: 'manager.latam@excelia.com',
    role: UserRole.MANAGER,
    createdAt: new Date('2021-06-01'),
    updatedAt: new Date('2021-06-01'),
  },
  {
    id: 'user-manager-3',
    email: 'manager.pt@excelia.com',
    role: UserRole.MANAGER,
    createdAt: new Date('2020-04-01'),
    updatedAt: new Date('2020-04-01'),
  },
  {
    id: 'user-manager-4',
    email: 'manager.co@excelia.com',
    role: UserRole.MANAGER,
    createdAt: new Date('2022-03-01'),
    updatedAt: new Date('2022-03-01'),
  },
];

// Add 40 employee users
const employeeNames = [
  'Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez', 'Luis Rodríguez',
  'Laura Sánchez', 'Pedro Fernández', 'Carmen González', 'Miguel Torres', 'Sofía Ramírez',
  'Diego Morales', 'Elena Ruiz', 'Javier Herrera', 'Isabel Jiménez', 'Roberto Díaz',
  'Patricia Moreno', 'Fernando Castro', 'Lucía Romero', 'Antonio Navarro', 'Marta Domínguez',
  'Ricardo Vega', 'Cristina Ortega', 'Andrés Medina', 'Natalia Campos', 'Óscar Ríos',
  'Beatriz Vargas', 'Héctor Mendoza', 'Adriana Paredes', 'Sergio Cáceres', 'Valeria Soto',
  'Manuel Contreras', 'Gabriela Flores', 'Raúl Espinoza', 'Daniela Rojas', 'Francisco Guzmán',
  'Andrea Méndez', 'Jorge Silva', 'Monica Ávila', 'Esteban Peña', 'Renata Fuentes',
];

for (let i = 0; i < 40; i++) {
  mockUsers.push({
    id: `user-employee-${i + 1}`,
    email: employeeNames[i].toLowerCase().replace(/\s+/g, '.') + '@excelia.com',
    role: UserRole.EMPLOYEE,
    createdAt: daysAgo(Math.floor(Math.random() * 1000)),
    updatedAt: daysAgo(Math.floor(Math.random() * 100)),
  });
}

// 5. Employees (40 empleados distribuidos)
const positions = [
  'Desarrollador Frontend', 'Desarrollador Backend', 'Full Stack Developer',
  'QA Engineer', 'DevOps Engineer', 'Diseñador UX/UI', 'Product Manager',
  'Tech Lead', 'Scrum Master', 'Business Analyst',
];

export const mockEmployees: Employee[] = [];

// Helper para obtener salario según posición
const getSalaryByPosition = (position: string): number => {
  const salaryRanges: Record<string, [number, number]> = {
    'Director': [100000, 150000],
    'Manager': [70000, 100000],
    'Tech Lead': [60000, 90000],
    'Full Stack Developer': [45000, 70000],
    'Desarrollador Frontend': [30000, 50000],
    'Desarrollador Backend': [30000, 50000],
    'QA Engineer': [30000, 50000],
    'DevOps Engineer': [50000, 75000],
    'Diseñador UX/UI': [35000, 55000],
    'Product Manager': [55000, 80000],
    'Scrum Master': [40000, 60000],
    'Business Analyst': [35000, 55000],
  };
  
  const range = salaryRanges[position] || [35000, 55000];
  return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
};

// Director employee
mockEmployees.push({
  id: 'employee-director',
  userId: 'user-director',
  name: 'Director General',
  position: 'Director',
  officeId: mockOffices[0].id,
  status: EmployeeStatus.ACTIVE,
  hireDate: new Date('2020-01-01'),
  salary: getSalaryByPosition('Director'),
  createdAt: new Date('2020-01-01'),
  updatedAt: new Date('2020-01-01'),
});

// Manager employees
mockEmployees.push({
  id: 'employee-manager-1',
  userId: 'user-manager-1',
  name: 'Manager España',
  position: 'Manager',
  officeId: mockOffices[0].id,
  status: EmployeeStatus.ACTIVE,
  hireDate: new Date('2020-02-01'),
  salary: getSalaryByPosition('Manager'),
  createdAt: new Date('2020-02-01'),
  updatedAt: new Date('2020-02-01'),
});

mockEmployees.push({
  id: 'employee-manager-2',
  userId: 'user-manager-2',
  name: 'Manager Latam',
  position: 'Manager',
  officeId: mockOffices[2].id,
  status: EmployeeStatus.ACTIVE,
  hireDate: new Date('2021-06-01'),
  salary: getSalaryByPosition('Manager'),
  createdAt: new Date('2021-06-01'),
  updatedAt: new Date('2021-06-01'),
});

mockEmployees.push({
  id: 'employee-manager-3',
  userId: 'user-manager-3',
  name: 'Manager Portugal',
  position: 'Manager',
  officeId: mockOffices[1].id,
  status: EmployeeStatus.ACTIVE,
  hireDate: new Date('2020-04-01'),
  salary: getSalaryByPosition('Manager'),
  createdAt: new Date('2020-04-01'),
  updatedAt: new Date('2020-04-01'),
});

mockEmployees.push({
  id: 'employee-manager-4',
  userId: 'user-manager-4',
  name: 'Manager Colombia',
  position: 'Manager',
  officeId: mockOffices[4].id,
  status: EmployeeStatus.ACTIVE,
  hireDate: new Date('2022-03-01'),
  salary: getSalaryByPosition('Manager'),
  createdAt: new Date('2022-03-01'),
  updatedAt: new Date('2022-03-01'),
});

// 40 regular employees distributed across offices
const employeesPerOffice = [10, 8, 8, 7, 7]; // Total: 40

let employeeIndex = 0;
mockOffices.forEach((office, officeIdx) => {
  const deptsInOffice = mockDepartments.filter(d => d.officeId === office.id);
  
  for (let i = 0; i < employeesPerOffice[officeIdx]; i++) {
    const dept = deptsInOffice[Math.floor(Math.random() * deptsInOffice.length)];
    const statuses = [EmployeeStatus.ACTIVE, EmployeeStatus.ACTIVE, EmployeeStatus.ACTIVE, EmployeeStatus.ON_LEAVE];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const position = positions[Math.floor(Math.random() * positions.length)];
    mockEmployees.push({
      id: `employee-${employeeIndex + 1}`,
      userId: `user-employee-${employeeIndex + 1}`,
      name: employeeNames[employeeIndex],
      position,
      departmentId: dept.id,
      phone: `+${Math.floor(Math.random() * 900000000) + 100000000}`,
      avatarUrl: undefined,
      officeId: office.id,
      status,
      hireDate: daysAgo(Math.floor(Math.random() * 1000)),
      salary: getSalaryByPosition(position),
      createdAt: daysAgo(Math.floor(Math.random() * 1000)),
      updatedAt: daysAgo(Math.floor(Math.random() * 100)),
    });
    employeeIndex++;
  }
});

// 6. ManagerOffice assignments
export const mockManagerOffices: ManagerOffice[] = [
  { id: 'mo-1', userId: 'user-manager-1', officeId: 'office-1', createdAt: new Date('2020-02-01') },
  { id: 'mo-2', userId: 'user-manager-1', officeId: 'office-2', createdAt: new Date('2020-02-01') },
  { id: 'mo-3', userId: 'user-manager-2', officeId: 'office-3', createdAt: new Date('2021-06-01') },
  { id: 'mo-4', userId: 'user-manager-2', officeId: 'office-4', createdAt: new Date('2021-06-01') },
  { id: 'mo-5', userId: 'user-manager-3', officeId: 'office-2', createdAt: new Date('2020-04-01') },
  { id: 'mo-6', userId: 'user-manager-4', officeId: 'office-5', createdAt: new Date('2022-03-01') },
];

// 7. Technologies (50 tecnologías)
const techData: Array<{ name: string; category: TechCategory; color?: string }> = [
  // Frontend
  { name: 'React', category: TechCategory.FRONTEND, color: '#61DAFB' },
  { name: 'Vue.js', category: TechCategory.FRONTEND, color: '#4FC08D' },
  { name: 'Angular', category: TechCategory.FRONTEND, color: '#DD0031' },
  { name: 'TypeScript', category: TechCategory.FRONTEND, color: '#3178C6' },
  { name: 'JavaScript', category: TechCategory.FRONTEND, color: '#F7DF1E' },
  { name: 'Next.js', category: TechCategory.FRONTEND, color: '#000000' },
  { name: 'Tailwind CSS', category: TechCategory.FRONTEND, color: '#06B6D4' },
  { name: 'Sass', category: TechCategory.FRONTEND, color: '#CC6699' },
  { name: 'Webpack', category: TechCategory.FRONTEND, color: '#8DD6F9' },
  { name: 'Vite', category: TechCategory.FRONTEND, color: '#646CFF' },
  
  // Backend
  { name: 'Node.js', category: TechCategory.BACKEND, color: '#339933' },
  { name: 'Python', category: TechCategory.BACKEND, color: '#3776AB' },
  { name: 'Java', category: TechCategory.BACKEND, color: '#ED8B00' },
  { name: 'C#', category: TechCategory.BACKEND, color: '#239120' },
  { name: 'Go', category: TechCategory.BACKEND, color: '#00ADD8' },
  { name: 'PHP', category: TechCategory.BACKEND, color: '#777BB4' },
  { name: 'Ruby', category: TechCategory.BACKEND, color: '#CC342D' },
  { name: 'Express', category: TechCategory.BACKEND, color: '#000000' },
  { name: 'Django', category: TechCategory.BACKEND, color: '#092E20' },
  { name: 'Spring Boot', category: TechCategory.BACKEND, color: '#6DB33F' },
  
  // Database
  { name: 'PostgreSQL', category: TechCategory.DATABASE, color: '#336791' },
  { name: 'MySQL', category: TechCategory.DATABASE, color: '#4479A1' },
  { name: 'MongoDB', category: TechCategory.DATABASE, color: '#47A248' },
  { name: 'Redis', category: TechCategory.DATABASE, color: '#DC382D' },
  { name: 'Elasticsearch', category: TechCategory.DATABASE, color: '#005571' },
  { name: 'Oracle', category: TechCategory.DATABASE, color: '#F80000' },
  { name: 'SQL Server', category: TechCategory.DATABASE, color: '#CC2927' },
  
  // DevOps
  { name: 'Docker', category: TechCategory.DEVOPS, color: '#2496ED' },
  { name: 'Kubernetes', category: TechCategory.DEVOPS, color: '#326CE5' },
  { name: 'AWS', category: TechCategory.DEVOPS, color: '#232F3E' },
  { name: 'Azure', category: TechCategory.DEVOPS, color: '#0078D4' },
  { name: 'GCP', category: TechCategory.DEVOPS, color: '#4285F4' },
  { name: 'Jenkins', category: TechCategory.DEVOPS, color: '#D24939' },
  { name: 'GitLab CI', category: TechCategory.DEVOPS, color: '#FC6D26' },
  { name: 'Terraform', category: TechCategory.DEVOPS, color: '#7B42BC' },
  { name: 'Ansible', category: TechCategory.DEVOPS, color: '#EE0000' },
  
  // Mobile
  { name: 'React Native', category: TechCategory.MOBILE, color: '#61DAFB' },
  { name: 'Flutter', category: TechCategory.MOBILE, color: '#02569B' },
  { name: 'Swift', category: TechCategory.MOBILE, color: '#FA7343' },
  { name: 'Kotlin', category: TechCategory.MOBILE, color: '#7F52FF' },
  
  // Design
  { name: 'Figma', category: TechCategory.DESIGN, color: '#F24E1E' },
  { name: 'Adobe XD', category: TechCategory.DESIGN, color: '#FF61F6' },
  { name: 'Sketch', category: TechCategory.DESIGN, color: '#F7B500' },
  
  // Testing
  { name: 'Jest', category: TechCategory.TESTING, color: '#C21325' },
  { name: 'Cypress', category: TechCategory.TESTING, color: '#17202C' },
  { name: 'Selenium', category: TechCategory.TESTING, color: '#43B02A' },
];

export const mockTechnologies: Technology[] = techData.map((tech, index) => ({
  id: `tech-${index + 1}`,
  name: tech.name,
  category: tech.category,
  iconUrl: undefined,
  color: tech.color,
  createdAt: daysAgo(Math.floor(Math.random() * 500)),
}));

// 8. Projects (25 proyectos)
const projectNames = [
  'Sistema de Gestión ERP', 'Plataforma E-commerce', 'App Móvil Banking',
  'Dashboard Analytics', 'API Gateway', 'Microservicios Core',
  'Portal Cliente', 'Sistema de Facturación', 'App Delivery',
  'Plataforma Educativa', 'CRM Empresarial', 'Sistema de Reservas',
  'Marketplace B2B', 'App Fitness', 'Plataforma Streaming',
  'Sistema de Inventario', 'Portal de Empleados', 'App de Viajes',
  'Plataforma de Pagos', 'Sistema de Tickets', 'App Social',
  'Dashboard BI', 'Plataforma IoT', 'Sistema de Logística',
  'App de Salud',
];

export const mockProjects: Project[] = projectNames.map((name, index) => {
  const office = mockOffices[Math.floor(Math.random() * mockOffices.length)];
  const statuses: ProjectStatus[] = [
    ProjectStatus.PLANNING,
    ProjectStatus.ACTIVE,
    ProjectStatus.ACTIVE,
    ProjectStatus.ACTIVE,
    ProjectStatus.ON_HOLD,
    ProjectStatus.COMPLETED,
    ProjectStatus.COMPLETED,
  ];
  const priorities: Priority[] = [Priority.LOW, Priority.MEDIUM, Priority.MEDIUM, Priority.HIGH, Priority.URGENT];
  
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const startDate = daysAgo(Math.floor(Math.random() * 500));
  const endDate = status === ProjectStatus.COMPLETED 
    ? new Date(startDate.getTime() + Math.random() * 200 * 86400000)
    : undefined;
  
  // Determinar si es proyecto interno o externo
  // Algunos proyectos son internos (sin cliente), otros son externos (con cliente)
  const isInternal = Math.random() > 0.6; // 40% internos, 60% externos
  
  // Nombres de proyectos que típicamente son internos
  const internalProjectNames = [
    'Portal de Empleados', 'Sistema de Gestión ERP', 'Dashboard Analytics',
    'Sistema de Inventario', 'Dashboard BI'
  ];
  
  const isInternalByName = internalProjectNames.some(internalName => 
    name.toLowerCase().includes(internalName.toLowerCase())
  );
  
  const finalIsInternal = isInternalByName || isInternal;
  
  return {
    id: `project-${index + 1}`,
    name,
    description: finalIsInternal 
      ? `Proyecto interno de ${name}. Desarrollo para uso interno de la empresa.`
      : `Descripción del proyecto ${name}. Proyecto de desarrollo de software para cliente empresarial.`,
    status,
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    startDate,
    endDate,
    clientName: finalIsInternal ? undefined : `Cliente ${String.fromCharCode(65 + (index % 26))}`,
    budget: Math.floor(Math.random() * 500000) + 50000,
    isInternal: finalIsInternal,
    officeId: office.id,
    createdAt: startDate,
    updatedAt: daysAgo(Math.floor(Math.random() * 30)),
  };
});

// 9. ProjectEmployee (relaciones proyecto-empleado)
export const mockProjectEmployees: ProjectEmployee[] = [];
mockProjects.forEach((project) => {
  const employeesInOffice = mockEmployees.filter(e => e.officeId === project.officeId && e.status === EmployeeStatus.ACTIVE);
  const numEmployees = Math.floor(Math.random() * 5) + 2; // 2-6 empleados por proyecto
  
  const selectedEmployees = employeesInOffice
    .sort(() => Math.random() - 0.5)
    .slice(0, numEmployees);
  
  selectedEmployees.forEach((employee) => {
    const allocation = Math.floor(Math.random() * 60) + 20; // 20-80%
    const endDate = project.endDate || new Date();
    const daysDiff = Math.max(1, Math.ceil((endDate.getTime() - project.startDate.getTime()) / (1000 * 60 * 60 * 24)));
    // Calcular horas imputadas: días * allocation% * 8 horas/día
    // Reducir a días laborales (asumiendo 5 días por semana de 7)
    const workingDays = Math.floor(daysDiff * 5 / 7);
    const hours = Math.floor(workingDays * (allocation / 100) * 8);
    
    mockProjectEmployees.push({
      id: generateId(),
      projectId: project.id,
      employeeId: employee.id,
      role: ['Desarrollador', 'Tech Lead', 'QA', 'Diseñador', 'PM'][Math.floor(Math.random() * 5)],
      startDate: project.startDate,
      endDate: project.endDate,
      allocation,
      hours,
      createdAt: project.startDate,
    });
  });
});

// 10. EmployeeTechnology (relaciones empleado-tecnología)
export const mockEmployeeTechnologies: EmployeeTechnology[] = [];
mockEmployees.forEach((employee) => {
  const numTechs = Math.floor(Math.random() * 8) + 3; // 3-10 tecnologías por empleado
  const selectedTechs = mockTechnologies
    .sort(() => Math.random() - 0.5)
    .slice(0, numTechs);
  
  selectedTechs.forEach((tech) => {
    const levels: SkillLevel[] = [SkillLevel.BEGINNER, SkillLevel.INTERMEDIATE, SkillLevel.ADVANCED, SkillLevel.EXPERT];
    mockEmployeeTechnologies.push({
      id: generateId(),
      employeeId: employee.id,
      technologyId: tech.id,
      level: levels[Math.floor(Math.random() * levels.length)],
      yearsOfExp: Math.floor(Math.random() * 8) + 1,
      createdAt: daysAgo(Math.floor(Math.random() * 500)),
    });
  });
});

// 11. ProjectTechnology (relaciones proyecto-tecnología)
export const mockProjectTechnologies: ProjectTechnology[] = [];
mockProjects.forEach((project) => {
  const numTechs = Math.floor(Math.random() * 6) + 3; // 3-8 tecnologías por proyecto
  const selectedTechs = mockTechnologies
    .sort(() => Math.random() - 0.5)
    .slice(0, numTechs);
  
  selectedTechs.forEach((tech) => {
    mockProjectTechnologies.push({
      id: generateId(),
      projectId: project.id,
      technologyId: tech.id,
    });
  });
});

// 12. ProjectDepartment (relaciones proyecto-departamento)
export const mockProjectDepartments: ProjectDepartment[] = [];
mockProjects.forEach((project) => {
  const deptsInOffice = mockDepartments.filter(d => d.officeId === project.officeId);
  const numDepts = Math.floor(Math.random() * 3) + 1; // 1-3 departamentos por proyecto
  
  const selectedDepts = deptsInOffice
    .sort(() => Math.random() - 0.5)
    .slice(0, numDepts);
  
  selectedDepts.forEach((dept) => {
    mockProjectDepartments.push({
      id: generateId(),
      projectId: project.id,
      departmentId: dept.id,
      createdAt: project.startDate,
    });
  });
});

// 13. TimeEntries (imputaciones de horas)
export const mockTimeEntries: TimeEntry[] = [];
// Generar imputaciones para algunos empleados en proyectos activos
mockEmployees.forEach((employee) => {
  // Solo para empleados activos
  if (employee.status !== EmployeeStatus.ACTIVE) return;
  
  // Obtener proyectos donde el empleado está asignado
  const employeeProjects = mockProjectEmployees
    .filter(pe => pe.employeeId === employee.id)
    .map(pe => mockProjects.find(p => p.id === pe.projectId))
    .filter((p): p is Project => p !== undefined && p.status === ProjectStatus.ACTIVE);
  
  // Crear 5-15 imputaciones por empleado en los últimos 30 días
  const numEntries = Math.floor(Math.random() * 11) + 5;
  
  for (let i = 0; i < numEntries; i++) {
    const project = employeeProjects[Math.floor(Math.random() * employeeProjects.length)];
    if (!project) continue;
    
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    const descriptions = [
      'Desarrollo de funcionalidad',
      'Revisión de código',
      'Reunión con el equipo',
      'Testing y QA',
      'Documentación',
      'Resolución de bugs',
      'Refactorización',
      'Análisis de requisitos',
      'Diseño de arquitectura',
      'Optimización de rendimiento',
    ];
    
    mockTimeEntries.push({
      id: generateId(),
      employeeId: employee.id,
      projectId: project.id,
      hours: Math.floor(Math.random() * 8) + 1, // 1-8 horas
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      date,
      createdAt: date,
      updatedAt: date,
    });
  }
});

// 14. ProjectExpenses (gastos de proyectos)
export const mockProjectExpenses: ProjectExpense[] = [];

// Tipos de gastos por categoría
const expenseTemplates: Record<ExpenseCategory, Array<{ description: string; costRange: [number, number] }>> = {
  [ExpenseCategory.SERVER]: [
    { description: 'Servidor AWS EC2 t3.large', costRange: [150, 300] },
    { description: 'Servidor Azure VM Standard_B2s', costRange: [120, 250] },
    { description: 'Servidor GCP e2-standard-2', costRange: [100, 220] },
    { description: 'Servidor dedicado', costRange: [200, 500] },
    { description: 'Load Balancer AWS', costRange: [20, 50] },
  ],
  [ExpenseCategory.INFRASTRUCTURE]: [
    { description: 'CDN CloudFront', costRange: [50, 150] },
    { description: 'Storage S3', costRange: [30, 100] },
    { description: 'Database RDS', costRange: [200, 600] },
    { description: 'Redis Cache', costRange: [40, 120] },
    { description: 'VPN y Networking', costRange: [80, 200] },
  ],
  [ExpenseCategory.LICENSE]: [
    { description: 'Licencia JetBrains', costRange: [15, 25] },
    { description: 'Licencia Adobe Creative Cloud', costRange: [50, 80] },
    { description: 'Licencia Microsoft Office 365', costRange: [10, 20] },
    { description: 'Licencia Jira/Confluence', costRange: [100, 300] },
    { description: 'Licencia Slack Enterprise', costRange: [200, 500] },
  ],
  [ExpenseCategory.TOOL]: [
    { description: 'Sentry Error Tracking', costRange: [50, 200] },
    { description: 'Datadog Monitoring', costRange: [100, 300] },
    { description: 'New Relic APM', costRange: [150, 400] },
    { description: 'GitHub Enterprise', costRange: [200, 500] },
  ],
  [ExpenseCategory.SERVICE]: [
    { description: 'Servicio de email (SendGrid)', costRange: [30, 100] },
    { description: 'Servicio de SMS (Twilio)', costRange: [50, 150] },
    { description: 'Servicio de pagos (Stripe)', costRange: [100, 300] },
    { description: 'Servicio de almacenamiento (Cloudinary)', costRange: [40, 120] },
  ],
  [ExpenseCategory.OTHER]: [
    { description: 'Dominio y SSL', costRange: [10, 50] },
    { description: 'Backup y almacenamiento', costRange: [30, 100] },
    { description: 'Servicios de seguridad', costRange: [100, 300] },
  ],
};

// Generar gastos para cada proyecto
mockProjects.forEach((project) => {
  // Cada proyecto tiene entre 2-6 gastos
  const numExpenses = Math.floor(Math.random() * 5) + 2;
  
  // Seleccionar categorías aleatorias
  const categories = Object.values(ExpenseCategory);
  
  for (let i = 0; i < numExpenses; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const templates = expenseTemplates[category];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    const [minCost, maxCost] = template.costRange;
    const cost = Math.floor(Math.random() * (maxCost - minCost + 1)) + minCost;
    
    // Fecha de inicio del gasto (puede ser antes o después del inicio del proyecto)
    const startDate = new Date(project.startDate);
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 60) - 30); // ±30 días
    
    // Fecha de fin (opcional, solo si el proyecto tiene endDate)
    const endDate = project.endDate 
      ? new Date(project.endDate)
      : undefined;
    
    mockProjectExpenses.push({
      id: generateId(),
      projectId: project.id,
      category,
      description: template.description,
      cost,
      startDate,
      endDate,
      createdAt: startDate,
      updatedAt: daysAgo(Math.floor(Math.random() * 30)),
    });
  }
});

// Helper para poblar relaciones
export const populateRelations = () => {
  // Populate employees
  mockEmployees.forEach(emp => {
    emp.user = mockUsers.find(u => u.id === emp.userId);
    emp.office = mockOffices.find(o => o.id === emp.officeId);
    emp.department = mockDepartments.find(d => d.id === emp.departmentId);
    emp.projects = mockProjectEmployees.filter(pe => pe.employeeId === emp.id);
    emp.technologies = mockEmployeeTechnologies.filter(et => et.employeeId === emp.id);
  });
  
  // Populate projects
  mockProjects.forEach(proj => {
    proj.office = mockOffices.find(o => o.id === proj.officeId);
    proj.departments = mockProjectDepartments.filter(pd => pd.projectId === proj.id);
    proj.employees = mockProjectEmployees.filter(pe => pe.projectId === proj.id);
    proj.technologies = mockProjectTechnologies.filter(pt => pt.projectId === proj.id);
    proj.expenses = mockProjectExpenses.filter(exp => exp.projectId === proj.id);
  });
  
  // Populate project employees
  mockProjectEmployees.forEach(pe => {
    pe.project = mockProjects.find(p => p.id === pe.projectId);
    pe.employee = mockEmployees.find(e => e.id === pe.employeeId);
  });
  
  // Populate employee technologies
  mockEmployeeTechnologies.forEach(et => {
    et.employee = mockEmployees.find(e => e.id === et.employeeId);
    et.technology = mockTechnologies.find(t => t.id === et.technologyId);
  });
  
  // Populate project technologies
  mockProjectTechnologies.forEach(pt => {
    pt.project = mockProjects.find(p => p.id === pt.projectId);
    pt.technology = mockTechnologies.find(t => t.id === pt.technologyId);
  });
  
  // Populate project departments
  mockProjectDepartments.forEach(pd => {
    pd.project = mockProjects.find(p => p.id === pd.projectId);
    pd.department = mockDepartments.find(d => d.id === pd.departmentId);
  });
  
  // Populate time entries
  mockTimeEntries.forEach(te => {
    te.employee = mockEmployees.find(e => e.id === te.employeeId);
    te.project = mockProjects.find(p => p.id === te.projectId);
  });
  
  // Populate project expenses
  mockProjectExpenses.forEach(exp => {
    exp.project = mockProjects.find(p => p.id === exp.projectId);
  });
};

// Initialize relations
populateRelations();

