import { createMenuItem, deleteMenuItem, getAllMenu, getMenuById } from "../services/menu.service";
import { Request, Response } from "express";
import { uploadImageToCloudinary } from "../services/upload.service";
import prisma from "../prisma/client";


export const createMenuController = async (req: Request, res: Response) => {
  const { name, description, price } = req.body;
  const { restaurantId } = req.params;

    // 1. สร้าง menuItem ก่อน (ยังไม่ใส่ image)
    const menu = await createMenuItem({
      name,
      description,
      price: parseFloat(price),
      restaurantId,
      image: undefined,
    });

    let imageUrl: string | undefined = undefined;

    // 2. ถ้ามีไฟล์ภาพ → อัปโหลดโดยใช้ menu.id เป็น public_id
    if (req.file) {
      const uploadResult = await uploadImageToCloudinary(
        req.file.buffer,
        "menus",
        menu.id // 👈 ใช้ menuId เป็นชื่อรูป
      );
      imageUrl = uploadResult.secure_url;

      // 3. อัปเดต image ลง DB
      await prisma.menuItem.update({
        where: { id: menu.id },
        data: { image: imageUrl },
      });
    }

    // 4. ส่งข้อมูล menu กลับ (พร้อม image ถ้ามี)
    const finalMenu = await prisma.menuItem.findUnique({
      where: { id: menu.id },
    });

    res.status(201).json(finalMenu);
  
};


export const getAllMenuController = async (req:Request , res: Response) => {
    const { restaurantId } = req.params

  if (!restaurantId) {
     res.status(400).json({ message: "restaurantId is required" });
  }
  const menu = await getAllMenu(restaurantId)
  res.json(menu)
  
}

export const getMenuByIdController = async(req: Request , res:Response) => {
  const {menuId} = req.params

  res.json(await getMenuById(menuId))
}

export const deleteMenuItemController =async (req:Request , res:Response) => {
  const {menuId} = req.params
  res.status(200).json(await deleteMenuItem(menuId))
}