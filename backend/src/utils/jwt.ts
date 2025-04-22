import { Role } from '@prisma/client';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;
if (!secret) throw new Error('JWT_SECRET not defined');


export const generateToken = (payload: any) => {
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

export interface AuthPayload {
  id: number;
  role: Role;
}

export const verifyToken = (token: string): AuthPayload => {
  const decoded = jwt.verify(token, secret);

  if (typeof decoded === 'string') {
    throw new Error('Invalid token payload');
  }

  return decoded as AuthPayload;
};