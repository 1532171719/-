import React from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  neonColor?: 'purple' | 'orange' | 'green' | 'none';
  onClick?: () => void;
  hover?: boolean;
}

const accentMap: Record<string, string> = {
  purple: 'border-brand/10 hover:border-brand/25',
  orange: 'border-accent-amber/10 hover:border-accent-amber/25',
  green: 'border-accent-green/10 hover:border-accent-green/25',
  none: 'border-border-light',
};

export default function GlassCard({ children, className = '', neonColor = 'none', onClick, hover = true }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`bg-white border rounded-[14px] shadow-card hover:shadow-card-hover transition-shadow ${accentMap[neonColor]} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}
