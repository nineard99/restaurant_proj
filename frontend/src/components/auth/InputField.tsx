"use client";

import { EyeOff, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export const InputField = ({
  icon: Icon,
  type,
  name,
  placeholder,
  value,
  onChange,
  required = false,
  showPasswordToggle = false,
  showPassword,
  setShowPassword,
}: {
  icon: any;
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  setShowPassword?: (show: boolean) => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const isFilled = value !== "";

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`peer w-full pl-12 pr-10 py-4 bg-white border rounded-2xl 
        border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 
        placeholder-transparent transition-all duration-300 text-gray-800`}
        placeholder={placeholder}
      />

      <motion.label
        initial={false}
        animate={isFocused || isFilled ? "active" : "inactive"}
        variants={{
          inactive: {
            top: "1.1rem",
            left: "3rem",
            fontSize: "1rem",
            color: "#9CA3AF", // gray-400
          },
          active: {
            top: "0.2rem",
            left: "3rem",
            fontSize: "0.75rem",
            color: "#3B82F6", // blue-500
          },
        }}
        transition={{ duration: 0.2 }}
        className="absolute pointer-events-none z-0"
      >
        {placeholder}
      </motion.label>

      {showPasswordToggle && setShowPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-500 transition-colors duration-200 z-10"
          aria-label="Toggle password visibility"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      )}
    </div>
  );
};
