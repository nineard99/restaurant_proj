import express from 'express';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.route';
import { authenticate } from './middlewares/auth.middleware';
import { authorize } from './middlewares/role.middleware';

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(express.json());

app.use('/auth', authRoutes);

app.get('/secure', authenticate, authorize('SUPERADMIN', 'BRANCHMANAGER'), (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  res.send(`Welcome ${req.user.role}`);
});

app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
  });

app.get('/', (req, res) => {
  res.send('Hello');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
