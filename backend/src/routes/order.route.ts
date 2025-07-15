import { Router } from "express";
import { createOrderController, getAllOrderBySessionController, getAllOrderController, updateOrderStatusController } from "../controllers/order.controller";


const router = Router({ mergeParams: true }); 

router.post('/:sessionId',createOrderController)
router.patch('/:orderId/status' , updateOrderStatusController)
router.get('/:sessionId',getAllOrderBySessionController)
router.get('/',getAllOrderController)
export default router