import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const getTechnologies = async (req: AuthRequest, res: Response) => {
  try {
    const technologies = await prisma.technology.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(technologies);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTechnologyById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const technology = await prisma.technology.findUnique({
      where: { id },
    });

    if (!technology) {
      return res.status(404).json({ error: 'Tecnología no encontrada' });
    }

    res.json(technology);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createTechnology = async (req: AuthRequest, res: Response) => {
  try {
    const technology = await prisma.technology.create({
      data: req.body,
    });

    res.status(201).json(technology);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTechnology = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const technology = await prisma.technology.update({
      where: { id },
      data: req.body,
    });

    res.json(technology);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Tecnología no encontrada' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteTechnology = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.technology.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Tecnología no encontrada' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const addTechnologyToEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const { employeeId } = req.params;
    const { technologyId, level, yearsOfExp } = req.body;

    const employeeTechnology = await prisma.employeeTechnology.create({
      data: {
        employeeId,
        technologyId,
        level,
        yearsOfExp,
      },
      include: {
        technology: true,
        employee: true,
      },
    });

    res.status(201).json(employeeTechnology);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTechnologyStats = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const employeeCount = await prisma.employeeTechnology.count({
      where: { technologyId: id },
    });

    const projectCount = await prisma.projectTechnology.count({
      where: { technologyId: id },
    });

    res.json({
      employeeCount,
      projectCount,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTechnologyEmployees = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const employeeTechnologies = await prisma.employeeTechnology.findMany({
      where: { technologyId: id },
      include: {
        employee: {
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
        },
        technology: true,
      },
    });

    res.json(employeeTechnologies);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTechnologyProjects = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const projectTechnologies = await prisma.projectTechnology.findMany({
      where: { technologyId: id },
      include: {
        project: {
          include: {
            office: true,
          },
        },
        technology: true,
      },
    });

    res.json(projectTechnologies);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

