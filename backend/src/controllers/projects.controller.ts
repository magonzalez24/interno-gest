import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const { officeId, status } = req.query;

    const where: any = {};
    if (officeId) where.officeId = officeId as string;
    if (status) where.status = status as string;

    const projects = await prisma.project.findMany({
      where,
      include: {
        office: true,
        projectEmployees: {
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
          },
        },
        projectTechnologies: {
          include: {
            technology: true,
          },
        },
        projectDepartments: {
          include: {
            department: true,
          },
        },
        projectOffices: {
          include: {
            office: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        office: true,
        projectEmployees: {
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
          },
        },
        projectTechnologies: {
          include: {
            technology: true,
          },
        },
        projectDepartments: {
          include: {
            department: true,
          },
        },
        projectOffices: {
          include: {
            office: true,
          },
        },
        expenses: true,
        invoices: true,
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    res.json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const project = await prisma.project.create({
      data: req.body,
      include: {
        office: true,
      },
    });

    res.status(201).json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.update({
      where: { id },
      data: req.body,
      include: {
        office: true,
      },
    });

    res.json(project);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Relations
export const assignEmployeeToProject = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { employeeId, role, allocation, startDate, endDate } = req.body;

    const projectEmployee = await prisma.projectEmployee.create({
      data: {
        projectId,
        employeeId,
        role,
        allocation,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
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
        project: true,
      },
    });

    res.status(201).json(projectEmployee);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const removeEmployeeFromProject = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, employeeId } = req.params;

    await prisma.projectEmployee.deleteMany({
      where: {
        projectId,
        employeeId,
      },
    });

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addTechnologyToProject = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { technologyId } = req.body;

    const projectTechnology = await prisma.projectTechnology.create({
      data: {
        projectId,
        technologyId,
      },
      include: {
        technology: true,
        project: true,
      },
    });

    res.status(201).json(projectTechnology);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addDepartmentToProject = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { departmentId } = req.body;

    const projectDepartment = await prisma.projectDepartment.create({
      data: {
        projectId,
        departmentId,
      },
      include: {
        department: true,
        project: true,
      },
    });

    res.status(201).json(projectDepartment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addOfficesToProject = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { officeIds } = req.body;

    const projectOffices = await Promise.all(
      officeIds.map((officeId: string) =>
        prisma.projectOffice.create({
          data: {
            projectId,
            officeId,
          },
          include: {
            office: true,
          },
        })
      )
    );

    res.status(201).json(projectOffices);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

