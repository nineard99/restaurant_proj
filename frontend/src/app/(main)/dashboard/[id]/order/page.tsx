"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAllOrder, updateStatusOrder } from "@/services/orderService";

type OrderStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

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

const getNextStatus = (status: OrderStatus): OrderStatus | null => {
  if (status === "PENDING") return "CONFIRMED";
  if (status === "CONFIRMED") return "COMPLETED";
  return null;
};

const timeAgo = (timestamp: string): string => {
  const now = new Date();
  const createdAt = new Date(timestamp);
  const diff = Math.floor((now.getTime() - createdAt.getTime()) / 1000);
  if (diff < 60) return `${diff} sec ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return createdAt.toLocaleString();
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
    const data = await getAllOrder(restaurantId);
    setOrders(data);
  };

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      const updated = await updateStatusOrder(restaurantId, orderId, newStatus);
      if (updated) fetchOrders();
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  // กรองตามสถานะ ถ้า ALL แสดงทั้งหมด
  const filteredOrders =
    filterStatus === "ALL"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  // ถ้า filter ALL ให้แบ่งกลุ่มตามสถานะเหมือนเดิม
  // ถ้า filter เฉพาะสถานะ ให้แสดงแค่กลุ่มนั้นเดียว
  const renderSection = (
    status: OrderStatus,
    label: string,
    bg: string,
    ordersList: Order[]
  ) => {
    if (ordersList.length === 0) return null;

    return (
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{label}</h2>
        <div className="grid gap-4">
          {ordersList.map((order) => (
            <div
              key={order.id}
              className={`rounded-xl p-5 shadow-md border-2 ${bg}`}
            >
              <div className="flex justify-between text-lg font-semibold mb-2">
                <span>🪑 Table: {order.tableName}</span>
                <span className="text-gray-500 text-sm">
                  {timeAgo(order.createdAt)}
                </span>
              </div>

              <ul className="list-disc pl-6 text-lg text-gray-800 mb-4">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.name} × {item.quantity}
                  </li>
                ))}
              </ul>

              <div className="flex gap-2 flex-wrap">
                {getNextStatus(order.status) && (
                  <button
                    onClick={() =>
                      handleUpdateStatus(order.id, getNextStatus(order.status)!)
                    }
                    className="px-4 py-2 bg-green-700 text-white rounded-lg text-base font-medium hover:bg-green-600 transition"
                  >
                    ✅ Mark as {getNextStatus(order.status)}
                  </button>
                )}
                {order.status !== "CANCELLED" &&
                  order.status !== "COMPLETED" && (
                    <button
                      onClick={() =>
                        handleUpdateStatus(order.id, "CANCELLED")
                      }
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-base font-medium hover:bg-red-500 transition"
                    >
                      ❌ Cancel Order
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // สำหรับแสดงกลุ่มสถานะ เมื่อ filter เป็น ALL
  const groupedSections = (
    <>
      {renderSection(
        "PENDING",
        "⏳ Pending Orders",
        "border-yellow-400 bg-yellow-50",
        orders.filter((o) => o.status === "PENDING")
      )}
      {renderSection(
        "CONFIRMED",
        "✅ Confirmed Orders",
        "border-blue-400 bg-blue-50",
        orders.filter((o) => o.status === "CONFIRMED")
      )}
      {renderSection(
        "COMPLETED",
        "✔️ Completed Orders",
        "border-green-400 bg-green-50",
        orders.filter((o) => o.status === "COMPLETED")
      )}
      {renderSection(
        "CANCELLED",
        "❌ Cancelled Orders",
        "border-red-400 bg-red-50",
        orders.filter((o) => o.status === "CANCELLED")
      )}
    </>
  );

  return (
    <main className="min-h-screen pt-20 bg-gray-100 px-6 py-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Orders Management Dashboard
      </h1>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {(["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const).map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-semibold border transition ${
                filterStatus === status
                  ? "bg-gray-800 text-white border-gray-800"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {status === "ALL"
                ? "All"
                : status === "PENDING"
                ? "⏳ Pending"
                : status === "CONFIRMED"
                ? "✅ Confirmed"
                : status === "COMPLETED"
                ? "✔️ Completed"
                : "❌ Cancelled"}
            </button>
          )
        )}
      </div>

      {/* Order Sections */}
      {filterStatus === "ALL"
        ? groupedSections
        : renderSection(
            filterStatus,
            filterStatus === "PENDING"
              ? "⏳ Pending Orders"
              : filterStatus === "CONFIRMED"
              ? "✅ Confirmed Orders"
              : filterStatus === "COMPLETED"
              ? "✔️ Completed Orders"
              : "❌ Cancelled Orders",
            filterStatus === "PENDING"
              ? "border-yellow-400 bg-yellow-50"
              : filterStatus === "CONFIRMED"
              ? "border-blue-400 bg-blue-50"
              : filterStatus === "COMPLETED"
              ? "border-green-400 bg-green-50"
              : "border-red-400 bg-red-50",
            filteredOrders
          )}
    </main>
  );
}
