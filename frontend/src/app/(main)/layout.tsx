import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
        <Toaster/>
        <Navbar />
        <main>{children}</main>
    </AuthProvider>
  );
}
