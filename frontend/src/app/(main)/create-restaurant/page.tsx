// src/app/create-restaurant/page.tsx (Next.js 13+ app directory)
"use client";

import { createdRestaurant } from "@/services/restaurantService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CreateRestaurantPage() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("กรุณากรอกชื่อร้านอาหาร");
      return;
    }

    try {
      await createdRestaurant({name,address,image});
      toast.success("Created Restaurant Successfully")
      router.push('/home')
     
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในระบบ");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-4">สร้างร้านอาหาร</h1>

   
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">ชื่อร้าน *</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium">ที่อยู่</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium">ลิงก์รูปภาพ</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          สร้างร้าน
        </button>
      </form>
    </div>
  );
}
