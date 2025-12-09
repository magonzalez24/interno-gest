import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const getTimeEntries = async (req: AuthRequest, res: Response) => {
  try {
    const { employeeId } = req.query;

    const where: any = {};
    if (employeeId) where.employeeId = employeeId as string;

    const timeEntries = await prisma.timeEntry.findMany({
      where,
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
          },
        },
        project: {
          include: {
            office: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    res.json(timeEntries);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTimeEntryById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const timeEntry = await prisma.timeEntry.findUnique({
      where: { id },
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
          },
        },
        project: {
          include: {
            office: true,
          },
        },
      },
    });

    if (!timeEntry) {
      return res.status(404).json({ error: 'Imputación no encontrada' });
    }

    res.json(timeEntry);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createTimeEntry = async (req: AuthRequest, res: Response) => {
  try {
    const { employeeId, projectId, hours, description, date } = req.body;

    if (!employeeId || !projectId || !hours || !date) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const timeEntry = await prisma.timeEntry.create({
      data: {
        employeeId,
        projectId,
        hours: parseFloat(hours),
        description,
        date: new Date(date),
      },
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
          },
        },
        project: {
          include: {
            office: true,
          },
        },
      },
    });

    res.status(201).json(timeEntry);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTimeEntry = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: any = { ...req.body };
    
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }
    if (updateData.hours) {
      updateData.hours = parseFloat(updateData.hours);
    }

    const timeEntry = await prisma.timeEntry.update({
      where: { id },
      data: updateData,
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
          },
        },
        project: {
          include: {
            office: true,
          },
        },
      },
    });

    res.json(timeEntry);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Imputación no encontrada' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteTimeEntry = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.timeEntry.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Imputación no encontrada' });
    }
    res.status(500).json({ error: error.message });
  }
};

