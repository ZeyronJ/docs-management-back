import { pool } from '../config/db_config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { nombre, correo, contraseña, rol } = req.body;
    if (!nombre || !correo || !contraseña)
      return res.status(400).send('Faltan datos obligatorios');
    const userRole = rol || 'usuario'; // Si no se envía rol, se asigna 'usuario'
    // Verificar si el correo ya está registrado
    const existingUser = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1',
      [correo]
    );
    if (existingUser.rows.length > 0)
      return res.status(400).send('El correo ya está registrado');

    // Insertar el nuevo usuario en la base de datos
    const hashedPassword = await bcrypt.hash(contraseña, 10); // Encriptar la contraseña antes de almacenarla en la base de datos
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, correo, hashedPassword, userRole]
    );
    const newUser = result.rows[0];

    // Crear el token para el nuevo usuario
    const jwtToken = jwt.sign({ id: newUser.id }, process.env.TOKEN_SECRET, {
      expiresIn: '2m',
    });
    res.setHeader('Authorization', `Bearer ${jwtToken}`);
    res
      .status(201)
      .json({ message: 'Registro exitoso', user: newUser, jwtToken });
  } catch (error) {
    console.error('Error al procesar la solicitud de registro:', error);
    res.status(500).send('Error interno del servidor');
  }
};

export const login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    if (!correo || !contraseña)
      return res.status(400).send('Faltan datos obligatorios');
    // Verificar si el usuario existe y si la contraseña es correcta
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1',
      [correo]
    );
    const user = result.rows[0];
    const validPassword =
      user && (await bcrypt.compare(contraseña, user.contraseña));
    if (!validPassword)
      return res.status(401).send('Correo o contraseña incorrectos');

    // Crear el token para el nuevo usuario
    const jwtToken = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, {
      expiresIn: '2m',
    });
    res.setHeader('Authorization', `Bearer ${jwtToken}`);
    res.status(201).json({ message: 'Login exitoso', user, jwtToken });
  } catch (error) {
    console.error('Error al procesar la solicitud de inicio de sesión:', error);
    res.status(500).send('Error interno del servidor');
  }
};

export const logout = async (req, res) => {
  try {
    res.removeHeader('Authorization');
    res.status(200).send('Sesión cerrada exitosamente');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    res.status(500).send('Error interno del servidor');
  }
};
