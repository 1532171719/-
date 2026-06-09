import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WeekTask } from "../../types";
import { CheckCircle2, Circle, Loader2, FileText, ChevronDown, BookOpen, Video, Link2 } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import NeonBadge from "../ui/NeonBadge";

interface WeekCardProps {
  task: WeekTask;
  index: number;
  isCurrentWeek: boolean;
  onToggle: (week: number) => void;
}

const typeBadge: Record<string, { color: 'purple' | 'cyan' | 'orange'; label: string }> = {
  learning: { color: 'cyan', label: '学习' },
  practice: { color: 'purple', label: '实战' },
  collaboration: { color: 'orange', label: '协作' },
};

// 模拟生成周任务详情
function generateTaskDetails(task: WeekTask) {
  const detailsMap: Record<string, string[]> = {
    learning: [
      '阅读相关文档与最佳实践',
      '完成配套练习与测验',
      '记录学习笔记与心得',
    ],
    practice: [
      '动手实践核心操作步骤',
      '独立完成示例项目',
      '提交实践成果并复盘',
    ],
    collaboration: [
      '与团队成员沟通协作',
      '参与团队讨论与评审',
      '输出协作总结文档',
    ],
  };
  return detailsMap[task.type] || detailsMap.learning;
}

// 模拟生成学习资源
function generateResources(task: WeekTask) {
  return [
    { icon: BookOpen, label: '文档教程', desc: `${task.title} - 官方指南` },
    { icon: Video, label: '视频课程', desc: `${task.title} - 实战演示` },
    { icon: Link2, label: '参考链接', desc: '相关案例与最佳实践' },
  ];
}

export default function WeekCard({ task, index, isCurrentWeek, onToggle }: WeekCardProps) {
  const [expanded, setExpanded] = useState(false);
  const badge = typeBadge[task.type] || { color: 'cyan' as const, label: '学习' };
  const isCompleted = task.status === 'completed';
  const isInProgress = task.status === 'in_progress';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex gap-4"
    >
      <div className="flex flex-col items-center">
        <div
          onClick={(e) => { e.stopPropagation(); onToggle(task.week); }}
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer transition-all hover:scale-110 ${
            isCompleted ? 'bg-accent-green/20 text-accent-green hover:bg-accent-green/30' :
            isInProgress ? 'bg-brand/20 text-brand hover:bg-brand/30' :
            'bg-bg-elevated text-text-secondary hover:bg-white/10'
          }`}
          title={isCompleted ? '点击标记为未完成' : isInProgress ? '点击标记为已完成' : '点击标记为进行中'}
        >
          {isCompleted ? <CheckCircle2 size={18} /> : isInProgress ? <Loader2 size={18} className="animate-spin" /> : <Circle size={18} />}
        </div>
        <div className={`w-0.5 flex-1 min-h-[40px] ${
          isCompleted ? 'bg-accent-green/30' : isInProgress ? 'bg-brand/30' : 'bg-white/5'
        }`} />
      </div>

      <GlassCard
        hover={false}
        neonColor={isCurrentWeek ? 'purple' : 'none'}
        className={`flex-1 p-4 mb-2 ${isCurrentWeek ? 'border-brand/30' : ''} cursor-pointer transition-all`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-text-secondary">第{task.week}周</span>
              <NeonBadge color={badge.color}>{badge.label}</NeonBadge>
              {isCurrentWeek && <NeonBadge color="purple" dot>当前</NeonBadge>}
            </div>
            <h4 className="text-sm font-semibold text-text-main">{task.title}</h4>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-text-secondary"
          >
            <ChevronDown size={16} />
          </motion.div>
        </div>

        {task.deliverables.length > 0 && (
          <div className="mt-2 pt-2 border-t border-white/5">
            <div className="flex items-center gap-1 mb-1">
              <FileText size={12} className="text-text-secondary" />
              <span className="text-[11px] text-text-secondary">交付物</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {task.deliverables.map((d, i) => (
                <span key={i} className={`text-[11px] px-2 py-0.5 rounded-full ${
                  isCompleted ? 'bg-accent-green/10 text-accent-green' : 'bg-white/5 text-text-secondary'
                }`}>
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 展开详情 */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-white/5">
                {/* 任务步骤 */}
                <div className="mb-3">
                  <p className="text-[11px] text-text-secondary mb-2 font-medium">任务步骤</p>
                  <div className="space-y-1.5">
                    {generateTaskDetails(task).map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-brand/10 text-brand flex items-center justify-center text-[10px] font-bold shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-[12px] text-text-secondary">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 学习资源 */}
                <div>
                  <p className="text-[11px] text-text-secondary mb-2 font-medium">学习资源</p>
                  <div className="space-y-1.5">
                    {generateResources(task).map((res, i) => (
                      <div key={i} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                        <res.icon size={12} className="text-text-secondary shrink-0" />
                        <div>
                          <p className="text-[11px] text-text-main font-medium">{res.label}</p>
                          <p className="text-[10px] text-text-secondary">{res.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
}
