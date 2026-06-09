import { WeekTask, LearningPhase } from "../types";
import { getWeekLabel } from "./userProfile";

export const phases: LearningPhase[] = [
  { name: '基础融入期', weeks: [1, 2, 3, 4], color: '#00C9FF', description: '帮助新人完成从"使用AI工具"到"理解AI协作方式"的转变' },
  { name: '岗位训练期', weeks: [5, 6, 7, 8], color: '#7B61FF', description: '把AI工具嵌入岗位真实任务，形成可复用的AI工作流' },
  { name: '业务实战期', weeks: [9, 10, 11, 12], color: '#FF6B35', description: '参与真实项目，完成可评估的人机协同交付' },
];

export const weekTasks: WeekTask[] = [
  { week: 1, title: getWeekLabel(1), type: 'learning', status: 'completed', deliverables: ['个人融入地图', 'AI Native认知自评表'] },
  { week: 2, title: getWeekLabel(2), type: 'learning', status: 'completed', deliverables: ['AI工具使用清单', '安全规范承诺书'] },
  { week: 3, title: getWeekLabel(3), type: 'practice', status: 'completed', deliverables: ['个人Prompt模板库', '任务拆解练习记录'] },
  { week: 4, title: getWeekLabel(4), type: 'collaboration', status: 'completed', deliverables: ['岗位AI应用机会清单', '案例学习总结'] },
  { week: 5, title: getWeekLabel(5), type: 'practice', status: 'in_progress', deliverables: ['岗位任务拆解图', '第一版岗位作品'] },
  { week: 6, title: getWeekLabel(6), type: 'practice', status: 'pending', deliverables: ['AI辅助产出作品', '工具使用效率报告'] },
  { week: 7, title: getWeekLabel(7), type: 'practice', status: 'pending', deliverables: ['导师评审记录', '修改版作品'] },
  { week: 8, title: getWeekLabel(8), type: 'collaboration', status: 'pending', deliverables: ['可复用工作流模板', '团队协作记录'] },
  { week: 9, title: getWeekLabel(9), type: 'collaboration', status: 'pending', deliverables: ['项目任务书', '课题研究方案'] },
  { week: 10, title: getWeekLabel(10), type: 'practice', status: 'pending', deliverables: ['项目中期版本', '协同开发日志'] },
  { week: 11, title: getWeekLabel(11), type: 'practice', status: 'pending', deliverables: ['最终交付物', 'AI Review报告'] },
  { week: 12, title: getWeekLabel(12), type: 'collaboration', status: 'pending', deliverables: ['个人AI Native成长报告', '转正评估表'] },
];

export function getPhaseForWeek(week: number): LearningPhase | undefined {
  return phases.find(p => p.weeks.includes(week));
}

export function getCompletedWeeks(): number {
  return weekTasks.filter(t => t.status === 'completed').length;
}

export function getTotalProgress(): { completed: number; total: number; percentage: number } {
  const completed = getCompletedWeeks();
  return { completed, total: 12, percentage: Math.round((completed / 12) * 100) };
}
