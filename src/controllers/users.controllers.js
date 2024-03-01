import { pool } from '../config/db_config.js';

export const getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [
      id,
    ]);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { nombre, correo, contraseña, rol } = req.body;
    if (!nombre || !correo || !contraseña || !rol)
      return res.status(400).send('Faltan datos obligatorios');
    await pool.query(
      'INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES ($1, $2, $3, $4)',
      [nombre, correo, contraseña, rol]
    );
    res.status(200).json({ message: 'Usuario creado correctamente' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al crear el usuario (correo repetido?)' });
  }
};

export const updateUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const { nombre, correo, contraseña, rol } = req.body;
    if (!nombre || !correo || !contraseña || !rol)
      return res.status(400).send('Faltan datos obligatorios');
    await pool.query(
      'UPDATE usuarios SET nombre = $1, correo = $2, contraseña = $3, rol = $4 WHERE id = $5',
      [nombre, correo, contraseña, rol, id]
    );
    res.status(200).json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al actualizar el usuario (correo repetido?)' });
  }
};

export const deleteUserById = async (req, res) => {
  // No se verifica si el usuario existe antes de eliminar
  try {
    const id = req.params.id;
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};
