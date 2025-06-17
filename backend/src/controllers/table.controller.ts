import { UnauthorizedException } from "../exceptions/http-exceptions";
import { createTable, getAllTable } from "../services/table.service";


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

