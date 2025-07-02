import { Orders } from "@prisma/client";
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from "../exceptions/http-exceptions";
import { HttpException } from "../exceptions/root";
import prisma from "../prisma/client";

type CreateOrderInput = {
  sessionId: string;
  restaurantId: string;
  orderItems: {
    menuItemId: string;
    quantity: number;
  }[];
};

export const createOrder = async ({
  sessionId,
  restaurantId,
  orderItems,
}: CreateOrderInput) => {
  if (!restaurantId || restaurantId.trim() === "") {
    throw new BadRequestException("Restaurant ID is required.");
  }
  if (!sessionId || sessionId.trim() === "") {
    throw new BadRequestException("Session ID is required.");
  }
  if (!orderItems || orderItems.length <= 0) {
    throw new BadRequestException("Order items are required.");
  }

  try {
    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId },
    });
    if (!restaurant) throw new NotFoundException("Restaurant not found.");

    const session = await prisma.seatTable.findFirst({
      where: { sessionId: sessionId },
    });
    if (!session) throw new NotFoundException("Session not found.");

    const tableId = session.id;

    const order = await prisma.orders.create({
      data: {
        tableId: tableId,
        restaurantId: restaurantId,
        status: "PENDING",
      },
    });

    await prisma.orderItem.createMany({
      data: orderItems.map((item) => ({
        orderId: order.id,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
      })),
    });

    const fullOrder = await prisma.orders.findUnique({
      where: { id: order.id },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        table: false,
        restaurant: false,
      },
    });

    return fullOrder;
  } catch (error: any) {
    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException(
      "An unexpected error occurred while creating the order."
    );
  }
};

export const getAllOrderBySession = async (
  restaurantId: string,
  sessionId: string
) => {
  if (!restaurantId || restaurantId.trim() === "") {
    throw new BadRequestException("Restaurant ID is required.");
  }
  if (!sessionId || sessionId.trim() === "") {
    throw new BadRequestException("Session ID is required.");
  }

  try {
    const seatTable = await prisma.seatTable.findFirst({
      where: { sessionId: sessionId },
    });
    if (!seatTable) {
      throw new NotFoundException("Session not found.");
    }

    const orders = await prisma.orders.findMany({
      where: { restaurantId: restaurantId, tableId: seatTable.id },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        table: false,
        restaurant: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders;
  } catch (error: any) {
    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException(
      "An error occurred while retrieving orders for the session."
    );
  }
};

export const getAllOrder = async (restaurantId: string) => {
  if (!restaurantId || restaurantId.trim() === "") {
    throw new BadRequestException("Restaurant ID is required.");
  }

  try {
    const rawOrders = await prisma.orders.findMany({
      where: { restaurantId },
      include: {
        orderItems: {
          include: {
            menuItem: {
              select: { id: true, name: true },
            },
          },
        },
        table: {
          select: { name: true },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return rawOrders.map((order) => ({
      id: order.id,
      tableName: order.table.name,
      createdAt: order.createdAt.toISOString(),
      status: order.status,
      items: order.orderItems.map((item) => ({
        itemId: item.menuItem.id,
        name: item.menuItem.name,
        quantity: item.quantity,
      })),
    }));
  } catch (error: any) {
    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException(
      "An error occurred while retrieving all orders."
    );
  }
};
