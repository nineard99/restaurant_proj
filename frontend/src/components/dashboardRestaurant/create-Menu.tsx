"use client";

import { createdMenu } from "@/services/menuService";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";



interface AddMenuComponentProps {
  addMenuSuccess: () => void;
  restaurantId?: string;
}

export default function AddMenuComponent( {addMenuSuccess,restaurantId} : AddMenuComponentProps ) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("กรุณากรอกชื่อเมนู");
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0)
      return toast.error("กรุณากรอกราคาที่ถูกต้อง");

    setIsLoading(true);
    try {
      if (restaurantId) {
        await createdMenu({
          restaurantId,
          name,
          description,
          price: Number(price),
        });
        addMenuSuccess();
        toast.success("เพิ่มเมนูสำเร็จ");
        handleClose();
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการเพิ่มเมนู");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setIsOpen(false);
      setName("");
      setDescription("");
      setPrice("");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 rounded-xl transition-all"
      >
        + เพิ่มเมนูใหม่
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative z-10 bg-white rounded-xl w-full max-w-md p-6 shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">เพิ่มเมนูใหม่</h2>
                <button onClick={handleClose} className="text-2xl leading-none">×</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-medium">ชื่อเมนู *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block font-medium">รายละเอียด</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    rows={3}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block font-medium">ราคา (บาท) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    min="0"
                    step="0.01"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-100"
                    disabled={isLoading}
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800"
                    disabled={isLoading}
                  >
                    {isLoading ? "กำลังเพิ่ม..." : "เพิ่มเมนู"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
