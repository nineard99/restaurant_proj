"use client";
import { authorize, logoutService } from "@/services/authService";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import toast from "react-hot-toast";



export default function Navbar() {
    const { isLoggedIn , user } = useAuth();
    const [openDropdown, setOpenDropdown] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const isDashboardPage = pathname.startsWith('/dashboard/');
    const handleLogout = async() => {
    await logoutService();
    toast.success('Logout Successfully')
    router.push('/login')
  };

  return (
    <div className="bg-gray-50">
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-b border-gray-200 z-50"
        >
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 1 }}
                className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center"
              >
                <span className="text-white text-sm font-bold">R</span>
              </motion.div>
              <span className="text-xl font-bold text-gray-900">RestaurantPro</span>
            </motion.div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {!isLoggedIn ? (
                // Links for non-logged in users
                <>
                  <motion.a
                    whileHover={{ y: -2 }}
                    className="text-gray-900 font-semibold relative group"
                    onClick={() => router.push('/')}
                  >
                    Home
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-900"
                    />
                  </motion.a>
                </>
              ) : (
                // Links for logged in users
                <>
                  <motion.a
                    whileHover={{ y: -2 }}
                    className={`font-medium relative group ${
                      pathname === '/home'
                        ? 'text-gray-900 font-bold'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => router.push('/home')}
                  >
                    Home
                    <motion.div
                      className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-900 transition-transform origin-left ${
                        pathname === '/home' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </motion.a>
                  {isDashboardPage && (
                    <motion.a
                      whileHover={{ y: -2 }}
                      className="text-gray-900 font-semibold relative group"
                      href="#"
                    >
                      Restaurant
                      <motion.div
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-900"
                      />
                    </motion.a>
                  )}
                  <motion.a
                    whileHover={{ y: -2 }}
                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors relative group"
                    href="#"
                  >
                    Option
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                    />
                  </motion.a>
                </>
              )}
            </div>

            {/* Right side content */}
            <div className="flex items-center space-x-4">
              {!isLoggedIn ? (
                // Login button for non-logged in users
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/login')}
                  className="px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Login
                </motion.button>
              ) : (
                // User profile section for logged in users
                <>
                  {/* Notifications */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <div className="w-5 h-5 border-2 border-current rounded-full relative">
                      <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-current rounded-full" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                    />
                  </motion.button>

                  {/* User Avatar */}
                  <div onClick={() => setOpenDropdown(prev => !prev)} className="relative group">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                          Hello {user?.username}
                        </span>
                        <motion.div
                          whileHover={{ rotate: 180 }}
                          transition={{ duration: 0.3 }}
                          className="w-1 h-1 bg-gray-400 transform rotate-45"
                        />
                      </div>
                      <div className="relative">
                        <motion.div
                          animate={{ 
                            boxShadow: ["0 0 0 0 rgba(0,0,0,0.1)", "0 0 0 4px rgba(0,0,0,0.05)", "0 0 0 0 rgba(0,0,0,0.1)"]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold"
                        >
                          U
                        </motion.div>
                        <motion.div
                          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                    </motion.div>

                    {/* Dropdown menu */}
                    {openDropdown && (<motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 opacity-0 group-hover:opacity-100 transition-all duration-200"
                    >
                      {/* <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        โปรไฟล์
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        การเงิน
                      </a> */}
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </motion.div>)
                    }
                  </div>
                </>
              )}

              {/* Mobile menu button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <div className="w-5 h-0.5 bg-current mb-1" />
                <div className="w-5 h-0.5 bg-current mb-1" />
                <div className="w-5 h-0.5 bg-current" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Animated border */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-900 to-transparent opacity-20"
          animate={{ scaleX: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.nav>

    
    </div>
  );
}