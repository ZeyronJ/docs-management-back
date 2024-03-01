export const userSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    nombre: {
      type: 'string',
      minLength: 10,
      maxLength: 50,
    },
    correo: {
      type: 'string',
      format: 'email',
    },
    contraseña: {
      type: 'string',
      minLength: 8,
      maxLength: 20,
    },
    rol: {
      type: 'string',
      enum: ['admin', 'lector', 'usuario'],
    },
  },
  anyOf: [
    {
      required: ['correo', 'contraseña'],
    },
    {
      required: ['nombre', 'correo', 'contraseña'],
    },
    {
      required: ['nombre', 'correo', 'contraseña', 'rol'],
    },
  ],
  additionalProperties: false,
};
// export const userSchema = {
//   $schema: 'http://json-schema.org/draft-07/schema#',
//   type: 'object',
//   properties: {
//     correo: {
//       type: 'string',
//       format: 'email',
//     },
//     contraseña: {
//       type: 'string',
//       minLength: 8,
//       maxLength: 20,
//     },
//   },
//   required: ['correo', 'contraseña'],
//   additionalProperties: false,
// };
