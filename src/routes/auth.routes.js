import { Router } from 'express';
import { login, logout, register } from '../controllers/auth.controllers.js';
import { userValidation } from '../validations/userVal.js';

const routerAuth = Router();

// Ruta de registro
routerAuth.post('/registro', userValidation, register);

// Ruta de inicio de sesión
routerAuth.post('/login', userValidation, login);

// logout, elimina el header, se usa el metodo post por seguridad
routerAuth.post('/logout', logout);

export default routerAuth;
