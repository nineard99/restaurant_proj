"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { InputField } from "@/components/auth/InputField";
import { User, Lock, Mail } from "lucide-react";
import {  getMe, login, register } from "@/services/authService";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

type FormData = {
  email: string;
  password: string;
  confirmPassword: string | null;
  username: string;
};

export default function AuthSystem() {
  const [isLogin, setIsLogin] = useState(true);
  const [formHeight, setFormHeight] = useState(380); // adjusted for new design
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: "",
    confirmPassword: null,
    username: "",
  });
  const route = useRouter();
  useEffect(() => {
    setFormHeight(isLogin ? 380 : 520);
  }, [isLogin]);

  useEffect(() => {
    async function init() {
      const user = await getMe();
      if (user) route.push("/home");
    }
    init();
  }, [route]);
  const handleSubmit = async () => {
    try{
      const { username, email, password, confirmPassword } = formData;
      if(username.trim() === '') throw new Error('Please enter your username.')
      if(password.trim() === '') throw new Error('Please enter your password.')

      if (isLogin) {
        await login({username,password})
        route.push('/home')
        toast.success("Login Success🎉");
      } else {
        if (password !== confirmPassword) {
          toast.error("รหัสผ่านไม่ตรงกัน");
          return;
        }
        await register({username,email,password});
        toast.success("Register Success")
      };
    }catch(err : any){
      toast.error(err.message)
    }
    
  }

  return (
    <div>
      <Navbar/>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 80, 0],
            y: [0, -60, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-20 w-24 h-24 border border-gray-300 rotate-45 opacity-20"
        />
        <motion.div
          animate={{ 
            x: [0, -100, 0],
            y: [0, 80, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-20 w-20 h-20 bg-gray-800 rounded-full opacity-10"
        />
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 right-1/4 w-32 h-32 border-2 border-dashed border-gray-400 rounded-full opacity-15"
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="text-center mb-12"
      >
        <motion.div whileHover={{scale:1.03}} className="relative inline-block">
          <motion.h1 
            className="text-4xl md:text-5xl font-black text-gray-900 mb-4"
            // whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            KIN SONTEEN MAI
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-800 to-transparent"
            />
          </motion.h1>
          
         
        </motion.div>

      </motion.div>

      {/* Auth Form */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-full max-w-md relative"
      >
        <motion.div
          animate={{ height: formHeight }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden px-8 py-10 border border-gray-200 relative"
        >
          {/* Animated corner accent */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-4 right-4 w-6 h-6 border-2 border-gray-200 rotate-45"
          />

          {/* Tab Switcher */}
          <div className="mb-8 relative flex bg-gray-100 rounded-xl overflow-hidden p-1">
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              animate={{
                x: isLogin ? 0 : "100%",
              }}
              className="absolute top-1 left-1 w-[calc(50%-4px)] h-[calc(100%-8px)] bg-white rounded-lg shadow-sm z-0"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 py-3 font-semibold z-10 transition-colors relative ${
                isLogin ? "text-gray-900" : "text-gray-500"
              }`}
              onClick={() => setIsLogin(true)}
            >
              เข้าสู่ระบบ
              {isLogin && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gray-900"
                />
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 py-3 font-semibold z-10 transition-colors relative ${
                !isLogin ? "text-gray-900" : "text-gray-500"
              }`}
              onClick={() => setIsLogin(false)}
            >
              สมัครสมาชิก
              {!isLogin && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gray-900"
                />
              )}
            </motion.button>
          </div>

          {/* Form Fields */}
          <motion.div 
            className="space-y-5"
            layout
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <InputField
                icon={User}
                type="text"
                name="username"
                placeholder="ชื่อผู้ใช้"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </motion.div>

            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <InputField
                  icon={Mail}
                  type="email"
                  name="email"
                  placeholder="อีเมล"
                  value={formData.email ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <InputField
                icon={Lock}
                type="password"
                name="password"
                placeholder="รหัสผ่าน"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </motion.div>

            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <InputField
                  icon={Lock}
                  type="password"
                  name="confirmPassword"
                  placeholder="ยืนยันรหัสผ่าน"
                  value={formData.confirmPassword ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value || null,
                    })
                  }
                />
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              onClick={handleSubmit}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.25)"
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl text-white font-bold mt-6 bg-gray-900 hover:bg-gray-800 transition-all duration-300 relative overflow-hidden group"
            >
              {/* Button background animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              
              {/* Button text */}
              <span className="relative z-10">
                {isLogin ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
              </span>
              
              {/* Loading dots animation */}
              <motion.div
                className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-1 opacity-0 group-hover:opacity-100"
                initial={false}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  className="w-1 h-1 bg-white rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  className="w-1 h-1 bg-white rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  className="w-1 h-1 bg-white rounded-full"
                />
              </motion.div>
            </motion.button>
          </motion.div>

         
        </motion.div>

        {/* Form shadow/glow effect */}
        <motion.div
          animate={{ 
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.02, 1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gray-900 rounded-2xl blur-xl opacity-5 -z-10"
        />
      </motion.div>

      {/* Bottom decorative text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="text-center mt-12"
      >
        <p className="text-gray-400 text-sm font-light">
          © 2024 RestaurantPro - เทคโนโลยีเพื่อธุรกิจอาหาร
        </p>
      </motion.div>
    </div>
    </div>
  );
}