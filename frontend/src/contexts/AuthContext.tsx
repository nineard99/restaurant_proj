"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getMe } from "@/services/authService";
import { useRouter } from "next/navigation";

// กำหนด interface user แบบคร่าว ๆ (ปรับให้ตรงกับข้อมูลจริงที่ getMe คืนมา)
interface User {
  id: string;
  username: string;
  email?: string;
  // ...เพิ่มฟิลด์อื่น ๆ ตามต้องการ
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function check() {
      const user = await getMe();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
        setIsLoggedIn(true);
      }
    }
    check();
  }, [router]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
