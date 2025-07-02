import { Request, Response } from "express";
import { createOrder, getAllOrder, getAllOrderBySession } from "../services/order.service";

export const createOrderController = async(req:Request,res:Response) => {
    const { orderItems  }  = req.body;
    const { restaurantId , sessionId } = req.params;
    const newOrder = await createOrder({ sessionId ,restaurantId,orderItems})
    res.json(newOrder) 
}

export const getAllOrderBySessionController =async (req:Request,res:Response) => {
    const { restaurantId , sessionId} = req.params
    const order =  await getAllOrderBySession(restaurantId, sessionId)
    res.json(order)  
}

export const getAllOrderController =async (req:Request,res:Response) => {
    const { restaurantId } = req.params
    const order = await getAllOrder(restaurantId)
    res.json(order)
}
