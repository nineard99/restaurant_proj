"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { InputField } from "@/components/shared/InputField";
import { User, Lock, Mail } from "lucide-react";
import { getMe, login, register } from "@/services/authService";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { FormData, LoginPayload, RegisterPayload } from "@/types/auth";

const validateForm = (data: FormData, isLogin: boolean): string | null => {
  const usernameRegex = /^[a-zA-Z0-9_$%!@#]+$/;
  const passwordRegex = /^[a-zA-Z0-9_$%!@#]+$/;

  if (data.username.trim() === '') return 'Please enter a username';
  if (!usernameRegex.test(data.username)) return 'Username can only include English letters, numbers, and _ $ %';

  if (data.password.trim() === '') return 'Please enter a password';
  if (!passwordRegex.test(data.password)) return 'Password can only include English letters, numbers, and _ $ %';

  if (!isLogin && data.password !== data.confirmPassword) return 'Passwords do not match';

  return null;
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

    const errorMsg = validateForm(formData, isLogin);
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login({ username: formData.username, password: formData.password } as LoginPayload);
        
        toast.success("Login successful");
        router.push('/home');
      } else {
        await register({ email: formData.email, username: formData.username, password: formData.password } as RegisterPayload);
        toast.success("Registration successful");
        router.push('/home');
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred");
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
                Login
              </motion.button>
              <motion.button
                className={`flex-1 py-3 font-semibold z-10 ${
                  !isLogin ? "text-gray-900" : "text-gray-500"
                }`}
                onClick={() => setIsLogin(false)}
              >
                Register
              </motion.button>
            </div>

            <div className="space-y-5">
              <InputField
                icon={User}
                type="text"
                name="username"
                placeholder="Username"
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
                  placeholder="Email"
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
                placeholder="Password"
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
                  placeholder="ConfirmPassword"
                  value={formData.confirmPassword ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                />
              )}

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
                    ? "Logging in..."
                    : "Registering..."
                  : isLogin
                  ? "Login"
                  : "Register"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
