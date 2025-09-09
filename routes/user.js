import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
import { register, login, getUsers, getUserById, updateUser, changePassword, deleteUser } from '../controllers/userController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/', authMiddleware, getUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUser);
router.put('/:id/change-password', authMiddleware, changePassword);
router.delete('/:id', authMiddleware, deleteUser);

export default router;
