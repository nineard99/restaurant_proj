"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { ShoppingCart, Plus, Minus, Receipt, Users, X, ClipboardList, Eye } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface OrderHistory {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: Date;
  status: 'รอทำ' | 'กำลังทำ' | 'เสร็จแล้ว';
}

const mockMenu: MenuItem[] = [
  {
    id: "1",
    name: "ข้าวผัดกะเพรา",
    description: "ข้าวผัดกะเพราหมูสับรสจัดจ้าน เสิร์ฟพร้อมไข่ดาว",
    price: 60,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop",
    category: "อาหารจานเดียว"
  },
  {
    id: "2",
    name: "ต้มยำกุ้ง",
    description: "ต้มยำกุ้งรสแซ่บ หอมสมุนไพร กุ้งใหญ่สด",
    price: 120,
    image: "https://images.unsplash.com/photo-1559847844-d721426d6edc?w=300&h=200&fit=crop",
    category: "แกง/ต้ม"
  },
  {
    id: "3",
    name: "ผัดไทย",
    description: "ผัดไทยเส้นจันท์ใส่กุ้ง รสชาติต้นตำรับ",
    price: 80,
    image: "https://images.unsplash.com/photo-1559314809-0f31657def5e?w=300&h=200&fit=crop",
    category: "ผัด"
  },
  {
    id: "4",
    name: "ส้มตำไทย",
    description: "ส้มตำไทยแท้ เปรี้ยวหวานเผ็ดจัดจ้าน",
    price: 50,
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=200&fit=crop",
    category: "ยำ/สลัด"
  },
  {
    id: "5",
    name: "แกงเขียวหวานไก่",
    description: "แกงเขียวหวานไก่ กะทิหอม เผ็ดกำลังดี",
    price: 90,
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=300&h=200&fit=crop",
    category: "แกง/ต้ม"
  },
  {
    id: "6",
    name: "น้ำมะนาวโซดา",
    description: "น้ำมะนาวโซดาสดชื่น เปรี้ยวหวานกำลังดี",
    price: 35,
    image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=300&h=200&fit=crop",
    category: "เครื่องดื่ม"
  }
];

