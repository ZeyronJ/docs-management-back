import express from 'express';
import cors from 'cors';
import routerAuth from './routes/auth.routes.js';
import routerUsers from './routes/users.routes.js';
const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/auth', routerAuth);
app.use('/usuarios', routerUsers);

app.listen(PORT, () => {
  console.log(`Server corriendo en http://localhost:${PORT}/`);
}); // Inicia servidor
