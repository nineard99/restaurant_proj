"use client";
import Loading from "@/components/Loading";
import RestaurantCard from "@/components/restaurantCard";
import { getallRestaurantByUser } from "@/services/restaurantService";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Restaurant {
  id: string;
  name: string;
  createdAt: string;
  role: string;
}

export default function MyRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getallRestaurantByUser();
        const mapped = data.map((item: any) => ({
          id: item.restaurant.id,
          name: item.restaurant.name,
          createdAt: item.restaurant.createdAt,
          role: item.role,
        }));
        setRestaurants(mapped);
      } catch (error: any) {
        toast.error("Failed to load restaurants");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

  }, []);





  if (isLoading) return <Loading />;

  return (
    <main className="min-h-screen pt-20 bg-gray-50 relative overflow-hidden">
      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1
            className="text-6xl md:text-7xl font-black text-gray-900 mb-6 relative"
          >
            RESTAURANT
          </h1>
          <p className="text-gray-600 text-lg font-light tracking-wide max-w-md mx-auto">
            Manage your Restaurant
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              id={restaurant.id}
              name={restaurant.name}
              createdAt={restaurant.createdAt}
              role={restaurant.role}
            />
          ))
          }


          {/* ปุ่มสร้างร้านใหม่ */}
          <div
            onClick={() => router.push('/create-restaurant')}
            className="group hover:scale-105 relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl shadow-2xl p-8 cursor-pointer transition-all duration-700 overflow-hidden border border-gray-700/50 flex flex-col items-center justify-center text-white"
          >
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
              }}
            />
            <div className="relative z-10 flex flex-col items-center justify-center">
              <div className="w-24 h-24 border-2 border-white/30 border-dashed rounded-2xl flex items-center justify-center mb-8">
                <span className="text-5xl font-thin">+</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">Create New Restaurant</h3>
        
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
