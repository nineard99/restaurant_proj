import { Request, Response, NextFunction } from 'express';
import { RestaurantRole } from '@prisma/client';
import prisma from '../prisma/client';

export const authorizeRestaurantRole = (...roles: RestaurantRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {

        const userId = req.user?.id;
        const restaurantId = req.params.restaurantId || req.body.restaurantId;
  
        if (!userId || !restaurantId) {
            res.status(400).json({ message: 'Missing userId or restaurantId' });
            return;
        }
  
        const restaurantUser = await prisma.restaurantUser.findFirst({
          where: {
            userId,
            restaurantId,
          },
        });
  
        if (!restaurantUser || !roles.includes(restaurantUser.role)) {
          res.status(403).json({ message: 'Forbidden (restaurant role)' });
          return
        }
        // แนบ role หรือ restaurantUser ถ้าจำเป็นต้องใช้ต่อ
        // req.restaurantRole = restaurantUser.role;
        next();

    };
  };
