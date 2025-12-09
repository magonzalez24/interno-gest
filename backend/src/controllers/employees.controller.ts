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
        office: true,
        department: true,
        projectEmployees: {
          include: {
            project: true,
          },
        },
        employeeTechnologies: {
          include: {
            technology: true,
          },
        },
      },
    });

    if (!employee) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    res.json(employee);
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
    const employee = await prisma.employee.update({
      where: { id },
      data: req.body,
      include: {
        user: true,
        office: true,
        department: true,
      },
    });

    res.json(employee);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Empleado no encontrado' });
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

