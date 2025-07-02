import { Router } from "express";
import authRoutes from './auth.route';
import menuRoutes from './menu.route';
import restaurantRoutes from './restaurant.route'
import tableRouters from './table.route'
import orderRouters from './order.route'
const router = Router(); 

router.use('/auth', authRoutes);
router.use('/restaurant' ,restaurantRoutes)
router.use('/:restaurantId/menu',menuRoutes)
router.use('/:restaurantId/table', tableRouters)
router.use('/:restaurantId/order', orderRouters)
export default router;