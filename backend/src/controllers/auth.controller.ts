import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { UnauthorizedException } from '../exceptions/http-exceptions';
import prisma from '../prisma/client';
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

export const logoutController = async(req:Request, res:Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.json({message:'Logged out successfully'});
};


export const meController = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new UnauthorizedException()
  }

  const restaurantLinks = await prisma.restaurantUser.findMany({
    where: { userId: user.id },
    select: {
      restaurantId: true,
      role: true,
      restaurant: { select: { name: true } },
    },
  });

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    restaurantLinks: restaurantLinks.map((link) => ({
      restaurantId: link.restaurantId,
      role: link.role,
      restaurantName: link.restaurant.name,
    })),
  });
};
