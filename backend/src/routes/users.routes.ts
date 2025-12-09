import { Router } from 'express';
import { getUsers } from '../controllers/users.controller';
import { getUserOffices } from '../controllers/offices.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, authorize('DIRECTOR', 'MANAGER'), getUsers);
router.get('/:userId/offices', authenticate, getUserOffices);

export default router;

