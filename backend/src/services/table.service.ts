import { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException } from "../exceptions/http-exceptions";
import { HttpException } from "../exceptions/root";
import prisma from "../prisma/client";
import crypto from "crypto";

type Table = {
  name: string;
  restaurantId: string;
};

export const createTable = async ({ name, restaurantId }: Table) => {
  if (!name?.trim()) {
    throw new BadRequestException("Table name is required.");
  }

  if (!restaurantId?.trim()) {
    throw new BadRequestException("Restaurant ID is required.");
  }

  const restaurant = await prisma.restaurant.findFirst({
    where: { id: restaurantId }
  });
  if (!restaurant) {
    throw new NotFoundException("Restaurant not found.");
  }

  try {
    const existing = await prisma.seatTable.findFirst({
      where: { name }
    });

    if (existing) {
      throw new ConflictException(`Table name "${name}" already exists.`);
    }

    const table = await prisma.seatTable.create({
      data: {
        name,
        isActive: false,
        restaurantId
      }
    });

    return table;
  } catch (error: any) {
    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException("Internal server error occurred.");
  }
};

export const getAllTable = async (restaurantId: string) => {
  if (!restaurantId?.trim()) {
    throw new BadRequestException("Restaurant ID is required.");
  }

  const restaurant = await prisma.restaurant.findFirst({
    where: { id: restaurantId }
  });

  if (!restaurant) {
    throw new NotFoundException("Restaurant not found.");
  }

  return await prisma.seatTable.findMany({
    where: { restaurantId }
  });
};

export const updateActiveSeatable = async (
  restaurantId: string,
  tableId: string,
  isActive: boolean,
  currentOccupancy?: number
) => {
  try {
    const seatTable = await prisma.seatTable.findFirst({
      where: {
        id: tableId,
        restaurantId
      }
    });

    if (!seatTable) {
      throw new NotFoundException("Table not found in this restaurant.");
    }

    let sessionId: string | null = null;

    if (isActive) {
      sessionId = crypto.randomBytes(8).toString("hex");
    }

    const updateData: any = {
      isActive,
      sessionId
    };

    if (typeof currentOccupancy === "number") {
      updateData.currentOccupancy = currentOccupancy;
    }

    const updatedTable = await prisma.seatTable.update({
      where: { id: tableId },
      data: updateData
    });

    return updatedTable;
  } catch (error: any) {
    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException("Internal server error occurred.");
  }
};
