import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface RestaurantCardProps {
  id: string;
  name: string;
  createdAt: string;
  role: string;
}

const getRoleConfig = (role: string) => {
  switch (role) {
    case "OWNER":
      return {
        color: "bg-gradient-to-br from-emerald-50 to-green-100 text-emerald-800 border-emerald-200",
        gradient: "from-emerald-500 to-green-600",
        glow: "shadow-emerald-500/25",
        accent: "bg-emerald-500",
        text: "OWNER",
      };
    case "MANAGER":
      return {
        color: "bg-gradient-to-br from-blue-50 to-sky-100 text-blue-800 border-blue-200",
        gradient: "from-blue-500 to-sky-600",
        glow: "shadow-blue-500/25",
        accent: "bg-blue-500",
        text: "ผู้จัดการ",
      };
    case "STAFF":
      return {
        color: "bg-gradient-to-br from-orange-50 to-amber-100 text-orange-800 border-orange-200",
        gradient: "from-orange-500 to-amber-600",
        glow: "shadow-orange-500/25",
        accent: "bg-orange-500",
        text: "พนักงาน",
      };
    default:
      return {
        color: "bg-gradient-to-br from-gray-50 to-slate-100 text-gray-800 border-gray-200",
        gradient: "from-gray-500 to-slate-600",
        glow: "shadow-gray-500/25",
        accent: "bg-gray-500",
        text: role,
      };
  }
};

export default function RestaurantCard({ id, name, createdAt, role }: RestaurantCardProps) {
  const roleConfig = getRoleConfig(role);
  const router = useRouter()
  return (
    <div
      onClick={() => router.push(`/dashboard/${id}`)}
      className={`group hover:scale-105 relative bg-white rounded-3xl shadow-xl hover:shadow-2xl ${roleConfig.glow} p-8 cursor-pointer border border-white/50 backdrop-blur-sm transition-all duration-300 overflow-hidden`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />

      <div
        className={`absolute top-6 left-6 px-4 py-2 rounded-full text-sm font-bold border backdrop-blur-md ${roleConfig.color} shadow-md`}
      >
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${roleConfig.accent}`} />
          <span>{roleConfig.text}</span>
        </div>
      </div>

      <div className="relative z-10 mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{name}</h2>
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <div className={`w-2 h-2 ${roleConfig.accent} rounded-full mr-3`} />
          <span className="font-medium">
            Created at {new Date(createdAt).toLocaleDateString("th-TH")}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Role: {roleConfig.text}</span>
        </div>
        <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${roleConfig.gradient} rounded-full w-3/4`}
          />
        </div>
      </div>
    </div>
  );
}
