import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface AdminStatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    color: string;
    delay?: number;
}

const AdminStatCard: React.FC<AdminStatCardProps> = ({
    title,
    value,
    icon,
    trend = "neutral",
    trendValue,
    color,
    delay = 0,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
        >
            <div className={`absolute top-0 right-0 p-3 opacity-10 ${color}`}>
                {icon}
            </div>

            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-gray-50 text-gray-700`}>
                    {icon}
                </div>

                {trend !== "neutral" && (
                    <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                        {trend === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        <span>{trendValue}</span>
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>

            {/* Decorative gradient blob */}
            <div className={`absolute -bottom-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-20 ${color.replace('text-', 'bg-')}`}></div>
        </motion.div>
    );
};

export default AdminStatCard;
