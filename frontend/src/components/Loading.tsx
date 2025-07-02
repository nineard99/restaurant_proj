import React from 'react'
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center relative overflow-hidden">
        {/* Floating geometric shapes */}
        <motion.div
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0],
            rotate: [0, 90, 180]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-20 w-20 h-20 border-2 border-gray-300 rotate-45"
        />
        <motion.div
          animate={{ 
            x: [0, -40, 0],
            y: [0, 40, 0],
            rotate: [180, 90, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-20 w-16 h-16 bg-gray-800 rounded-full"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center z-10"
        >
          <motion.div className="relative mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 border-4 border-gray-200 border-t-gray-800 rounded-full mx-auto"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 w-16 h-16 border-2 border-gray-300 border-b-gray-700 rounded-full"
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-700 text-xl font-medium tracking-wide"
          >
            กำลังโหลดร้านของคุณ...
          </motion.p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "200px" }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="h-0.5 bg-gradient-to-r from-gray-800 via-gray-400 to-gray-800 mx-auto mt-4"
          />
        </motion.div>
      </main>
  )
}
