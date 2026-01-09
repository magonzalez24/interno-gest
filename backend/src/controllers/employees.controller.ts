import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const getEmployees = async (req: AuthRequest, res: Response) => {
  try {
    const { officeId, departmentId } = req.query;

    const where: any = {};
    if (officeId) where.officeId = officeId as string;
    if (departmentId) where.departmentId = departmentId as string;

    const employees = await prisma.employee.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        office: true,
        department: true,
      },
      orderBy: { name: 'asc' },
    });

    res.json(employees);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getEmployeeById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        office: {
          select: {
            id: true,
            name: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        projectEmployees: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
        employeeTechnologies: {
          include: {
            technology: {
              select: {
                id: true,
                name: true,
                category: true,
              },
            },
          },
        },
      },
    });

    if (!employee) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    // Transformar la respuesta para eliminar campos duplicados y formatear employeeTechnologies
    const { departmentId, officeId, employeeTechnologies, ...employeeData } = employee;
    
    // Formatear employeeTechnologies para solo incluir technology y yearsOfExp
    const formattedTechnologies = employeeTechnologies.map((et: any) => ({
      technology: et.technology,
      yearsOfExp: et.yearsOfExp,
    }));
    
    res.json({
      ...employeeData,
      employeeTechnologies: formattedTechnologies,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const employee = await prisma.employee.create({
      data: req.body,
      include: {
        user: true,
        office: true,
        department: true,
      },
    });

    res.status(201).json(employee);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, position, departmentId, phone, officeId, status, hireDate, salary } = req.body;

    // Preparar los datos para actualizar
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (position !== undefined) updateData.position = position;
    if (departmentId !== undefined) {
      // Manejar null o string vacío como null
      updateData.departmentId = departmentId === null || departmentId === '' ? null : departmentId;
    }
    if (phone !== undefined) updateData.phone = phone || null;
    if (officeId !== undefined) updateData.officeId = officeId;
    if (status !== undefined) updateData.status = status;
    
    // Convertir hireDate a Date si viene como string
    if (hireDate !== undefined) {
      updateData.hireDate = hireDate instanceof Date 
        ? hireDate 
        : new Date(hireDate);
    }
    
    // Convertir salary a Decimal si viene como número
    if (salary !== undefined) {
      updateData.salary = salary === null || salary === '' ? null : salary;
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        office: true,
        department: true,
        employeeTechnologies: {
          include: {
            technology: true,
          },
        },
      },
    });

    res.json(employee);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Ya existe un empleado con estos datos' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Referencia inválida (officeId o departmentId no existe)' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.employee.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    res.status(500).json({ error: error.message });
  }
};

