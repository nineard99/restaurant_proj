"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAllOrder } from "@/services/orderService";

type OrderStatus = "PENDING" | "CONFIRMED" | "DONE" | "CANCELLED";

interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  id: string;
  tableName: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
}

// ฟังก์ชันคืนสถานะถัดไป
const getNextStatus = (status: OrderStatus): OrderStatus | null => {
  if (status === "PENDING") return "CONFIRMED";
  if (status === "CONFIRMED") return "DONE";
  return null;
};

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "ALL">("ALL");
  const params = useParams();
  const restaurantId = params.id as string;

  useEffect(() => {
    fetchOrders();
  }, [restaurantId]);

  const fetchOrders = async () => {
    const Order = await getAllOrder(restaurantId);
    setOrders(Order);
  };

  const handleUpdateStatus = (id: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? {
              ...order,
              status: getNextStatus(order.status) || order.status,
            }
          : order
      )
    );
  };

  // กำหนดลำดับสถานะ เพื่อ sort
  const statusOrder: Record<OrderStatus, number> = {
    PENDING: 0,
    CONFIRMED: 1,
    DONE: 2,
    CANCELLED: 3,
  };

  const sortedOrders = [...orders].sort(
    (a, b) => statusOrder[a.status] - statusOrder[b.status]
  );

  const filteredOrders =
    filterStatus === "ALL"
      ? sortedOrders
      : sortedOrders.filter((order) => order.status === filterStatus);

  return (
    <main className="min-h-screen pt-20 bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        👨‍🍳 จัดการออเดอร์ในครัว
      </h1>

      {/* ปุ่มกรอง */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(["ALL", "PENDING", "CONFIRMED", "DONE", "CANCELLED"] as const).map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 text-sm rounded-lg border ${
                filterStatus === status
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
            >
              {status === "ALL"
                ? "ดูทั้งหมด"
                : status === "PENDING"
                ? "⏳ รอดำเนินการ"
                : status === "CONFIRMED"
                ? "✅ ยืนยันแล้ว"
                : status === "DONE"
                ? "✔️ เสร็จแล้ว"
                : "❌ ยกเลิก"}
            </button>
          )
        )}
      </div>

      {/* กล่องแสดงออเดอร์ */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-4 max-h-[75vh] overflow-y-auto">
        {filteredOrders.length === 0 ? (
          <p className="text-gray-500 text-center">ยังไม่มีออเดอร์</p>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className={`border-b pb-4 last:border-b-0 last:pb-0 ${
                order.status === "PENDING"
                  ? "bg-yellow-50"
                  : order.status === "CONFIRMED"
                  ? "bg-blue-50"
                  : order.status === "DONE"
                  ? "bg-green-50"
                  : order.status === "CANCELLED"
                  ? "bg-red-50"
                  : ""
              } rounded-lg px-4 py-3`}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                <div className="text-sm text-gray-700">
                  🪑 โต๊ะ: {order.tableName}
                </div>
                <div className="text-sm text-gray-500">
                  📅 {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>

              <ul className="list-disc list-inside text-gray-800 pl-4">
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} x {item.quantity}
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  สถานะ:{" "}
                  <span className="font-semibold">
                    {order.status === "PENDING"
                      ? "⏳ รอดำเนินการ"
                      : order.status === "CONFIRMED"
                      ? "✅ ยืนยันแล้ว"
                      : order.status === "DONE"
                      ? "✔️ เสร็จแล้ว"
                      : "❌ ยกเลิก"}
                  </span>
                </span>

                {getNextStatus(order.status) && (
                  <button
                    onClick={() => handleUpdateStatus(order.id)}
                    className="px-3 py-1 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
                  >
                    เปลี่ยนเป็น {getNextStatus(order.status)}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
