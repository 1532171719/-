import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Map, Briefcase } from "lucide-react";
import GlassCard from "../ui/GlassCard";

const entries = [
  {
    to: "/coach",
    icon: MessageCircle,
    title: "任务教练",
    desc: "智能拆解工作任务，生成执行清单与 Prompt 模板",
    accent: "purple" as const,
    iconBg: "bg-brand-bg",
    iconColor: "text-brand",
    stripe: "bg-brand",
  },
  {
    to: "/path",
    icon: Map,
    title: "学习路径",
    desc: "12 周递进式学习计划，从融入到实战",
    accent: "orange" as const,
    iconBg: "bg-accent-cyan-bg",
    iconColor: "text-accent-cyan",
    stripe: "bg-accent-cyan",
  },
  {
    to: "/workflow",
    icon: Briefcase,
    title: "工作流库",
    desc: "5 大岗位标准协同工作流模板",
    accent: "green" as const,
    iconBg: "bg-accent-amber-bg",
    iconColor: "text-accent-amber",
    stripe: "bg-accent-amber",
  },
];

export default function EntryCards() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {entries.map((entry, i) => (
        <motion.div
          key={entry.to}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
        >
          <GlassCard
            neonColor={entry.accent}
            onClick={() => navigate(entry.to)}
            className="p-6 h-full relative overflow-hidden"
          >
            {/* Color stripe on top */}
            <div className={`absolute top-0 left-0 right-0 h-[3px] ${entry.stripe}`} />
            <div className={`w-11 h-11 rounded-xl ${entry.iconBg} ${entry.iconColor} flex items-center justify-center mb-4`}>
              <entry.icon size={22} />
            </div>
            <h3 className="text-[15px] font-semibold text-text-main mb-1.5">{entry.title}</h3>
            <p className="text-[13px] text-text-secondary leading-relaxed">{entry.desc}</p>
            <div className="mt-4 flex items-center gap-1 text-[13px] font-semibold text-brand">
              <span>进入{entry.title === '任务教练' ? '教练' : entry.title === '学习路径' ? '路径' : '工作流'}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
