import React from "react";

interface NeonBadgeProps {
  children: React.ReactNode;
  color?: 'purple' | 'orange' | 'green' | 'cyan';
  className?: string;
  dot?: boolean;
}

const colorMap = {
  purple: 'bg-brand-bg text-brand border-brand/20',
  orange: 'bg-accent-amber-bg text-accent-amber border-accent-amber/20',
  green: 'bg-accent-green-bg text-accent-green border-accent-green/20',
  cyan: 'bg-accent-cyan-bg text-accent-cyan border-accent-cyan/20',
};

const dotColor = {
  purple: 'bg-brand',
  orange: 'bg-accent-amber',
  green: 'bg-accent-green',
  cyan: 'bg-accent-cyan',
};

export default function NeonBadge({ children, color = 'purple', className = '', dot = false }: NeonBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorMap[color]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor[color]} animate-pulse-soft`} />}
      {children}
    </span>
  );
}
