import React from "react";
import { motion } from "framer-motion";
import { WorkflowTemplate } from "../../types";
import GlassCard from "../ui/GlassCard";
import WorkflowSteps from "./WorkflowSteps";
import { ListOrdered, ChevronDown } from "lucide-react";

interface WorkflowCardProps {
  workflow: WorkflowTemplate;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function WorkflowCard({ workflow, index, isExpanded, onToggle }: WorkflowCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <GlassCard hover onClick={onToggle} className="p-6">
        {/* Header row */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-bg text-brand flex items-center justify-center shrink-0">
            <ListOrdered size={22} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-[17px] font-heading font-semibold text-text-main leading-tight">
              {workflow.title}
            </h3>
            <p className="text-[13px] text-text-secondary mt-1.5 line-clamp-2">
              {workflow.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-center">
            <span className="text-[13px] font-heading font-bold text-brand bg-brand-bg px-3 py-1 rounded-full">
              {workflow.steps.length} 步
            </span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={18} className="text-text-muted" />
            </motion.div>
          </div>
        </div>

        {/* Expanded steps */}
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border-light mt-5">
              <WorkflowSteps steps={workflow.steps} />
            </div>
          </motion.div>
        )}
      </GlassCard>
    </motion.div>
  );
}
