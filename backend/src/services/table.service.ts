import { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException } from "../exceptions/http-exceptions"
import prisma from "../prisma/client"

type Table = {
    name: string
    restaurantId: string
}

export const createTable = async ({
    name,
    restaurantId
  }: Table) => {
    if (!name || name.trim() === '') {
      throw new BadRequestException("name is required")
    }
    
    if (!restaurantId || restaurantId.trim() === '') {
      throw new BadRequestException("RestaurantId is required")
    }
    const restaurant = await prisma.restaurant.findFirst({
        where:{
            id : restaurantId
        }
      })
      if(!restaurant) throw new NotFoundException("Not found Restaurant")
    
  
    try {
        const existing = await prisma.seatTable.findFirst({
            where:{
                name : name
            }
          })        
        if (existing) {
            throw new ConflictException("name already exist")
        }
      
  
      const table = await prisma.seatTable.create({
        data: {
          name: name,
          isOccupied: false ,
          restaurantId: restaurantId
        }
      })
      return table
    } catch (error: any) {
      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error
      }
      throw new InternalServerErrorException(error.message)
    }
}


export const getAllTable= async (restaurantId: string) => {
    try {
      if (!restaurantId || restaurantId.trim() === '') {
        throw new BadRequestException("restaurantId is required")
      }
      const restaurant = await prisma.restaurant.findFirst({
        where:{
            id : restaurantId
        }
      })
      if(!restaurant) throw new NotFoundException("Not found Restaurant")
    
      const table = await prisma.seatTable.findMany({
        where: {
            restaurantId: restaurantId
        },
      });
      
      return table
    } catch (error) {
      throw error;
    }
};