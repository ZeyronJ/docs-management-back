import jwt from 'jsonwebtoken';
import { pool } from '../config/db_config.js';
export const requireRole = (requiredRoles) => async (req, res, next) => {
  try {
    // Verifica si hay un usuario autenticado
    console.log(req.headers['authorization']);
    if (!req.headers['authorization'])
      return res.status(401).send('No autorizado');
    const token = req.headers['authorization'].split(' ')[1];
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [
      payload.id,
    ]);
    const userRole = result.rows[0].rol;
    // Verifica si el usuario tiene el rol requerido
    if (requiredRoles.includes(userRole)) return next();
    else return res.status(403).send('Permiso denegado');
  } catch (error) {
    // Maneja el error de token expirado
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).send('Token ha caducado');
    }

    console.error('Error al verificar el perfil (requireRole):', error);
    res.status(500).send('Error interno del servidor');
  }
};
