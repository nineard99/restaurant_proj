// src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { GlobalRole } from '@prisma/client';

const secret = process.env.JWT_SECRET;
if (!secret) throw new Error('JWT_SECRET not defined');

export interface AuthPayload {
  id: string;
  role: GlobalRole;
}

export const generateToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

export const verifyToken = (token: string): AuthPayload => {
  const decoded = jwt.verify(token, secret);

  if (typeof decoded === 'string') {
    throw new Error('Invalid token payload');
  }

  return decoded as AuthPayload;
};
