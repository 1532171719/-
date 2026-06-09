import React, { useState } from "react";
import { motion } from "framer-motion";
import { SubTask } from "../../types";
import { ChevronDown, Copy, Check, AlertTriangle, Wrench } from "lucide-react";

interface TaskCardProps {
  task: SubTask;
  index: number;
}

export default function TaskCard({ task, index }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white border border-border-light shadow-card rounded-xl overflow-hidden"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-3 flex items-center gap-3 cursor-pointer">
        <span className="w-6 h-6 rounded-lg bg-brand/10 text-brand text-xs font-bold flex items-center justify-center flex-shrink-0">
          {index + 1}
        </span>
        <span className="text-sm font-medium text-text-main flex-1">{task.title}</span>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-text-secondary" />
        </motion.div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 space-y-3 border-t border-white/5 pt-3">
          <p className="text-xs text-text-secondary">{task.description}</p>

          <div>
            <p className="text-xs font-semibold text-brand mb-1 flex items-center gap-1">
              <Copy size={12} /> Prompt 模板
            </p>
            <div className="relative">
              <pre className="text-[11px] text-text-main bg-bg-elevated rounded-lg p-2 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {task.promptTemplate}
              </pre>
              <button
                onClick={(e) => { e.stopPropagation(); handleCopy(task.promptTemplate); }}
                className="absolute top-2 right-2 p-1 rounded-md bg-bg-elevated text-text-secondary hover:text-brand transition-colors"
              >
                {copied ? <Check size={14} className="text-accent-green" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-accent-cyan mb-1 flex items-center gap-1">
              <Wrench size={12} /> 推荐工具
            </p>
            <div className="flex flex-wrap gap-1.5">
              {task.recommendedTools.map((tool) => (
                <span key={tool} className="text-[11px] px-2 py-0.5 rounded-full bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                  {tool}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-accent-green mb-1 flex items-center gap-1">
              <Check size={12} /> 检查清单
            </p>
            <ul className="space-y-1">
              {task.checklist.map((item, i) => (
                <li key={i} className="text-[11px] text-text-secondary flex items-start gap-1">
                  <span className="text-accent-green mt-0.5">•</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-accent-amber mb-1 flex items-center gap-1">
              <AlertTriangle size={12} /> 风险提示
            </p>
            <ul className="space-y-1">
              {task.riskWarnings.map((warning, i) => (
                <li key={i} className="text-[11px] text-accent-amber/80 flex items-start gap-1">
                  <span>⚠</span> {warning}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </motion.div>
  );
}
