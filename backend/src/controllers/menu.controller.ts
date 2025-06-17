import { createMenuItem, deleteMenuItem, getAllMenu, getMenuById } from "../services/menu.service";
import { Request, Response } from "express";


export const createMenuController = async (req: Request, res: Response) => {
    
    const { name, description , price  } = req.body;
    const {restaurantId} = req.params
    const newMenu = await createMenuItem({
      name,
      description,
      price,
      restaurantId
    });
    res.json(newMenu);
};

export const getAllMenuController = async (req:Request , res: Response) => {
    const { restaurantId } = req.params

  if (!restaurantId) {
     res.status(400).json({ message: "restaurantId is required" });
  }
  const menu = await getAllMenu(restaurantId)
  res.json(menu)
  
}

export const getMenuByIdController = async(req: Request , res:Response) => {
  const {menuId} = req.params

  res.json(await getMenuById(menuId))
}

export const deleteMenuItemController =async (req:Request , res:Response) => {
  const {menuId} = req.params
  res.status(200).json(await deleteMenuItem(menuId))
}