import React, { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Puzzle, Code, Palette, Search, BarChart3 } from "lucide-react";
import WorkflowCard from "../components/workflow/WorkflowCard";
import { workflowTemplates } from "../data/workflows";
import { JobRole } from "../types";

const roleOptions: { role: JobRole; icon: React.ReactNode; label: string; fullLabel: string }[] = [
  { role: '游戏策划', icon: <Puzzle size={17} />, label: '策划', fullLabel: '游戏策划' },
  { role: '程序开发', icon: <Code size={17} />, label: '开发', fullLabel: '程序开发' },
  { role: '美术设计', icon: <Palette size={17} />, label: '美术', fullLabel: '美术设计' },
  { role: 'QA测试',   icon: <Search size={17} />,  label: 'QA',   fullLabel: 'QA 测试' },
  { role: '运营发行', icon: <BarChart3 size={17} />, label: '运营', fullLabel: '运营发行' },
];

export default function WorkflowLibrary() {
  const [activeRole, setActiveRole] = useState<JobRole>('游戏策划');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = workflowTemplates.filter(w => w.role === activeRole);
  const activeFullLabel = roleOptions.find(r => r.role === activeRole)?.fullLabel || '';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1 className="text-[26px] font-heading font-bold text-text-main tracking-tight flex items-center gap-2.5">
          <Briefcase size={26} className="text-brand" />
          岗位工作流库
        </h1>
        <p className="text-sm text-text-secondary mt-1.5">
          浏览不同岗位的标准工作流模板，点击展开查看完整流程
        </p>
      </motion.div>

      {/* Role tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {roleOptions.map((opt) => (
          <button
            key={opt.role}
            onClick={() => { setActiveRole(opt.role); setExpandedId(null); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-medium transition-all ${
              activeRole === opt.role
                ? 'bg-brand text-white shadow-sm'
                : 'bg-white text-text-secondary border border-border-light hover:border-border-hover hover:text-text-main'
            }`}
          >
            {opt.icon}
            {opt.label}
          </button>
        ))}
        <span className="ml-auto text-[13px] text-text-muted font-medium">
          {activeFullLabel} · {filtered.length} 个模板
        </span>
      </div>

      {/* Workflow cards — single column full width */}
      <div className="flex flex-col gap-4">
        {filtered.map((wf, i) => (
          <WorkflowCard
            key={wf.id}
            workflow={wf}
            index={i}
            isExpanded={expandedId === wf.id}
            onToggle={() => setExpandedId(expandedId === wf.id ? null : wf.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-text-muted">
          <p className="text-[16px] font-medium mb-1">该岗位暂无工作流模板</p>
          <p className="text-sm">敬请期待更多内容</p>
        </div>
      )}
    </motion.div>
  );
}
