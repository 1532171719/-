import React, { useState } from "react";
import { motion } from "framer-motion";
import { Map, Sparkles, Loader2, RefreshCw } from "lucide-react";
import PhaseIndicator from "../components/learning-path/PhaseIndicator";
import Timeline from "../components/learning-path/Timeline";
import ProgressBar from "../components/ui/ProgressBar";
import GlassCard from "../components/ui/GlassCard";
import ParticleBg from "../components/ui/ParticleBg";
import { phases as defaultPhases, weekTasks as defaultTasks } from "../data/learningPath";
import { generateLearningPathWithAI } from "../services/learningPathGenerator";
import { useApp } from "../context/AppContext";
import type { LearningPhase } from "../types";

export default function LearningPath() {
  const { profile, weekTasks, toggleTaskStatus, updateWeekTasks } = useApp();
  const [activePhase, setActivePhase] = useState(1);
  const [phases, setPhases] = useState<LearningPhase[]>(defaultPhases);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStatus, setGenStatus] = useState<string>('');
  const [genError, setGenError] = useState<string>('');
  const [hasAIPath, setHasAIPath] = useState(false);

  const completed = weekTasks.filter(t => t.status === 'completed').length;
  const total = weekTasks.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleGeneratePath = async () => {
    setIsGenerating(true);
    setGenError('');
    setGenStatus('');

    try {
      const result = await generateLearningPathWithAI(profile, (status) => {
        setGenStatus(status);
      });

      setPhases(result.phases);
      updateWeekTasks(result.weekTasks);
      setHasAIPath(true);
      setActivePhase(1); // 回到第一阶段
    } catch (error) {
      const msg = error instanceof Error ? error.message : '生成失败';
      setGenError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setPhases(defaultPhases);
    updateWeekTasks(defaultTasks);
    setHasAIPath(false);
    setGenError('');
    setGenStatus('');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
      <ParticleBg />

      <div className="relative z-10">
        <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
              <Map size={24} className="text-accent-purple" />
              三个月学习路径
            </h1>

            <div className="flex gap-2">
              {hasAIPath && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                    bg-glass border border-white/10 text-text-secondary
                    hover:bg-glass-hover hover:text-text-primary transition-all duration-200"
                >
                  <RefreshCw size={14} />
                  恢复默认
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGeneratePath}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                  bg-gradient-to-r from-purple-600 to-blue-600 text-white
                  shadow-lg shadow-purple-500/25
                  hover:shadow-purple-500/40 hover:from-purple-500 hover:to-blue-500
                  disabled:opacity-60 disabled:cursor-not-allowed
                  transition-all duration-200"
              >
                {isGenerating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Sparkles size={16} />
                )}
                {isGenerating ? 'AI 生成中...' : hasAIPath ? '重新 AI 生成' : 'AI 生成个性化路径'}
              </motion.button>
            </div>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            从AI基础认知到业务实战交付，按周追踪你的成长轨迹
            {hasAIPath && <span className="text-purple-400 ml-2">• 当前：AI 个性化路径</span>}
          </p>
        </motion.div>

        {/* 生成状态提示 */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4"
          >
            <GlassCard className="p-4 border border-purple-500/30">
              <div className="flex items-center gap-3">
                <Loader2 size={20} className="animate-spin text-purple-400" />
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {genStatus || 'AI 正在生成个性化学习路径...'}
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    根据你的岗位和 AI 经验水平，定制 12 周成长计划
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* 错误提示 */}
        {genError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4"
          >
            <GlassCard className="p-4 border border-red-500/30">
              <p className="text-sm text-red-400">
                ❌ {genError}
              </p>
            </GlassCard>
          </motion.div>
        )}

        <GlassCard className="p-4 mb-6">
          <ProgressBar value={completed} max={total} label="整体完成进度" color="purple" />
        </GlassCard>

        <PhaseIndicator phases={phases} currentPhase={activePhase} onSelectPhase={setActivePhase} />
        <Timeline activePhase={activePhase} phases={phases} weekTasks={weekTasks} onToggle={toggleTaskStatus} />
      </div>
    </motion.div>
  );
}
