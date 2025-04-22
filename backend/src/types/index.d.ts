import { Role } from '@prisma/client'; // เอา enum มาจาก Prisma

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: Role;
      };
    }
  }
}
