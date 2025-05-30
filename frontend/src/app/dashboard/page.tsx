"use client";
import { authorize } from "@/services/authService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type MenuItem = {
  id: number;
  name: string;
  price: number;
};

type Table = {
  id: number;
  name: string;
  qrCodeActive: boolean;
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await authorize();
      if (user && (user.role === "EMPLOYEE" || user.role === "SUPERADMIN")) {
        setHasAccess(true);
      } else {
        // ไม่มีสิทธิ์ให้ redirect หรือแสดงข้อความ
        router.push("/login"); // หรือหน้าอื่น ๆ ที่เหมาะสม
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) return <div>กำลังโหลดข้อมูล...</div>;
  if (!hasAccess) return <div>คุณไม่มีสิทธิ์เข้าถึงหน้านี้</div>;

  // const [menuItems, setMenuItems] = useState<MenuItem[]>([
  //   { id: 1, name: "ข้าวมันไก่", price: 40 },
  //   { id: 2, name: "ผัดไทย", price: 50 },
  // ]);
  // const [tables, setTables] = useState<Table[]>([
  //   { id: 1, name: "โต๊ะ 1", qrCodeActive: false },
  //   { id: 2, name: "โต๊ะ 2", qrCodeActive: true },
  // ]);

  // const toggleQrCode = (tableId: number) => {
  //   setTables((prev) =>
  //     prev.map((table) =>
  //       table.id === tableId
  //         ? { ...table, qrCodeActive: !table.qrCodeActive }
  //         : table
  //     )
  //   );
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">Dashboard ร้านอาหาร</h1>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* เมนูอาหาร */}
        <section className="bg-white rounded-3xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-green-700">เมนูอาหาร</h2>
          <ul className="divide-y divide-gray-200">
            {/* {menuItems.map((item) => (
              <li key={item.id} className="py-3 flex justify-between">
                <span>{item.name}</span>
                <span>{item.price} บาท</span>
              </li>
            ))} */}
          </ul>
          <button className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition">
            + เพิ่มเมนูใหม่
          </button>
        </section>

        {/* โต๊ะลูกค้า */}
        <section className="bg-white rounded-3xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">โต๊ะลูกค้า</h2>
          <ul className="divide-y divide-gray-200">
            {/* {tables.map((table) => (
              <li key={table.id} className="py-3 flex justify-between items-center">
                <span>{table.name}</span>
                <button
                  onClick={() => toggleQrCode(table.id)}
                  className={`px-4 py-2 rounded-xl font-semibold transition ${
                    table.qrCodeActive
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  {table.qrCodeActive ? "ยกเลิก QR" : "สร้าง QR"}
                </button>
              </li>
            ))} */}
          </ul>
        </section>
      </div>
    </div>
  );
}
