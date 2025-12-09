import { Router } from 'express';
import {
  getTechnologies,
  getTechnologyById,
  createTechnology,
  updateTechnology,
  deleteTechnology,
  addTechnologyToEmployee,
  getTechnologyStats,
  getTechnologyEmployees,
  getTechnologyProjects,
} from '../controllers/technologies.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getTechnologies);
router.get('/:id', authenticate, getTechnologyById);
router.get('/:id/stats', authenticate, getTechnologyStats);
router.get('/:id/employees', authenticate, getTechnologyEmployees);
router.get('/:id/projects', authenticate, getTechnologyProjects);
router.post('/', authenticate, createTechnology);
router.put('/:id', authenticate, updateTechnology);
router.delete('/:id', authenticate, deleteTechnology);
// Esta ruta está en employees.routes.ts

export default router;

