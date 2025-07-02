import { User } from '@prisma/client';

declare module 'express' {
  export interface Request {
    user?: User;
    restaurantRole?: RestaurantRole;
    file?: Multer.File;
    files?: Multer.File[]; 
  }
 
}
