"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { InputField } from "@/components/auth/InputField";
import { User, Lock, Mail } from "lucide-react";
import { getMe, login, register } from "@/services/authService";
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
  const [formHeight, setFormHeight] = useState(380);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: "",
    confirmPassword: null,
    username: "",
  });

  const router = useRouter();

  useEffect(() => {
    setFormHeight(isLogin ? 380 : 520);
  }, [isLogin]);

  useEffect(() => {
    async function init() {
      try {
        const user = await getMe();
        if (user) router.push("/home");
      } catch {
        return null
      }
    }
    init();
  }, [router]);
  const handleSubmit = async () => {
    if (loading) return;

    const { username, email, password, confirmPassword } = formData;

    try {
      if (username.trim() === '') throw new Error('กรุณากรอกชื่อผู้ใช้');
      if (password.trim() === '') throw new Error('กรุณากรอกรหัสผ่าน');

      setLoading(true);

      if (isLogin) {
        await login({ username, password });
        toast.success("เข้าสู่ระบบสำเร็จ 🎉");
        router.push('/home');
      } else {
        if (password !== confirmPassword) {
          toast.error("รหัสผ่านไม่ตรงกัน");
          return;
        }
        await register({ username, email, password });
        toast.success("สมัครสมาชิกสำเร็จ 🎉");
        router.push('/home');
      }
    } catch (err: any) {
      toast.error(err?.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden">

        {/* ส่วน Form */}
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
                className={`flex-1 py-3 font-semibold z-10 ${
                  isLogin ? "text-gray-900" : "text-gray-500"
                }`}
                onClick={() => setIsLogin(true)}
              >
                เข้าสู่ระบบ
              </motion.button>
              <motion.button
                className={`flex-1 py-3 font-semibold z-10 ${
                  !isLogin ? "text-gray-900" : "text-gray-500"
                }`}
                onClick={() => setIsLogin(false)}
              >
                สมัครสมาชิก
              </motion.button>
            </div>

            {/* ช่องกรอกข้อมูล */}
            <div className="space-y-5">
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
                    setFormData({ ...formData, email: e.target.value })
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
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                />
              )}

              {/* ปุ่มส่ง */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-4 rounded-xl text-white font-bold mt-6 transition-all duration-300 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-900 hover:bg-gray-800"
                }`}
              >
                {loading
                  ? isLogin
                    ? "กำลังเข้าสู่ระบบ..."
                    : "กำลังสมัครสมาชิก..."
                  : isLogin
                  ? "เข้าสู่ระบบ"
                  : "สมัครสมาชิก"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
