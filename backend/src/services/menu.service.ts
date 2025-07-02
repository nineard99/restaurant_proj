import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from "../exceptions/http-exceptions";
import { HttpException } from "../exceptions/root";
import prisma from "../prisma/client";

type Menu = {
  name: string;
  description?: string;
  price: number;
  restaurantId: string;
};

export const createMenuItem = async ({
  name,
  description,
  price,
  restaurantId,
}: Menu) => {
  if (!name || name.trim() === "") {
    throw new BadRequestException("Menu name is required.");
  }
  if (!restaurantId || restaurantId.trim() === "") {
    throw new BadRequestException("Restaurant ID is required.");
  }

  try {
    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId },
    });
    if (!restaurant) throw new NotFoundException("Restaurant not found.");

    const existing = await prisma.menuItem.findFirst({
      where: {
        name: name,
        restaurantId: restaurantId,
      },
    });
    if (existing) {
      throw new ConflictException(
        "A menu item with this name already exists in this restaurant."
      );
    }

    const menu = await prisma.menuItem.create({
      data: {
        name: name,
        description: description ?? null,
        price: price,
        restaurantId: restaurantId,
      },
    });
    return menu;
  } catch (error: any) {
    if (error instanceof HttpException) throw error;

    throw new InternalServerErrorException(
      "An unexpected error occurred while creating the menu item."
    );
  }
};

export const getAllMenu = async (restaurantId: string) => {
  if (!restaurantId || restaurantId.trim() === "") {
    throw new BadRequestException("Restaurant ID is required.");
  }

  try {
    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId },
    });
    if (!restaurant) throw new NotFoundException("Restaurant not found.");

    const menu = await prisma.menuItem.findMany({
      where: { restaurantId: restaurantId },
    });
    return menu;
  } catch (error: any) {
    if (error instanceof HttpException) throw error;

    throw new InternalServerErrorException(
      "An error occurred while retrieving menu items."
    );
  }
};

export const getMenuById = async (menuId: string) => {
  if (!menuId || menuId.trim() === "") {
    throw new BadRequestException("Menu ID is required.");
  }

  try {
    const menu = await prisma.menuItem.findUnique({
      where: { id: menuId },
    });
    if (!menu) throw new NotFoundException("Menu item not found.");

    return menu;
  } catch (error: any) {
    if (error instanceof HttpException) throw error;

    throw new InternalServerErrorException(
      "An error occurred while retrieving the menu item."
    );
  }
};

export const deleteMenuItem = async (menuId: string) => {
  if (!menuId || menuId.trim() === "") {
    throw new BadRequestException("Menu ID is required.");
  }

  try {
    const menu = await prisma.menuItem.findUnique({
      where: { id: menuId },
    });
    if (!menu) throw new NotFoundException("Menu item not found.");

    await prisma.menuItem.delete({
      where: { id: menuId },
    });

    return { message: "Menu item deleted successfully." };
  } catch (error: any) {
    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException(
      "An error occurred while deleting the menu item."
    );
  }
};
