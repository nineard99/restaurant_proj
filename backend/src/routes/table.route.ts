import { Router } from "express";
import { createTableController, getAllTableController, updateActiveSeatableController } from "../controllers/table.controller";

const router = Router({ mergeParams: true }); 

router.post('/',createTableController)
router.get('/',getAllTableController)
router.patch('/:tableId',updateActiveSeatableController) 

export default router;
