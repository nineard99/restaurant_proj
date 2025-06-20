import { UnauthorizedException } from "../exceptions/http-exceptions";
import { createTable, getAllTable, updateActiveSeatable } from "../services/table.service";


import { Request, Response } from "express";


export const createTableController = async (req: Request, res: Response) => {
  const { name }  = req.body;
  const { restaurantId } = req.params;


  const table = await createTable({
    name,
    restaurantId,
  });
  res.json(table);
};

export const getAllTableController = async (req:Request , res: Response) => {
    const { restaurantId } = req.params

  if (!restaurantId) {
     res.status(400).json({ message: "restaurantId is required" });
  }
  const menu = await getAllTable(restaurantId)
  res.json(menu)
  
}

export const updateActiveSeatableController =async (req:Request , res:Response) => {
  const { restaurantId , tableId } = req.params
  const { isActive , currentOccupancy} = req.body;
  const updateTable = await updateActiveSeatable(restaurantId,tableId,isActive,currentOccupancy)
  res.json(updateTable)
}
