import { userSchema } from './schemas/userSchema.js';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();
addFormats(ajv);

export const userValidation = (req, res, next) => {
  try {
    const isValid = ajv.validate(userSchema, req.body);
    if (!isValid) {
      return res.status(400).json(ajv.errors);
    }
    next();
  } catch (error) {
    console.error('Error al validar el usuario (userVal)', error);
    res.status(500).send('Error interno del servidor');
  }
};
