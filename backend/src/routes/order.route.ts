import { Router } from "express";
import { createOrderController, getAllOrderBySessionController, getAllOrderController } from "../controllers/order.controller";


const router = Router({ mergeParams: true }); 

router.post('/:sessionId',createOrderController)
router.get('/:sessionId',getAllOrderBySessionController)
router.get('/',getAllOrderController)
export default router