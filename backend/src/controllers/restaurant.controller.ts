import { Request, Response } from "express";
import {
  BadRequestException,
  UnauthorizedException,
} from "../exceptions/http-exceptions";
import { createRestaurant, deleteRestaurantById, editRestaurantName, getAllRestaurantByUserId, getRestaurantById } from "../services/restaurant.service";

export const createRestaurantController = async (req: Request, res: Response) => {
  const { name, address, image } = req.body;

  if (!req.user || !req.user.id) {
    throw new UnauthorizedException();
  }

  const newRestaurant = await createRestaurant({
    name,
    address,
    image,
    ownerId: req.user.id,
  });
  res.json(newRestaurant);
};

export const findRestaurantByIdController = async(req: Request , res:Response) => {
  const {restaurantId} = req.params
  
  const restaurant = await getRestaurantById(restaurantId)
  res.json(restaurant)
}

export const getAllRestaurantByUserIdController = async(req: Request , res:Response) => {
  if (!req.user?.id) {
    throw new UnauthorizedException();
  }
  const restaurant = await getAllRestaurantByUserId(req.user.id)
  if(!restaurant) res.json([])
  res.json(restaurant)
}

export const deleteRestaurantByIdController =async (req:Request , res:Response) => {
  const {restaurantId} = req.params
  res.status(200).json(await deleteRestaurantById(restaurantId))
}

export const editRestaurantNameController =async (req:Request , res:Response) => {
  const {restaurantId} = req.params
  const { newName } = req.body
  const newRestaurant = await editRestaurantName(restaurantId,newName);
  res.status(200).json(newRestaurant)
}

