import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const getDepartments = async (req: AuthRequest, res: Response) => {
  try {
    const { officeId } = req.query;

    const where = officeId ? { officeId: officeId as string } : {};

    const departments = await prisma.department.findMany({
      where,
      include: {
        office: true,
      },
      orderBy: { name: 'asc' },
    });

    res.json(departments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getDepartmentById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        office: true,
      },
    });

    if (!department) {
      return res.status(404).json({ error: 'Departamento no encontrado' });
    }

    res.json(department);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createDepartment = async (req: AuthRequest, res: Response) => {
  try {
    const department = await prisma.department.create({
      data: req.body,
    });

    res.status(201).json(department);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDepartment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const department = await prisma.department.update({
      where: { id },
      data: req.body,
    });

    res.json(department);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Departamento no encontrado' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteDepartment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.department.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Departamento no encontrado' });
    }
    res.status(500).json({ error: error.message });
  }
};

