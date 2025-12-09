import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  assignEmployeeToProject,
  removeEmployeeFromProject,
  addTechnologyToProject,
  addDepartmentToProject,
  addOfficesToProject,
} from '../controllers/projects.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getProjects);
router.get('/:id', authenticate, getProjectById);
router.post('/', authenticate, createProject);
router.put('/:id', authenticate, updateProject);
router.delete('/:id', authenticate, deleteProject);

// Relations
router.post('/:projectId/employees', authenticate, assignEmployeeToProject);
router.delete('/:projectId/employees/:employeeId', authenticate, removeEmployeeFromProject);
router.post('/:projectId/technologies', authenticate, addTechnologyToProject);
router.post('/:projectId/departments', authenticate, addDepartmentToProject);
router.post('/:projectId/offices', authenticate, addOfficesToProject);

export default router;

