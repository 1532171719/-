import React from "react";
import { motion } from "framer-motion";
import { WorkflowStep } from "../../types";
import { Bot, User, UserCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const roleIcons: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  ai:     { icon: Bot,       color: 'text-brand',        bg: 'bg-brand-bg' },
  human:  { icon: User,      color: 'text-accent-cyan',   bg: 'bg-accent-cyan-bg' },
  mentor: { icon: UserCheck, color: 'text-accent-amber',  bg: 'bg-accent-amber-bg' },
};

export default function WorkflowSteps({ steps }: { steps: WorkflowStep[] }) {
  return (
    <div className="flex flex-wrap items-start gap-x-0 gap-y-4 pt-5">
      {steps.map((step, i) => {
        const { icon: Icon, color: iconColor, bg } = roleIcons[step.role];

        return (
          <React.Fragment key={step.id}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center gap-2"
              style={{ minWidth: 140 }}
            >
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={24} className={iconColor} />
              </div>
              <span className="text-[14px] font-semibold text-text-main text-center leading-tight">
                {step.label}
              </span>
              <span className="text-[12px] text-text-secondary text-center leading-snug px-1">
                {step.description}
              </span>
            </motion.div>

            {/* connector — hide at wrap points visually, keep structure */}
            {i < steps.length - 1 && (
              <div className="flex items-center pt-7">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: i * 0.08 + 0.04 }}
                  className="w-10 h-[2px] bg-gradient-to-r from-brand/40 to-brand/10"
                  style={{ transformOrigin: 'left' }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
