import { Router } from 'express';
import {
  createUser,
  deleteUserById,
  getUserById,
  getUsers,
  updateUserById,
} from '../controllers/users.controllers.js';
import { requireRole } from '../middlewares/requireRol.js';
import { userValidation } from '../validations/userVal.js';

const routerUsers = Router();

routerUsers.get('/', requireRole(['admin', 'lector']), getUsers);
routerUsers.get(
  '/:id',
  requireRole(['admin', 'lector', 'usuario']),
  getUserById
);
routerUsers.post('/', userValidation, requireRole(['admin']), createUser);
routerUsers.put('/:id', requireRole(['admin']), updateUserById);
routerUsers.delete('/:id', requireRole(['admin']), deleteUserById);

export default routerUsers;
