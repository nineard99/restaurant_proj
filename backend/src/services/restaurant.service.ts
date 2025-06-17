import { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException } from "../exceptions/http-exceptions"
import prisma from "../prisma/client"

type Restaurant = {
    name: string
    address?: string
    image?: string
    ownerId: string
}

export const createRestaurant = async ({
    name,
    address,
    image,
    ownerId
  }: Restaurant) => {
    if (!name || name.trim() === '') {
      throw new BadRequestException("Restaurant name is required")
    }
    if (!ownerId || ownerId.trim() === '') {
      throw new BadRequestException("Owner ID is required")
    }
  
    try {
      const existing = await prisma.restaurant.findFirst({
        where: { name: name }
      })
      if (existing) {
        throw new ConflictException("Restaurant with this name already exists")
      }
  
      // สร้างร้านอาหาร พร้อมความสัมพันธ์กับ user (owner)
      const restaurant = await prisma.restaurant.create({
        data: {
          name: name,
          address: address ?? null,
          image: image ?? null,
          users: {
            create: {
              userId: ownerId,
              role: 'OWNER',
            }
          }
        },
        include: {
          users: true
        }
      })
      return restaurant
    } catch (error: any) {
      // กรณี error จาก prisma หรืออื่นๆ
      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error
      }
      throw new InternalServerErrorException(error.message)
    }
}


export const getRestaurantById = async (restaurantId: string) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return restaurant;
  } catch (error) {
    throw new InternalServerErrorException;
  }

}

export const getAllRestaurantByUserId = async (userId: string) => {
  try {
    if (!userId || userId.trim() === '') {
      throw new BadRequestException("User ID is required")
    }
  
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
  } catch (error) {
    throw error;
  }
};

export const deleteRestaurantById = async (restaurantId: string) => {
  if (!restaurantId || restaurantId.trim() === "") {
    throw new BadRequestException("Restaurant ID is required");
  }

  try {
    const existing = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!existing) {
      throw new NotFoundException("Restaurant not found");
    }

    // 1. ลบ OrderItem ทั้งหมดของ Restaurant
    await prisma.orderItem.deleteMany({
      where: {
        order: {
          restaurantId: restaurantId,
        },
      },
    });

    // 2. ลบ Order ทั้งหมดของ Restaurant
    await prisma.order.deleteMany({
      where: {
        restaurantId: restaurantId,
      },
    });

    // 3. ลบ MenuItem ของร้านนี้
    await prisma.menuItem.deleteMany({
      where: {
        restaurantId: restaurantId,
      },
    });

    // 4. ลบ Table ของร้านนี้
    await prisma.seatTable.deleteMany({
      where: {
        restaurantId: restaurantId,
      },
    });

    // 5. ลบความสัมพันธ์ RestaurantUser
    await prisma.restaurantUser.deleteMany({
      where: {
        restaurantId: restaurantId,
      },
    });

    // 6. ลบร้านอาหาร
    await prisma.restaurant.delete({
      where: { id: restaurantId },
    });

    return { message: "Restaurant deleted successfully" };
  } catch (error: any) {
    throw new InternalServerErrorException(error.message);
  }
};