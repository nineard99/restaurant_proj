import express from 'express';

import indexRoute from './routes/index';
import cors from 'cors';
import prisma from './prisma/client';
import 'dotenv/config';
import { errorHandler } from './exceptions/error.middleware';
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.PORT 
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,

  })
);
app.use(cookieParser());
app.use(express.json());

app.use('/',[errorHandler],indexRoute)

// app.get('/users', async (req, res) => {
//     const users = await prisma.user.findMany();
//     res.json(users);
// });




app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
