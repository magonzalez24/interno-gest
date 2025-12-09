import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const { officeIds } = req.query;
    const officeIdsArray = officeIds
      ? (Array.isArray(officeIds) ? officeIds : [officeIds]).map(String)
      : undefined;

    // Construir filtros
    const projectWhere: any = {};
    const employeeWhere: any = {};
    const departmentWhere: any = {};

    if (officeIdsArray && officeIdsArray.length > 0) {
      projectWhere.officeId = { in: officeIdsArray };
      employeeWhere.officeId = { in: officeIdsArray };
      departmentWhere.officeId = { in: officeIdsArray };
    }

    // Obtener proyectos
    const projects = await prisma.project.findMany({
      where: projectWhere,
    });

    // Obtener empleados
    const employees = await prisma.employee.findMany({
      where: employeeWhere,
    });

    // Obtener departamentos
    const departments = await prisma.department.findMany({
      where: departmentWhere,
    });

    // Calcular estadísticas de proyectos por estado
    const projectsByStatus: Record<string, number> = {
      PLANNING: 0,
      ACTIVE: 0,
      ON_HOLD: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };

    projects.forEach(p => {
      projectsByStatus[p.status] = (projectsByStatus[p.status] || 0) + 1;
    });

    // Proyectos completados este mes
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const completedThisMonth = projects.filter(
      p => p.status === 'COMPLETED' && p.endDate && p.endDate >= startOfMonth
    ).length;

    // Empleados por departamento
    const employeesByDepartment: Record<string, number> = {};
    for (const employee of employees) {
      if (employee.departmentId) {
        const dept = departments.find(d => d.id === employee.departmentId);
        const deptName = dept?.name || 'Sin departamento';
        employeesByDepartment[deptName] = (employeesByDepartment[deptName] || 0) + 1;
      }
    }

    // Presupuesto anual
    const annualBudget = projects.reduce((total, project) => {
      if (!project.budget) return total;
      return total + Number(project.budget);
    }, 0);

    // Gastos anuales (coste de empleados asignados a proyectos)
    const projectEmployees = await prisma.projectEmployee.findMany({
      where: {
        project: projectWhere,
      },
      include: {
        employee: true,
      },
    });

    const annualExpenses = projectEmployees.reduce((total, pe) => {
      const employee = pe.employee;
      if (!employee || !employee.salary) return total;

      const allocationFactor = pe.allocation ? pe.allocation / 100 : 1;
      return total + Number(employee.salary) * allocationFactor;
    }, 0);

    const annualProfit = annualBudget - annualExpenses;

    res.json({
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'ACTIVE').length,
      totalEmployees: employees.length,
      totalDepartments: departments.length,
      completedProjectsThisMonth: completedThisMonth,
      projectsByStatus,
      employeesByDepartment,
      annualBudget,
      annualExpenses,
      annualProfit,
    });
  } catch (error: any) {
    console.error('Error en getDashboardStats:', error);
    res.status(500).json({ error: error.message });
  }
};

