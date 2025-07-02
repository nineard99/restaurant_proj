"use client";
import React, { useEffect, useState } from "react";
import { ShoppingCart, Plus, Minus, X, Phone, Receipt, ClipboardList } from "lucide-react";
import { useParams } from "next/navigation";
import { getMenu } from "@/services/menuService";
import { createOrder, getAllOrderBySession } from "@/services/orderService";
import { MenuItem } from "@/types/menu";
import { CartItem, Order } from "@/types/order";
import toast from "react-hot-toast";




export default function page() {
  const params = useParams();
  const restaurantId = params?.restaurantId;
  const sessionId = params?.sessionId;
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showOrders, setShowOrders] = useState(false);
  const [menuItems,setMenuItems] = useState<MenuItem[]>([])

  useEffect(() => {
    fetchData();

  }, []);

  const fetchData = async () => {
    const menu = await getMenu(restaurantId as string);
    const order = await getAllOrderBySession(restaurantId as string,sessionId as string)
    const orderMap = order.map((item: any) => ({
      id: item.id,
      total: item.orderItems.length,
      items: item.orderItems.map((orderItem: any): CartItem => ({
        ...orderItem.menuItem,
        quantity: orderItem.quantity,
      })),
      status: item.status,
    }))
    setOrders(orderMap)
    const mapped = menu.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price
    }))
    setMenuItems(mapped)
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map(cartItem =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prev.filter(cartItem => cartItem.id !== itemId);
    });
  };

  // คำนวณราคารวม
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // คำนวณจำนวนรวม
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const placeOrder = async () => {
    const payload = {
      orderItems: cart.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity,
      }))
    };
    
    const success = await createOrder(restaurantId as string, sessionId as string, payload);
    if (success) {
      toast.success('Order placed successfully!');
      fetchData();    
      setCart([]);      
      setShowCart(false); 
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Order</h1>
              <p className="text-sm text-gray-500">โต๊ะ A1</p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setShowOrders(true)}
                className="px-2 py-1 bg-blue-500 text-white rounded-lg relative flex items-center gap-1 text-xs font-medium"
              >
                <ClipboardList size={16} />
                <span>ประวัติ</span>
                {orders.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {orders.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => alert("🔔 เรียกพนักงานแล้ว")}
                className="px-2 py-1 bg-green-500 text-white rounded-lg flex items-center gap-1 text-xs font-medium"
              >
                <Phone size={16} />
                <span>เรียกพนักงาน</span>
              </button>
              <button
                onClick={() => alert("📋 ขอเช็คบิลแล้ว")}
                className="px-2 py-1 bg-purple-500 text-white rounded-lg flex items-center gap-1 text-xs font-medium"
              >
                <Receipt size={16} />
                <span>เช็คบิล</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="p-4 pb-20">
        <div className="space-y-3">
          {menuItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="flex">
                <img
                  src={item.image || '/no-pic.png'}
                  alt={item.name}
                  className="w-20 h-20 object-cover"
                />
                <div className="flex-1 p-3">
                  <h3 className="font-semibold text-gray-800 text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-lg font-bold text-green-600">฿{item.price}</span>
                    <div className="flex items-center gap-2">
                      {cart.find(cartItem => cartItem.id === item.id) ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {cart.find(cartItem => cartItem.id === item.id)?.quantity}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                        >
                          เพิ่ม
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-20">
          <button
            onClick={() => setShowCart(true)}
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2"
          >
            <ShoppingCart size={20} />
            <span>ตะกร้า ({getTotalItems()})</span>
            <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
              ฿{getTotalPrice()}
            </span>
          </button>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">🛒 ตะกร้าของฉัน</h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-60">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-3 border-b">
                  <img
                    src={item.image || '/no-pic.png'}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-green-600 text-sm">฿{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">฿{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold">รวมทั้งหมด:</span>
                <span className="text-xl font-bold text-green-600">฿{getTotalPrice()}</span>
              </div>
              <button
                onClick={placeOrder}
                className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg"
              >
                📋 สั่งอาหาร
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Modal */}
      {showOrders && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b bg-white sticky top-0 z-10">
              <h2 className="text-lg font-semibold">📋 รายการสั่ง</h2>
              <button
                onClick={() => setShowOrders(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto">
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="text-gray-500">ยังไม่มีการสั่งอาหาร</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order, index) => (
                    <div key={order.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-sm">ออเดอร์ #{orders.length - index}</h3>
                          <p className="text-xs text-gray-500">
                            {/* {order.timestamp.toLocaleTimeString('th-TH')} */}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                            {order.status}
                          </span>
                          <p className="font-bold text-green-600 mt-1">฿{order.total}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <div key={`${order.id}-${item.id}`} className="flex justify-between text-xs">
                            <span>{item.name} x{item.quantity}</span>
                            <span>฿{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}