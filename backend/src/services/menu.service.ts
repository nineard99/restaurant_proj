import { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException } from "../exceptions/http-exceptions"
import prisma from "../prisma/client"

type Menu = {
    name: string
    description?: string
    price: number
    restaurantId: string
}

export const createMenuItem = async ({
    name,
    description,
    price,
    restaurantId
  }: Menu) => {
    if (!name || name.trim() === '') {
      throw new BadRequestException("Menu name is required")
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
        const existing = await prisma.menuItem.findFirst({
            where: {
              name: name,
              restaurantId: restaurantId
            }
          })
        if (existing) {
            throw new ConflictException("Menu with this name already exists in this restaurant")
        }
      
  
      const menu = await prisma.menuItem.create({
        data: {
          name: name,
          description: description ?? null,
          price: price, 
          restaurantId: restaurantId
        }
      })
      return menu
    } catch (error: any) {
      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error
      }
      throw new InternalServerErrorException(error.message)
    }
}


export const getAllMenu = async (restaurantId: string) => {
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
    
      const menu = await prisma.menuItem.findMany({
        where: {
            restaurantId: restaurantId,
        },
      });
      
      return menu
    } catch (error) {
      throw error;
    }
};

export const getMenuById = async (menuId: string) => {
  try {
    const menu = await prisma.menuItem.findUnique({
      where: { id: menuId },
    });

    if (!menuId) {
      throw new NotFoundException('Menu not found');
    }

    return menu;
  } catch (error) {
    throw new InternalServerErrorException;
  }

}


export const deleteMenuItem = async (menuId: string) => {
  if (!menuId || menuId.trim() === '') {
    throw new BadRequestException("menuId is required");
  }
  try {

    const menu = await prisma.menuItem.findUnique({
      where: { id: menuId }
    });

    if (!menu) {
      throw new NotFoundException("Menu not found");
    }

    await prisma.menuItem.delete({
      where: { id: menuId }
    });

    return { message: "Menu item deleted successfully" };
  } catch (error: any) {
    throw new InternalServerErrorException(error.message);
  }
};