export default function OrderPage() {
  const params = useParams();
  const restaurantId = params?.restaurantId;
  const tableId = params?.tableId;

  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("ทั้งหมด");
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
  const [showOrderHistory, setShowOrderHistory] = useState(false);

  const categories = ["ทั้งหมด", ...Array.from(new Set(mockMenu.map(item => item.category)))];

  const filteredMenu = selectedCategory === "ทั้งหมด" 
    ? mockMenu 
    : mockMenu.filter(item => item.category === selectedCategory);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
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
      const existingItem = prev.find(cartItem => cartItem.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(cartItem =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prev.filter(cartItem => cartItem.id !== itemId);
    });
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCallStaff = () => {
    alert("🔔 เรียกพนักงานแล้ว! พนักงานจะมาที่โต๊ะของคุณในไม่ช้า");
  };

  const handleCheckBill = () => {
    alert("📋 ขอเช็คบิล! พนักงานจะนำบิลมาให้ในไม่ช้า");
  };

  const placeOrder = () => {
    if (cart.length === 0) return;
    
    const newOrder: OrderHistory = {
      id: Date.now().toString(),
      items: [...cart],
      total: getTotalPrice(),
      timestamp: new Date(),
      status: 'รอทำ'
    };
    
    setOrderHistory(prev => [...prev, newOrder]);
    setCart([]);
    setShowCart(false);
    
    alert(`📝 สั่งอาหารแล้ว!\nรหัสออเดอร์: ${newOrder.id}\nรายการ: ${cart.map(item => `${item.name} x${item.quantity}`).join(', ')}\nรวม: ฿${newOrder.total}\n\nอาหารจะเสิร์ฟในไม่ช้า!`);
  };

  const getTotalOrderValue = () => {
    return orderHistory.reduce((total, order) => total + order.total, 0);
  };

  const getTotalOrderCount = () => {
    return orderHistory.reduce((total, order) => 
      total + order.items.reduce((itemTotal, item) => itemTotal + item.quantity, 0), 0
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-orange-400">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">🍽️ เมนูอาหาร</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="bg-orange-100 px-3 py-1 rounded-full">
                  🏪 {restaurantId}
                </span>
                <span className="bg-blue-100 px-3 py-1 rounded-full">
                  🪑 โต๊ะ {tableId}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowOrderHistory(true)}
                className="bg-purple-500 hover:bg-purple-600 flex items-center text-white p-4 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 relative"
                title="ดูรายการสั่งทั้งหมด"
              >
                <ClipboardList size={20} />
                <span className="inline font-medium">ดูรายการสั่งทั้งหมด</span>

                {orderHistory.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {orderHistory.length}
                  </span>
                )}
              </button>
              <button
                onClick={handleCallStaff}
                className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full  flex items-centershadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <Users size={20} />
                <span className="inline font-medium">เรียกพนักงาน</span>

              </button>
              <button
                onClick={handleCheckBill}
                className="bg-green-500 hover:bg-green-600 text-white p-3 flex items-center  rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <Receipt size={20} />
                <span className="inline font-medium">เช็คบิล</span>

              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category ?? '')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-orange-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-4xl mx-auto px-4 pb-32">
        <div className="grid gap-6 md:grid-cols-2">
          {filteredMenu.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
            >
              {item.image && (
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {item.category}
                    </span>
                  </div>
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">
                    ฿{item.price}
                  </span>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <Plus size={16} className="inline mr-1" />
                    เพิ่ม
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-6 right-6 z-50">
          <button
            onClick={() => setShowCart(true)}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-2xl shadow-2xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-3"
          >
            <ShoppingCart size={24} />
            <span>ตะกร้า ({getTotalItems()})</span>
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
              ฿{getTotalPrice()}
            </span>
          </button>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full max-h-[80vh] rounded-t-3xl shadow-2xl overflow-hidden">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">🛒 ตะกร้าสินค้า</h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-96">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-gray-500 text-lg">ตะกร้าว่างเปล่า</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-green-600 font-bold">฿{item.price}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-bold text-lg min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">
                          ฿{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="sticky bottom-0 bg-white border-t p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-gray-800">รวมทั้งหมด:</span>
                  <span className="text-2xl font-bold text-green-600">฿{getTotalPrice()}</span>
                </div>
                <button
                  onClick={placeOrder}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  📋 สั่งอาหาร
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order History Modal */}
      {showOrderHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden">
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">📋 รายการสั่งทั้งหมด</h2>
                <p className="text-purple-100 mt-1">
                  {orderHistory.length} ออเดอร์ | {getTotalOrderCount()} รายการ | รวม ฿{getTotalOrderValue()}
                </p>
              </div>
              <button
                onClick={() => setShowOrderHistory(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {orderHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-gray-500 text-lg">ยังไม่มีการสั่งอาหาร</p>
                  <p className="text-gray-400">เมื่อคุณสั่งอาหารแล้ว รายการจะแสดงที่นี่</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orderHistory.map((order, index) => {
                    const statusColors = {
                      'รอทำ': 'bg-yellow-100 text-yellow-800 border-yellow-300',
                      'กำลังทำ': 'bg-blue-100 text-blue-800 border-blue-300',
                      'เสร็จแล้ว': 'bg-green-100 text-green-800 border-green-300'
                    };
                    
                    return (
                      <div key={order.id} className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-800">
                              ออเดอร์ #{orderHistory.length - index}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {order.timestamp.toLocaleString('th-TH')}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              รหัส: {order.id}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[order.status]}`}>
                              {order.status}
                            </span>
                            <p className="text-2xl font-bold text-green-600 mt-2">
                              ฿{order.total}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={`${order.id}-${item.id}`} className="flex items-center justify-between bg-white p-3 rounded-xl">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                                <div>
                                  <h4 className="font-semibold text-gray-800">{item.name}</h4>
                                  <p className="text-sm text-gray-600">฿{item.price} x {item.quantity}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-800">
                                  ฿{item.price * item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Summary Footer */}
            {orderHistory.length > 0 && (
              <div className="sticky bottom-0 bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-purple-100">สรุปรวม</p>
                    <p className="font-bold">{getTotalOrderCount()} รายการจาก {orderHistory.length} ออเดอร์</p>
                  </div>
                  <div className="text-right">
                    <p className="text-purple-100">ยอดรวมทั้งหมด</p>
                    <p className="text-3xl font-bold">฿{getTotalOrderValue()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {/* <div className="fixed bottom-[6rem] right-6 flex flex-col space-y-3 z-40">
        <button
          onClick={() => setShowOrderHistory(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-full shadow-xl transition-all duration-200 transform hover:scale-110 flex items-center space-x-2 relative"
          title="ดูรายการสั่งทั้งหมด"
        >
          <Eye size={24} />
          <span className="inline font-medium">ดูรายการสั่ง</span>
          {orderHistory.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {orderHistory.length}
            </span>
          )}
        </button>
        <button
          onClick={handleCallStaff}
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-xl transition-all duration-200 transform hover:scale-110 flex items-center space-x-2"
          title="เรียกพนักงาน"
        >
          <Users size={24} />
          <span className="inline font-medium">เรียกพนักงาน</span>
        </button>
        <button
          onClick={handleCheckBill}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-xl transition-all duration-200 transform hover:scale-110 flex items-center space-x-2"
          title="เช็คบิล"
        >
          <Receipt size={24} />
          <span className="inline font-medium">เช็คบิล</span>
        </button>
      </div> */}
    </main>
  );
}