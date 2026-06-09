import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, AlertTriangle, TrendingUp, Brain,
  ChevronDown, ChevronUp, Clock, UserCheck, MessageSquare,
  LayoutDashboard
} from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import GlassCard from "../components/ui/GlassCard";
import ParticleBg from "../components/ui/ParticleBg";
import ProgressBar from "../components/ui/ProgressBar";
import { mockNewcomers, getOverallStats, hrViewName, type NewcomerRecord } from "../data/mentorData";

const RISK_COLORS = { low: 'bg-green-400', medium: 'bg-yellow-400', high: 'bg-red-400' };
const RISK_TEXTS = { low: '正常', medium: '关注', high: '危险' };
const RISK_TEXT_COLORS = { low: 'text-green-400', medium: 'text-yellow-400', high: 'text-red-400' };

const PHASE_COLORS: Record<string, string> = {
  '基础融入期': 'text-cyan-400 bg-cyan-400/10',
  '岗位训练期': 'text-purple-400 bg-purple-400/10',
  '业务实战期': 'text-orange-400 bg-orange-400/10',
};

function SkillMiniRadar({ skills }: { skills: NewcomerRecord['skills'] }) {
  const data = [
    { name: 'AI工具', value: skills.aiToolSkill },
    { name: 'Prompt', value: skills.promptSkill },
    { name: '工作流', value: skills.workflowSkill },
    { name: '风险意识', value: skills.riskAwareness },
    { name: '协作', value: skills.collaboration },
    { name: '交付', value: skills.deliveryQuality },
  ];

  return (
    <RadarChart width={160} height={140} data={data} className="mx-auto">
      <PolarGrid stroke="rgba(255,255,255,0.08)" />
      <PolarAngleAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }} />
      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
      <Radar dataKey="value" stroke="#7B61FF" fill="#7B61FF" fillOpacity={0.25} />
    </RadarChart>
  );
}

