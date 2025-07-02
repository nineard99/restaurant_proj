import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from "../exceptions/http-exceptions";
import { HttpException } from "../exceptions/root";
import prisma from "../prisma/client";

type Restaurant = {
  name: string;
  address?: string;
  image?: string;
  ownerId: string;
};

export const createRestaurant = async ({
  name,
  address,
  image,
  ownerId,
}: Restaurant) => {
  if (!name || name.trim() === "") {
    throw new BadRequestException("Restaurant name is required.");
  }
  if (!ownerId || ownerId.trim() === "") {
    throw new BadRequestException("Owner ID is required.");
  }

  try {
    const existing = await prisma.restaurant.findFirst({
      where: { name: name },
    });
    if (existing) {
      throw new ConflictException(
        "A restaurant with this name already exists. Please choose a different name."
      );
    }

    // Create restaurant with owner relationship
    const restaurant = await prisma.restaurant.create({
      data: {
        name: name,
        address: address ?? null,
        image: image ?? null,
        users: {
          create: {
            userId: ownerId,
            role: "OWNER",
          },
        },
      },
      include: {
        users: true,
      },
    });

    return restaurant;
  } catch (error: any) {
    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException(
      "An unexpected error occurred while creating the restaurant."
    );
  }
};

export const getRestaurantById = async (restaurantId: string) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException("Restaurant not found.");
    }

    return restaurant;
  } catch (error: any) {
    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException(
      "An error occurred while retrieving the restaurant."
    );
  }
};

export const getAllRestaurantByUserId = async (userId: string) => {
  if (!userId || userId.trim() === "") {
    throw new BadRequestException("User ID is required.");
  }

  try {
    const restaurants = await prisma.restaurantUser.findMany({
      where: {
        userId: userId,
      },
      include: {
        restaurant: true,
      },
    });

    return restaurants.map((ele) => ({
      restaurant: ele.restaurant,
      role: ele.role,
    }));
  } catch (error: any) {
    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException(
      "An error occurred while retrieving user's restaurants."
    );
  }
};

export const deleteRestaurantById = async (restaurantId: string) => {
  if (!restaurantId || restaurantId.trim() === "") {
    throw new BadRequestException("Restaurant ID is required.");
  }

  try {
    const existing = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!existing) {
      throw new NotFoundException("Restaurant not found.");
    }

    await prisma.$transaction(async (prisma) => {
      await prisma.orderItem.deleteMany({ where: { order: { restaurantId } } });
      await prisma.orders.deleteMany({ where: { restaurantId } });
      await prisma.menuItem.deleteMany({ where: { restaurantId } });
      await prisma.seatTable.deleteMany({ where: { restaurantId } });
      await prisma.restaurantUser.deleteMany({ where: { restaurantId } });
      await prisma.restaurant.delete({ where: { id: restaurantId } });
    });

    return { message: "Restaurant deleted successfully." };
  } catch (error: any) {
    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException(
      "An error occurred while deleting the restaurant."
    );
  }
};
