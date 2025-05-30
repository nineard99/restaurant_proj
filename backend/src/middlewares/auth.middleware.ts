import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import prisma from '../prisma/client';
import { UnauthorizedException } from '../exceptions/http-exceptions';
import { ErrorCode } from '../exceptions/root';

const secret = process.env.JWT_SECRET;
if (!secret) throw new Error('JWT_SECRET not defined');

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  // ดึง token จาก cookie ก่อน (ต้องใช้ cookie-parser middleware ใน express app)
  const tokenFromCookie = req.cookies?.token;

  // ถ้าไม่มีใน cookie ให้ดึงจาก Authorization header
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    return next(new UnauthorizedException('No token provided', ErrorCode.UNAUTHORIZED));
  }

  try {
    const payload = jwt.verify(token, secret) as any;
    const user = await prisma.user.findUnique({ where: { id: payload.id } });

    if (!user) {
      return next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
  }
};
