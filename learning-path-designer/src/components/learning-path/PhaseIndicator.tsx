import React from "react";
import { motion } from "framer-motion";
import { LearningPhase } from "../../types";

interface PhaseIndicatorProps {
  phases: LearningPhase[];
  currentPhase: number;
  onSelectPhase: (index: number) => void;
}

export default function PhaseIndicator({ phases, currentPhase, onSelectPhase }: PhaseIndicatorProps) {
  return (
    <div className="flex gap-2 mb-6">
      {phases.map((phase, i) => {
        const phaseColor = phase.color || '#00C9FF';
        return (
          <motion.button
            key={phase.name || i}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectPhase(i)}
            className={`flex-1 p-4 rounded-xl border transition-all ${
              i === currentPhase
                ? 'bg-white border border-border-light shadow-card border-current'
                : 'border-white/5 hover:border-white/10'
            }`}
            style={{
              borderColor: i === currentPhase ? phaseColor : undefined,
              backgroundColor: i === currentPhase ? `${phaseColor}10` : undefined,
            }}
          >
            <div
              className="w-2 h-2 rounded-full mb-2"
              style={{ backgroundColor: phaseColor }}
            />
            <p className="text-sm font-semibold text-text-main">{phase.name || '未知阶段'}</p>
            <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">{phase.description || ''}</p>
            <p className="text-[11px] font-mono mt-2 opacity-60" style={{ color: phaseColor }}>
              第{phase.weeks?.[0] || 1}-{phase.weeks?.[phase.weeks.length - 1] || 4}周
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}
