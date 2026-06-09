import React from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: 'purple' | 'green' | 'orange';
}

const colorGradients = {
  purple: 'from-brand to-brand-light',
  green: 'from-accent-green to-accent-cyan',
  orange: 'from-accent-amber to-brand',
};

const valueColors = {
  purple: 'text-brand',
  green: 'text-accent-green',
  orange: 'text-accent-amber',
};

export default function ProgressBar({ value, max = 100, label, showValue = true, color = 'purple' }: ProgressBarProps) {
  const pct = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-text-muted">{label}</span>}
          {showValue && <span className={`text-xs font-heading font-bold ${valueColors[color]}`}>{pct}%</span>}
        </div>
      )}
      <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${colorGradients[color]} rounded-full`}
        />
      </div>
    </div>
  );
}
