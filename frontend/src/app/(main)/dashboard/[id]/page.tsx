"use client";
import Loading from "@/components/Loading";
import DashboardOptions from "@/components/dashboardRestaurant/DashboardOption";
import MenuList from "@/components/dashboardRestaurant/MenuList";
import TableList from "@/components/dashboardRestaurant/TableList";
import AddMenuComponent from "@/components/dashboardRestaurant/create-Menu";
import { authorize } from "@/services/authService";
import { getMenu } from "@/services/menuService";
import { deleteRestaurantById, editRestaurantName, getRestaurantById } from "@/services/restaurantService";
import { getAllTable } from "@/services/tableService";
import { MenuItem } from "@/types/menu";
import { Table } from "@/types/table";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";




interface Props { params: Promise<{ id: string }>; }
export default function Dashboard({ params }: Props) {
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<{ name: string } | null>();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const router = useRouter();
  const paramsData = React.use(params);
  const id = paramsData.id; 

  const onAddSuccess = () => {
    fetchData();
  }

  
  const fetchData = async () => {
    const menu = await getMenu(id);
    const table = await getAllTable(id)
    const mapped = menu.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image
    }));
    const tablemapped = table.map((item: any) => ({
      id: item.id,
      name: item.name,
      sessionId: item.sessionId,
      qrCode: item.qrCode,
      isActive: item.isActive,
      currentOccupancy: item.currentOccupancy
    }));
    setMenuItems(mapped)
    setTables(tablemapped)
  };

  const onEditRestaurantName = async(newName: string) => {
    await editRestaurantName(id,newName)
    init()
  }

  useEffect(() => {
    fetchData();
  }, []);
  
  
  const handledelete = async() => {
  
    await deleteRestaurantById(id)
    toast.success('deleted success')
    router.push('/home')
  };

  const init = async () => {
    const res = await getRestaurantById(id);         
    if (res) {         
    setRestaurant(res);       
    } else {         
      router.push("/login");       
    }       
    setLoading(false);     
  }     
  useEffect(() => {
    
  init();   
  }, [id, router]);

  if (loading) {
    return (
      <Loading/>
    );
  }

  

  return (
    <main className="min-h-screen pt-20 bg-gray-50 relative overflow-hidden">
      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="relative inline-block mb-4">
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 relative">
                {restaurant?.name}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent"
                />
                
              </h1>
              
            </div>
            <DashboardOptions
                restaurantId={id}
                restaurantName={restaurant?.name || ""}
                onUpdateName={onEditRestaurantName}
                onDelete={handledelete}
              />

            {/* ปุ่มในธีมขาว-ดำ-เทา */}
            <div className="mt-6 flex justify-center gap-4 flex-wrap">
            
              <Link href={`/dashboard/${id}/order`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-xl border border-gray-500 text-gray-900 bg-gray-200 hover:bg-gray-300 font-medium transition shadow-sm mt-4"
                >
                  All Order
                </motion.button>
              </Link>
            </div>
          </motion.div>


          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 text-center"
            >
              <div
                className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <span className="text-2xl">🍽️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{menuItems.length}</h3>
              <p className="text-gray-600">MENU</p>
            </div>

            <div
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 text-center"
            >
              <div
                className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <span className="text-2xl">🪑</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{tables.length}</h3>
              <p className="text-gray-600">Table</p>
            </div>

            <div
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 text-center"
            >
              <div
                className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {tables.filter(t => t.isActive).length}
              </h3>
              <p className="text-gray-600">Active Table</p>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Menu Section */}
            <MenuList menuList={menuItems} onAddSuccess={onAddSuccess} restaurantId={id}/>

            {/* Tables Section */}
            <TableList tableList={tables} onChange={fetchData} restaurantId={id} />
          </motion.div>
          

          {/* Bottom decorative section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="text-center mt-16"
          >
            <motion.div 
              className="inline-flex items-center space-x-2 text-gray-500 text-sm font-light"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-1 h-1 bg-gray-400 rounded-full"
              />
              <span>Restaurant Pro</span>
              <motion.div
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-1 h-1 bg-gray-400 rounded-full"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}