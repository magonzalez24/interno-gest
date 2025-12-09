import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const getOffices = async (req: AuthRequest, res: Response) => {
  try {
    const offices = await prisma.office.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(offices);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getOfficeById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const office = await prisma.office.findUnique({
      where: { id },
      include: {
        departments: true,
      },
    });

    if (!office) {
      return res.status(404).json({ error: 'Sede no encontrada' });
    }

    res.json(office);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserOffices = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    // Si el usuario solicita sus propias oficinas o es director
    if (req.user.id !== userId && req.user.role !== 'DIRECTOR') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    let offices;

    if (user.role === 'DIRECTOR') {
      // Director ve todas las oficinas
      offices = await prisma.office.findMany();
    } else if (user.role === 'MANAGER') {
      // Manager ve sus oficinas asignadas
      const managerOffices = await prisma.managerOffice.findMany({
        where: { userId },
        include: { office: true },
      });
      offices = managerOffices.map(mo => mo.office);
    } else {
      // Employee ve solo su oficina
      const employee = await prisma.employee.findUnique({
        where: { userId },
        include: { office: true },
      });
      offices = employee?.office ? [employee.office] : [];
    }

    res.json(offices);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createOffice = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'DIRECTOR') {
      return res.status(403).json({ error: 'Solo el director puede crear oficinas' });
    }

    const office = await prisma.office.create({
      data: req.body,
    });

    res.status(201).json(office);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOffice = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'DIRECTOR') {
      return res.status(403).json({ error: 'Solo el director puede actualizar oficinas' });
    }

    const { id } = req.params;
    const office = await prisma.office.update({
      where: { id },
      data: req.body,
    });

    res.json(office);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Sede no encontrada' });
    }
    res.status(500).json({ error: error.message });
  }
};

