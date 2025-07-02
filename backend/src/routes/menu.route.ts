import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRestaurantRole } from "../middlewares/restaurant-role.middleware";
import { createMenuController, deleteMenuItemController, getAllMenuController } from "../controllers/menu.controller";


const router = Router({ mergeParams: true }); 

router.get('/' ,getAllMenuController)
// router.get('/:menuId' ,[authenticate],authorizeRestaurantRole("OWNER"), getAllMenuController)
router.post('/', [authenticate],authorizeRestaurantRole("OWNER"),  createMenuController)
router.delete('/:menuId' , [authenticate],authorizeRestaurantRole("OWNER"), deleteMenuItemController)

export default router;
