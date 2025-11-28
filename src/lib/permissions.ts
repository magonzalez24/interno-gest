import type { User, Employee, Office } from '../types/database';
import { UserRole } from '../types/database';
import { mockManagerOffices } from './mock-data';

export const permissions = {
  canAccessOffice: (user: User, officeId: string): boolean => {
    // DIRECTOR: acceso total
    if (user.role === UserRole.DIRECTOR) {
      return true;
    }
    
    // MANAGER: solo sedes asignadas
    if (user.role === UserRole.MANAGER) {
      return mockManagerOffices.some(mo => mo.userId === user.id && mo.officeId === officeId);
    }
    
    // EMPLOYEE: solo su sede
    // Esto se verifica en el contexto, no aquí directamente
    return false;
  },

  canManageProjects: (user: User, officeId: string): boolean => {
    if (user.role === UserRole.DIRECTOR) return true;
    if (user.role === UserRole.MANAGER) {
      return permissions.canAccessOffice(user, officeId);
    }
    return false;
  },

  canManageEmployees: (user: User, officeId: string): boolean => {
    if (user.role === UserRole.DIRECTOR) return true;
    if (user.role === UserRole.MANAGER) {
      return permissions.canAccessOffice(user, officeId);
    }
    return false;
  },

  canManageDepartments: (user: User, officeId: string): boolean => {
    if (user.role === UserRole.DIRECTOR) return true;
    if (user.role === UserRole.MANAGER) {
      return permissions.canAccessOffice(user, officeId);
    }
    return false;
  },

  canManageUsers: (user: User): boolean => {
    return user.role === UserRole.DIRECTOR;
  },

  canManageTechnologies: (user: User): boolean => {
    return user.role === UserRole.DIRECTOR;
  },

  filterByUserOffices: <T extends { officeId: string }>(
    user: User,
    items: T[],
    userEmployee?: Employee
  ): T[] => {
    if (user.role === UserRole.DIRECTOR) {
      return items;
    }
    
    if (user.role === UserRole.MANAGER) {
      const managerOfficeIds = mockManagerOffices
        .filter(mo => mo.userId === user.id)
        .map(mo => mo.officeId);
      return items.filter(item => managerOfficeIds.includes(item.officeId));
    }
    
    // EMPLOYEE: solo su sede
    if (userEmployee) {
      return items.filter(item => item.officeId === userEmployee.officeId);
    }
    
    return [];
  },
};

