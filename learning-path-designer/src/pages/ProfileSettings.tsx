import React, { useState } from "react";
import { motion } from "framer-motion";
import { Settings, User, Save, RotateCcw, Sparkles, Bell, Shield, Users, AlertTriangle } from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import ParticleBg from "../components/ui/ParticleBg";
import { useApp } from "../context/AppContext";
import type { JobRole } from "../types";

const ROLES: JobRole[] = ['游戏策划', '程序开发', '美术设计', 'QA测试', '运营发行'];
const AI_LEVELS: string[] = ['基础', '熟练', '专家'];

/* ═══════════════════════════════════════
   个人档案设置
   ═══════════════════════════════════════ */
function EmployeeSettings() {
  const { profile, updateProfile, resetProfile } = useApp();

  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState<JobRole>(profile.role);
  const [aiExperience, setAiExperience] = useState(profile.aiExperience);
  const [mentor, setMentor] = useState(profile.mentor);
  const [department, setDepartment] = useState(profile.department);
  const [startDate, setStartDate] = useState(profile.startDate);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateProfile({
      name: name.trim() || profile.name,
      role,
      aiExperience,
      mentor: mentor.trim() || profile.mentor,
      department: department.trim() || profile.department,
      startDate,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetProfile();
    setName(profile.name);
    setRole(profile.role);
    setAiExperience(profile.aiExperience);
    setMentor(profile.mentor);
    setDepartment(profile.department);
    setStartDate(profile.startDate);
  };

  const hasChanges =
    name !== profile.name ||
    role !== profile.role ||
    aiExperience !== profile.aiExperience ||
    mentor !== profile.mentor ||
    department !== profile.department ||
    startDate !== profile.startDate;

  return (
    <>
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Settings size={24} className="text-accent-purple" />
          用户档案设置
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          完善你的个人档案，AI 将据此为你定制个性化学习路径和任务建议
        </p>
      </motion.div>

      <GlassCard className="p-6">
        {/* 头像区域 */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-purple-500/20">
            {name.slice(0, 1) || 'U'}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">{name || '新员工'}</h3>
            <p className="text-sm text-text-secondary">{role} · {department}</p>
            <p className="text-xs text-text-secondary mt-0.5">
              入职天数：{Math.floor((Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} 天
            </p>
          </div>
        </div>

        {/* 表单区域 */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              <User size={14} className="inline mr-1.5" />
              姓名
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="请输入姓名"
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              <Sparkles size={14} className="inline mr-1.5" />
              岗位
            </label>
            <div className="grid grid-cols-5 gap-2">
              {ROLES.map(r => (
                <motion.button
                  key={r}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setRole(r)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    role === r
                      ? 'bg-purple-500/20 border border-purple-500/50 text-purple-400'
                      : 'bg-white/5 border border-white/10 text-text-secondary hover:text-text-primary hover:bg-white/10'
                  }`}
                >
                  {r}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              <Sparkles size={14} className="inline mr-1.5" />
              AI 使用经验
            </label>
            <div className="grid grid-cols-3 gap-2">
              {AI_LEVELS.map(level => (
                <motion.button
                  key={level}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setAiExperience(level as '基础' | '熟练' | '专家')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    aiExperience === level
                      ? level === '基础'
                        ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                        : level === '熟练'
                        ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400'
                        : 'bg-purple-500/20 border border-purple-500/50 text-purple-400'
                      : 'bg-white/5 border border-white/10 text-text-secondary hover:text-text-primary hover:bg-white/10'
                  }`}
                >
                  {level === '基础' && '🌱 '}
                  {level === '熟练' && '⚡ '}
                  {level === '专家' && '🚀 '}
                  {level}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              <User size={14} className="inline mr-1.5" />
              导师
            </label>
            <input
              type="text"
              value={mentor}
              onChange={e => setMentor(e.target.value)}
              placeholder="请输入导师姓名"
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">部门</label>
            <input
              type="text"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              placeholder="请输入部门名称"
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">入职日期</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 text-sm [color-scheme:dark]"
            />
          </div>
        </div>

        {/* 按钮区域 */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-white/5 border border-white/10 text-text-secondary hover:bg-white/10 hover:text-text-primary transition-all duration-200"
          >
            <RotateCcw size={16} />
            恢复默认
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={!hasChanges}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              saved
                ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                : hasChanges
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 hover:from-purple-500 hover:to-blue-500'
                : 'bg-white/5 border border-white/10 text-text-secondary cursor-not-allowed'
            }`}
          >
            {saved ? <>✅ 已保存</> : <><Save size={16} /> 保存档案</>}
          </motion.button>
        </div>
      </GlassCard>
    </>
  );
}

/* ═══════════════════════════════════════
   HR 系统设置
   ═══════════════════════════════════════ */
function HRSettings() {
  const [saved, setSaved] = useState(false);
  const [notifyRisk, setNotifyRisk] = useState(true);
  const [notifyWeekly, setNotifyWeekly] = useState(true);
  const [riskThreshold, setRiskThreshold] = useState(40);
  const [checkInterval, setCheckInterval] = useState(7);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Settings size={24} className="text-purple-500" />
          系统配置
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          管理团队通知、风险预警阈值和评估周期
        </p>
      </motion.div>

      <div className="space-y-5">
        {/* 通知设置 */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Bell size={20} className="text-purple-400" />
            通知设置
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-primary">风险新人预警</p>
                <p className="text-xs text-text-secondary">当新人被标记为高风险时发送通知</p>
              </div>
              <button
                onClick={() => setNotifyRisk(!notifyRisk)}
                className={`w-11 h-6 rounded-full transition-colors ${notifyRisk ? 'bg-purple-500' : 'bg-white/10'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${notifyRisk ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-primary">周度进度报告</p>
                <p className="text-xs text-text-secondary">每周一发送团队进度汇总</p>
              </div>
              <button
                onClick={() => setNotifyWeekly(!notifyWeekly)}
                className={`w-11 h-6 rounded-full transition-colors ${notifyWeekly ? 'bg-purple-500' : 'bg-white/10'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${notifyWeekly ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </GlassCard>

        {/* 风险阈值 */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <AlertTriangle size={20} className="text-yellow-400" />
            风险预警阈值
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-text-secondary">AI 能力分预警线</label>
                <span className="text-sm font-semibold text-purple-400">{riskThreshold} 分</span>
              </div>
              <input
                type="range"
                min={20}
                max={80}
                value={riskThreshold}
                onChange={e => setRiskThreshold(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
              <p className="text-xs text-text-secondary mt-1">低于此分数的新人将被标记为高风险</p>
            </div>
          </div>
        </GlassCard>

        {/* 评估周期 */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Users size={20} className="text-blue-400" />
            评估配置
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">导师检查周期（天）</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={checkInterval}
                  onChange={e => setCheckInterval(Number(e.target.value))}
                  className="w-20 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-text-primary text-center focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <span className="text-sm text-text-secondary">天检查一次新人进度</span>
              </div>
            </div>
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Shield size={16} className="text-green-400" />
                <span>当前管理 5 位新人，覆盖 5 个岗位</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* 保存按钮 */}
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              saved
                ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 hover:from-purple-500 hover:to-pink-500'
            }`}
          >
            {saved ? <>✅ 已保存</> : <><Save size={16} /> 保存配置</>}
          </motion.button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════
   主入口
   ═══════════════════════════════════════ */
export default function ProfileSettings() {
  const { role } = useApp();
  const isHR = role === 'hr';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
      <ParticleBg />
      <div className="relative z-10 max-w-2xl mx-auto">
        {isHR ? <HRSettings /> : <EmployeeSettings />}
      </div>
    </motion.div>
  );
}