export default function MentorDashboard() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterRisk, setFilterRisk] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const stats = getOverallStats(mockNewcomers);

  const filtered = filterRisk === 'all'
    ? mockNewcomers
    : mockNewcomers.filter(n => n.riskLevel === filterRisk);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
      <ParticleBg />

      <div className="relative z-10">
        <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <LayoutDashboard size={24} className="text-accent-purple" />
            新人管理看板
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            当前视角：<span className="text-purple-400 font-medium">{hrViewName}</span> · 跟踪所有新人的学习进度与能力成长
          </p>
        </motion.div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { icon: Users, label: '在培新人', value: stats.total, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
            { icon: AlertTriangle, label: '风险新人', value: stats.atRisk, color: 'text-red-400', bg: 'bg-red-400/10' },
            { icon: TrendingUp, label: '平均进度', value: `${stats.avgProgress}%`, color: 'text-green-400', bg: 'bg-green-400/10' },
            { icon: Brain, label: 'AI 能力均值', value: stats.avgAiSkill, color: 'text-purple-400', bg: 'bg-purple-400/10' },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                    <card.icon size={20} className={card.color} />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">{card.label}</p>
                    <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* 筛选按钮 */}
        <div className="flex gap-2 mb-4">
          {[
            { key: 'all', label: '全部', color: '' },
            { key: 'high', label: '🔴 高风险', color: 'hover:border-red-500/50' },
            { key: 'medium', label: '🟡 关注中', color: 'hover:border-yellow-500/50' },
            { key: 'low', label: '🟢 正常', color: 'hover:border-green-500/50' },
          ].map(f => (
            <motion.button
              key={f.key}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setFilterRisk(f.key as typeof filterRisk)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200
                ${filterRisk === f.key
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                  : `bg-white/5 border-white/10 text-text-secondary hover:text-text-primary ${f.color}`
                }`}
            >
              {f.label}
            </motion.button>
          ))}
        </div>

        {/* 新人列表 */}
        <div className="space-y-3">
          {filtered.map((newcomer, idx) => (
            <motion.div
              key={newcomer.profile.employeeId}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <GlassCard className="overflow-hidden">
                {/* 主行 */}
                <div
                  className="p-4 flex items-center gap-4 cursor-pointer hover:bg-white/[0.02]"
                  onClick={() => setExpandedId(expandedId === newcomer.profile.employeeId ? null : newcomer.profile.employeeId)}
                >
                  {/* 头像 + 姓名 */}
                  <div className="flex items-center gap-3 min-w-[140px]">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {newcomer.profile.name.slice(0, 1)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{newcomer.profile.name}</p>
                      <p className="text-xs text-text-secondary">{newcomer.profile.role} · {newcomer.profile.department}</p>
                    </div>
                  </div>

                  {/* 进度 */}
                  <div className="flex-1 min-w-[120px]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-text-secondary">
                        <Clock size={12} className="inline mr-1" />
                        {newcomer.weeksCompleted}/{newcomer.totalWeeks} 周
                      </span>
                      <span className="text-xs text-text-secondary">
                        {Math.round((newcomer.weeksCompleted / newcomer.totalWeeks) * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(newcomer.weeksCompleted / newcomer.totalWeeks) * 100}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                      />
                    </div>
                  </div>

                  {/* AI 能力分 */}
                  <div className="min-w-[80px] text-center">
                    <p className="text-lg font-bold text-purple-400">
                      {Math.round(
                        (newcomer.skills.aiToolSkill + newcomer.skills.promptSkill + newcomer.skills.workflowSkill) / 3
                      )}
                    </p>
                    <p className="text-xs text-text-secondary">AI 能力</p>
                  </div>

                  {/* 风险等级 */}
                  <div className="min-w-[60px] text-center">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${RISK_TEXT_COLORS[newcomer.riskLevel]} bg-white/5`}>
                      <span className={`w-2 h-2 rounded-full ${RISK_COLORS[newcomer.riskLevel]}`} />
                      {RISK_TEXTS[newcomer.riskLevel]}
                    </div>
                  </div>

                  {/* 阶段 */}
                  <div className="min-w-[90px]">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${PHASE_COLORS[newcomer.currentPhase] || 'text-gray-400 bg-gray-400/10'}`}>
                      {newcomer.currentPhase}
                    </span>
                  </div>

                  {/* 展开按钮 */}
                  <div className="text-text-secondary">
                    {expandedId === newcomer.profile.employeeId ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {/* 展开详情 */}
                <AnimatePresence>
                  {expandedId === newcomer.profile.employeeId && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/10 p-5">
                        {/* 能力雷达图 + 反馈 */}
                        <div className="grid grid-cols-2 gap-6">
                          {/* 能力雷达图 */}
                          <div>
                            <h4 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-1.5">
                              <Brain size={15} className="text-purple-400" />
                              六维能力画像
                            </h4>
                            <SkillMiniRadar skills={newcomer.skills} />
                          </div>

                          {/* 反馈信息 */}
                          <div className="space-y-3">
                            {/* 风险原因 */}
                            {newcomer.riskReason && (
                              <div>
                                <p className="text-xs font-medium text-yellow-400 mb-1 flex items-center gap-1">
                                  <AlertTriangle size={12} />
                                  风险提示
                                </p>
                                <p className="text-sm text-text-secondary">
                                  {newcomer.riskReason}
                                </p>
                              </div>
                            )}

                            {/* 导师反馈 */}
                            {newcomer.lastFeedback && (
                              <div>
                                <p className="text-xs font-medium text-cyan-400 mb-1 flex items-center gap-1">
                                  <MessageSquare size={12} />
                                  最近反馈
                                </p>
                                <p className="text-sm text-text-secondary">
                                  {newcomer.lastFeedback}
                                </p>
                              </div>
                            )}

                            {/* 导师备注 */}
                            {newcomer.mentorNote && (
                              <div>
                                <p className="text-xs font-medium text-purple-400 mb-1 flex items-center gap-1">
                                  <UserCheck size={12} />
                                  导师建议
                                </p>
                                <p className="text-sm text-text-secondary">
                                  {newcomer.mentorNote}
                                </p>
                              </div>
                            )}

                            {/* 基础信息 */}
                            <div className="pt-2 border-t border-white/10">
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-text-secondary">
                                <span>导师：{newcomer.profile.mentor}</span>
                                <span>入职：{newcomer.profile.startDate}</span>
                                <span>AI经验：{newcomer.profile.aiExperience}</span>
                                <span>工号：{newcomer.profile.employeeId}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-secondary">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">没有符合条件的新人记录</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
