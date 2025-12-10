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
    const { technologies, team, additionalOffices, ...projectData } = req.body;

    // Generar ID único para el proyecto
    const projectCount = await prisma.project.count();
    const projectId = `project-${projectCount + 1}`;

    // Convertir fechas de string a Date si vienen como string
    const processedProjectData = {
      ...projectData,
      id: projectId,
      startDate: projectData.startDate ? new Date(projectData.startDate) : new Date(),
      endDate: projectData.endDate ? new Date(projectData.endDate) : null,
    };

    // Crear el proyecto
    const project = await prisma.project.create({
      data: processedProjectData,
      include: {
        office: true,
      },
    });

    // Crear relaciones de tecnologías si se proporcionan
    if (technologies && Array.isArray(technologies) && technologies.length > 0) {
      const ptCount = await prisma.projectTechnology.count();
      await Promise.all(
        technologies.map((technologyId: string, index: number) =>
          prisma.projectTechnology.create({
            data: {
              id: `pt-${ptCount + index + 1}`,
              projectId: project.id,
              technologyId,
            },
          })
        )
      );
    }

    // Crear relaciones de empleados (equipo) si se proporcionan
    if (team && Array.isArray(team) && team.length > 0) {
      const peCount = await prisma.projectEmployee.count();
      await Promise.all(
        team.map((member: { employeeId: string; role: string; allocation: number }, index: number) =>
          prisma.projectEmployee.create({
            data: {
              id: `pe-${peCount + index + 1}`,
              projectId: project.id,
              employeeId: member.employeeId,
              role: member.role,
              allocation: member.allocation,
              startDate: processedProjectData.startDate,
              endDate: processedProjectData.endDate,
            },
          })
        )
      );
    }

    // Crear relaciones de sedes adicionales si se proporcionan
    if (additionalOffices && Array.isArray(additionalOffices) && additionalOffices.length > 0) {
      const poCount = await prisma.projectOffice.count();
      await Promise.all(
        additionalOffices.map((officeId: string, index: number) =>
          prisma.projectOffice.create({
            data: {
              id: `po-${poCount + index + 1}`,
              projectId: project.id,
              officeId,
            },
          })
        )
      );
    }

    // Retornar el proyecto con todas las relaciones
    const projectWithRelations = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        office: true,
        projectTechnologies: {
          include: {
            technology: true,
          },
        },
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
        projectOffices: {
          include: {
            office: true,
          },
        },
      },
    });

    res.status(201).json(projectWithRelations);
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

    // Generar ID único para el projectEmployee
    const peCount = await prisma.projectEmployee.count();
    const projectEmployeeId = `pe-${peCount + 1}`;

    const projectEmployee = await prisma.projectEmployee.create({
      data: {
        id: projectEmployeeId,
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

    // Generar ID único para el projectTechnology
    const ptCount = await prisma.projectTechnology.count();
    const projectTechnologyId = `pt-${ptCount + 1}`;

    const projectTechnology = await prisma.projectTechnology.create({
      data: {
        id: projectTechnologyId,
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

    // Generar ID único para el projectDepartment
    const pdCount = await prisma.projectDepartment.count();
    const projectDepartmentId = `pd-${pdCount + 1}`;

    const projectDepartment = await prisma.projectDepartment.create({
      data: {
        id: projectDepartmentId,
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

    // Generar IDs únicos para los projectOffices
    const poCount = await prisma.projectOffice.count();
    const projectOffices = await Promise.all(
      officeIds.map((officeId: string, index: number) =>
        prisma.projectOffice.create({
          data: {
            id: `po-${poCount + index + 1}`,
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

