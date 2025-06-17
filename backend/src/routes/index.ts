import { Router } from "express";
import authRoutes from './auth.route';
import menuRoutes from './menu.route';
import restaurantRoutes from './restaurant.route'
import tableRouters from './table.route'
const router = Router(); 

router.use('/auth', authRoutes);
router.use('/restaurant' ,restaurantRoutes)
router.use('/:restaurantId/menu',menuRoutes)
router.use('/:restaurantId/table', tableRouters)
export default router;