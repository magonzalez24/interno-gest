import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const getProjectExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;

    const expenses = await prisma.projectExpense.findMany({
      where: { projectId },
      include: {
        project: {
          include: {
            office: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(expenses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProjectExpenseById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const expense = await prisma.projectExpense.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            office: true,
          },
        },
      },
    });

    if (!expense) {
      return res.status(404).json({ error: 'Gasto no encontrado' });
    }

    res.json(expense);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createProjectExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { category, description, cost, startDate, endDate } = req.body;

    const expense = await prisma.projectExpense.create({
      data: {
        projectId,
        category,
        description,
        cost: parseFloat(cost),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      },
      include: {
        project: {
          include: {
            office: true,
          },
        },
      },
    });

    res.status(201).json(expense);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProjectExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: any = { ...req.body };
    
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate);
    }
    if (updateData.cost) {
      updateData.cost = parseFloat(updateData.cost);
    }

    const expense = await prisma.projectExpense.update({
      where: { id },
      data: updateData,
      include: {
        project: {
          include: {
            office: true,
          },
        },
      },
    });

    res.json(expense);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Gasto no encontrado' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteProjectExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.projectExpense.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Gasto no encontrado' });
    }
    res.status(500).json({ error: error.message });
  }
};

