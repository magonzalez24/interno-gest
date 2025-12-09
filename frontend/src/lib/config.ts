// Configuración del backend
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Helper para obtener el token del localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper para guardar el token
export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Helper para eliminar el token
export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

