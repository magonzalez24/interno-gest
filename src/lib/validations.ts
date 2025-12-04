import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export const projectSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  status: z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  startDate: z.date(),
  endDate: z.date().optional().nullable(),
  clientName: z.string().optional(),
  budget: z.number().positive().optional().nullable(),
  isInternal: z.boolean().optional(),
  officeId: z.string().min(1, 'La sede es requerida'),
});

export const employeeSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  position: z.string().min(1, 'La posición es requerida'),
  departmentId: z.string().optional().nullable(),
  phone: z.string().optional(),
  officeId: z.string().min(1, 'La sede es requerida'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED']),
  hireDate: z.date(),
  salary: z.number().positive().optional().nullable(),
});

export const departmentSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  officeId: z.string().min(1, 'La sede es requerida'),
});

export const technologySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  category: z.enum(['FRONTEND', 'BACKEND', 'DATABASE', 'DEVOPS', 'MOBILE', 'DESIGN', 'TESTING', 'OTHER']),
  color: z.string().optional(),
});

export const officeSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  country: z.string().min(1, 'El país es requerido'),
  address: z.string().optional(),
  timezone: z.string().min(1, 'La zona horaria es requerida'),
});

