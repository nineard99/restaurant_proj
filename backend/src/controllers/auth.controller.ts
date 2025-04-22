import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  const {username ,email, password, role ,name } = req.body;
  const data = await authService.register({ username, password, email, name, role });
  res.json(data);
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const data = await authService.login({username, password});
  res.json(data);
};
