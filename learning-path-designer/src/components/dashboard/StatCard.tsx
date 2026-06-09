import React from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  value: string;
  label: string;
  icon: React.ReactNode;
  delay?: number;
}

export default function StatCard({ value, label, icon, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white border border-border-light shadow-card rounded-2xl p-4 flex items-center gap-4"
    >
      <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-text-main">{value}</p>
        <p className="text-xs text-text-secondary">{label}</p>
      </div>
    </motion.div>
  );
}
