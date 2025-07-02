import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRestaurantRole } from "../middlewares/restaurant-role.middleware";
import { createMenuController, deleteMenuItemController, getAllMenuController } from "../controllers/menu.controller";
import multer from "multer";

const upload = multer(); // ใช้ memory storage
const router = Router({ mergeParams: true }); 

router.get('/' ,getAllMenuController)
// router.get('/:menuId' ,[authenticate],authorizeRestaurantRole("OWNER"), getAllMenuController)
router.post(
    '/',
    [authenticate, authorizeRestaurantRole("OWNER"), upload.single("image")],
    createMenuController
  );
router.delete('/:menuId' , [authenticate],authorizeRestaurantRole("OWNER"), deleteMenuItemController)

export default router;
