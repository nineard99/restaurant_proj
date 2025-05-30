import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
// import '../types/express';
export const registerController = async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;
  const { token, user } = await authService.register({ username, password, email, role });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ user });
};

export const loginController = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const { token, user } = await authService.login({ username, password });

  // ส่ง cookie กลับ
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // ส่ง cookie แบบ secure เฉพาะบน https
    sameSite: 'lax', // หรือ 'none' ถ้า frontend แยก domain
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 วัน
  });

  res.json({ user });
};

export const meController = async (req: Request, res: Response) => {
  res.json(req.user);
};
