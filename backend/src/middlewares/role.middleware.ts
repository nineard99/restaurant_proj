// src/middlewares/role.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role;
    if (!userRole || !roles.includes(userRole)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    next();
  };
};
