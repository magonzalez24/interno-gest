import type { User, Employee, Office } from '../types/database';
import { UserRole } from '../types/database';
import { api } from './api';

export const permissions = {
  canAccessOffice: async (user: User, officeId: string, userOffices?: Office[]): Promise<boolean> => {
    // DIRECTOR: acceso total
    if (user.role === UserRole.DIRECTOR) {
      return true;
    }
    
    // MANAGER: solo sedes asignadas
    if (user.role === UserRole.MANAGER) {
      if (userOffices) {
        return userOffices.some(office => office.id === officeId);
      }
      // Si no se proporcionan las oficinas, obtenerlas
      try {
        const offices = await api.getUserOffices(user.id);
        return offices.some(office => office.id === officeId);
      } catch {
        return false;
      }
    }
    
    // EMPLOYEE: solo su sede
    // Esto se verifica en el contexto, no aquí directamente
    return false;
  },

  canManageProjects: async (user: User, officeId: string, userOffices?: Office[]): Promise<boolean> => {
    if (user.role === UserRole.DIRECTOR) return true;
    if (user.role === UserRole.MANAGER) {
      return permissions.canAccessOffice(user, officeId, userOffices);
    }
    return false;
  },

  canManageEmployees: async (user: User, officeId: string, userOffices?: Office[]): Promise<boolean> => {
    if (user.role === UserRole.DIRECTOR) return true;
    if (user.role === UserRole.MANAGER) {
      return permissions.canAccessOffice(user, officeId, userOffices);
    }
    return false;
  },

  canManageDepartments: async (user: User, officeId: string, userOffices?: Office[]): Promise<boolean> => {
    if (user.role === UserRole.DIRECTOR) return true;
    if (user.role === UserRole.MANAGER) {
      return permissions.canAccessOffice(user, officeId, userOffices);
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
    userEmployee?: Employee,
    userOffices?: Office[]
  ): T[] => {
    if (user.role === UserRole.DIRECTOR) {
      return items;
    }
    
    if (user.role === UserRole.MANAGER) {
      if (userOffices) {
        const managerOfficeIds = userOffices.map(office => office.id);
        return items.filter(item => managerOfficeIds.includes(item.officeId));
      }
      // Si no se proporcionan las oficinas, retornar vacío (se debe cargar primero)
      return [];
    }
    
    // EMPLOYEE: solo su sede
    if (userEmployee) {
      return items.filter(item => item.officeId === userEmployee.officeId);
    }
    
    return [];
  },
};

