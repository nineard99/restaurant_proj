"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddMenuComponent from "./create-Menu";
import { MenuItem } from "@/types/menu";
import { deleteMenu } from "@/services/menuService";
import toast from "react-hot-toast";

interface MenuList {
  menuList: Array<MenuItem>;
  restaurantId: string;
  onAddSuccess: () => void;
}

export default function MenuList({
  menuList,
  restaurantId,
  onAddSuccess,
}: MenuList) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const handleEdit = (item: MenuItem) => {
    // console.log("Edit item:", item);
    // คุณสามารถเปิดฟอร์มแก้ไขที่ใช้ข้อมูล item นี้ได้
  };

  const handleDelete = async (item: MenuItem) => {
    await deleteMenu(restaurantId, item.id);
    toast.success(`Deleted: ${item.id}`);
    onAddSuccess(); // รีเฟรชข้อมูล
    setSelectedItem(null); // ปิด popup
  };

  return (
    <>
      <motion.section
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 max-h-[80vh] flex flex-col overflow-hidden"
      >
        {/* ส่วนหัวข้อ (Sticky Top) */}
        <div className="p-6 border-b bg-white sticky top-0 z-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
              <span>Menu</span>
            </h2>
          </div>
        </div>

        {/* ส่วน scroll ได้ */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
          {menuList.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index + 1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="cursor-pointer flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-300 transition-all duration-300"
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="font-medium text-gray-900">{item.name}</span>
              </div>
              <span className="text-lg font-bold text-green-600">฿{item.price}</span>
            </motion.div>
          ))}
        </div>

        {/* ส่วนล่าง (Sticky Bottom) */}
        <div className="p-6 border-t bg-white sticky bottom-0 z-5">
          <AddMenuComponent
            addMenuSuccess={onAddSuccess}
            restaurantId={restaurantId}
          />
        </div>
      </motion.section>



      {/* Popup modal */}
      <AnimatePresence>
        
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {selectedItem.name}
              </h3>
              <img
                src={ selectedItem.image|| "/no-pic.png"} // เปลี่ยน path ตามจริง หรือ selectedItem.image ถ้ามี
                alt={selectedItem.name}
                className="rounded-lg mb-4 max-h-60 object-cover w-full"
              />
              <p className="text-gray-700 mb-4">{selectedItem.description}</p>
              <p className="text-lg font-bold text-green-600 mb-4">
                ฿{selectedItem.price}
              </p>

              <div className="flex justify-between space-x-3">
                <button
                  onClick={() => handleEdit(selectedItem)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition w-full"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => handleDelete(selectedItem)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition w-full"
                >
                  ลบ
                </button>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="mt-4 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition w-full"
              >
                ปิด
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
