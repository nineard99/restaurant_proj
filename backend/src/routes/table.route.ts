import { Router } from "express";
import { createTableController, getAllTableController } from "../controllers/table.controller";

const router = Router({ mergeParams: true }); 

router.post('/',createTableController)
router.get('/',getAllTableController)

export default router;
