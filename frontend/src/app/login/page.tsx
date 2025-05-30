"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { InputField } from "@/components/auth/InputField";
import { User, Lock, Mail } from "lucide-react";
import { getMe, login, register } from "@/services/authService";
import toast from "react-hot-toast";

type FormData = {
  email: string;
  password: string;
  confirmPassword: string | null;
  username: string;
};

export default function AuthSystem() {
  const [isLogin, setIsLogin] = useState(true);
  const [formHeight, setFormHeight] = useState(320); // default login
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: "",
    confirmPassword: null,
    username: "",
  });

  useEffect(() => {
    setFormHeight(isLogin ? 320 : 480);
  }, [isLogin]);

  const handleSubmit = async () => {
    if (isLogin) {
      const { username, password } = formData;
      await login({username,password})
      toast.success("Login Success🎉");
    } else {
      const { username, email, password, confirmPassword } = formData;
      if (password !== confirmPassword) {
        toast.error("รหัสผ่านไม่ตรงกัน");
        return;
      }
      await register({username,email,password});
      toast.success("Register Success")
    };
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-blue-100 p-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">KIN SONTEEN MAI</h1>
      </div>
      <motion.div
        animate={{ height: formHeight }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden px-8 py-10"
      >
        <div className="mb-6 relative flex bg-gray-100 rounded-xl overflow-hidden">
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            animate={{
              x: isLogin ? 0 : "100%",
              backgroundColor: isLogin ? "#DBEAFE" : "#BBF7D0",
            }}
            className="absolute top-0 left-0 w-1/2 h-full rounded-xl z-0"
          />
          <button
            className={`flex-1 py-2 font-semibold z-10 ${
              isLogin ? "text-blue-600" : "text-gray-500"
            }`}
            onClick={() => setIsLogin(true)}
          >
            เข้าสู่ระบบ
          </button>
          <button
            className={`flex-1 py-2 font-semibold z-10 ${
              !isLogin ? "text-green-600" : "text-gray-500"
            }`}
            onClick={() => setIsLogin(false)}
          >
            สมัครสมาชิก
          </button>
        </div>

        <div className="space-y-4">
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

          {!isLogin && (
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
          )}

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

          {!isLogin && (
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
          )}

          <button
            onClick={handleSubmit}
            className={`w-full py-3 rounded-xl hover:scale-105 text-white font-bold mt-2 ${
              isLogin ? "bg-blue-600" : "bg-green-600"
            } hover:opacity-90 transition`}
          >
            {isLogin ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
