import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { createRestaurantController, deleteRestaurantByIdController, editRestaurantNameController, findRestaurantByIdController, getAllRestaurantByUserIdController } from "../controllers/restaurant.controller";
import { authorizeRestaurantRole } from "../middlewares/restaurant-role.middleware";

const router = Router();

router.post("/create", [authenticate], createRestaurantController);
router.get("/:restaurantId" ,[authenticate],authorizeRestaurantRole("OWNER") , findRestaurantByIdController);
router.get("/" ,[authenticate] , getAllRestaurantByUserIdController);
router.patch("/:restaurantId/editName" ,[authenticate] ,authorizeRestaurantRole("OWNER"), editRestaurantNameController);
router.delete("/:restaurantId" , [authenticate], deleteRestaurantByIdController);
export default router;
