import React from "react";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import GlassCard from "../components/ui/GlassCard";
import ProgressBar from "../components/ui/ProgressBar";
import SkillRadarChart from "../components/dashboard/RadarChart";
import EntryCards from "../components/dashboard/EntryCards";
import { Clock, BookOpen, Star, Target } from "lucide-react";

export default function Dashboard() {
  const { profile, skills, currentPhase, daysSinceStart, weekTasks } = useApp();

  // 动态计算数据
  const completed = weekTasks.filter(t => t.status === 'completed').length;
  const total = weekTasks.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const courseCount = weekTasks.filter(t => t.type === 'learning').length;
  const completedCourseCount = weekTasks.filter(t => t.type === 'learning' && t.status === 'completed').length;
  const achievementCount = Math.max(1, Math.floor(completed * 0.8)); // 简单模拟：每完成一周约0.8个成就
  const totalAchievements = 24;
  const comprehensiveScore = Math.round(
    (skills.promptEngineering + skills.workflowDesign + skills.dataAnalysis +
     skills.toolUsage + skills.aiEthics + skills.businessUnderstanding) / 6
  );
  const scoreImprovement = Math.max(0, Math.round(comprehensiveScore * 0.08)); // 模拟：较上周提升约8%

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.05 }}
      >
        <h1 className="text-[26px] font-heading font-bold text-text-main tracking-tight">
          你好，{profile.name} 👋
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          已学习 {daysSinceStart} 天 · {currentPhase} · 一切按计划推进中
        </p>
      </motion.div>

      {/* Status bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center gap-3 px-5 py-3.5 bg-white border border-border-light rounded-[14px] shadow-card"
      >
        <span className="text-[13px] text-text-secondary font-medium">进度</span>
        <span className="text-[15px] font-heading font-bold text-brand">{completed} / {total} 周</span>
        <span className="w-px h-5 bg-border-light" />
        <span className="text-[13px] text-text-secondary font-medium">课程</span>
        <span className="text-[15px] font-heading font-bold text-text-main">{courseCount}</span>
        <span className="w-px h-5 bg-border-light" />
        <span className="text-[13px] text-text-secondary font-medium">成就</span>
        <span className="text-[15px] font-heading font-bold text-text-main">{achievementCount}</span>
        <span className="w-px h-5 bg-border-light" />
        <span className="text-[13px] text-text-secondary font-medium">综合能力</span>
        <span className="text-[15px] font-heading font-bold text-accent-amber">{comprehensiveScore}</span>
        <span className="text-[12px] text-accent-green font-semibold ml-1">+{scoreImprovement}</span>
        <span className="ml-auto px-3 py-1 rounded-full bg-accent-cyan-bg text-accent-cyan text-[12px] font-semibold">
          {currentPhase}
        </span>
      </motion.div>

      {/* Four stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Clock, label: "周数进度", value: `${completed}/12`, color: "text-brand", bg: "bg-brand-bg", delay: 0.15, progress: percentage },
          { icon: BookOpen, label: "完成课程", value: `${completedCourseCount}`, sub: `${completedCourseCount} / ${courseCount} 门`, color: "text-accent-cyan", bg: "bg-accent-cyan-bg", delay: 0.2, progress: Math.round((completedCourseCount / courseCount) * 100) },
          { icon: Star, label: "解锁成就", value: `${achievementCount}`, sub: `${achievementCount} / ${totalAchievements} 个`, color: "text-accent-green", bg: "bg-accent-green-bg", delay: 0.25, progress: Math.round((achievementCount / totalAchievements) * 100) },
          { icon: Target, label: "综合能力分", value: `${comprehensiveScore}`, sub: `较上周 +${scoreImprovement}`, color: "text-accent-amber", bg: "bg-accent-amber-bg", delay: 0.3, progress: comprehensiveScore },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stat.delay }}
          >
            <GlassCard className="p-[18px]">
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon size={16} className={stat.color} />
                </div>
                <span className="text-[12px] text-text-secondary">{stat.label}</span>
              </div>
              <p className={`text-[24px] font-heading font-bold ${stat.color} tracking-tight`}>{stat.value}</p>
              {stat.sub && (
                <p className={`text-[11px] ${i === 3 ? 'text-accent-green' : 'text-text-muted'} mt-0.5`}>
                  {stat.sub}
                </p>
              )}
              <div className="mt-3">
                <ProgressBar value={stat.progress} max={100} showValue={false} color={i === 0 ? 'purple' : i === 1 ? 'green' : i === 2 ? 'green' : 'orange'} />
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Main content: Radar + Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="lg:col-span-2"
        >
          <GlassCard className="p-6 h-full">
            <h2 className="text-base font-heading font-semibold text-text-main mb-1">六维能力画像</h2>
            <p className="text-[12px] text-text-muted mb-5">基于 12 项任务表现的综合评估</p>
            <SkillRadarChart />
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-6 h-full flex flex-col">
            <h2 className="text-base font-heading font-semibold text-text-main mb-1">成长建议</h2>
            <p className="text-[12px] text-text-muted mb-4">基于画像的个性化提升方向</p>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-3 p-2.5 rounded-[10px] hover:bg-bg-elevated cursor-pointer transition-colors">
                <span className="w-7 h-7 rounded-lg bg-brand-bg text-brand flex items-center justify-center text-[12px] font-heading font-bold shrink-0">01</span>
                <p className="text-[13px] text-text-main leading-relaxed">加强 <strong className="font-semibold">Prompt 工程</strong> — 学习高级提示词技巧</p>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-[10px] hover:bg-bg-elevated cursor-pointer transition-colors">
                <span className="w-7 h-7 rounded-lg bg-accent-cyan-bg text-accent-cyan flex items-center justify-center text-[12px] font-heading font-bold shrink-0">02</span>
                <p className="text-[13px] text-text-main leading-relaxed">完善 <strong className="font-semibold">工作流设计</strong> — 掌握标准人机协同流程</p>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-[10px] hover:bg-bg-elevated cursor-pointer transition-colors">
                <span className="w-7 h-7 rounded-lg bg-accent-green-bg text-accent-green flex items-center justify-center text-[12px] font-heading font-bold shrink-0">03</span>
                <p className="text-[13px] text-text-main leading-relaxed">提升 <strong className="font-semibold">数据分析能力</strong> — 利用 AI 工具驱动决策</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Entry Cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-base font-heading font-semibold text-text-main mb-4">快速入口</h2>
        <EntryCards />
      </motion.div>
    </motion.div>
  );
}
