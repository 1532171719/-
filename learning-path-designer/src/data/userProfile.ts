import { EmployeeProfile, SkillRadar } from "../types";

export const defaultProfile: EmployeeProfile = {
  employeeId: 'E001',
  name: '张三',
  role: '游戏策划',
  aiExperience: '基础',
  mentor: '李四',
  department: '新项目组',
  startDate: '2026-06-01',
  avatar: '',
};

export const defaultSkills: SkillRadar = {
  aiToolSkill: 45,
  promptSkill: 50,
  workflowSkill: 35,
  riskAwareness: 60,
  collaboration: 55,
  deliveryQuality: 40,
};

export function getWeekLabel(week: number): string {
  const labels: Record<number, string> = {
    1: '公司文化与AI Native认知',
    2: 'AI工具链基础与安全规范',
    3: 'Prompt工程与任务拆解',
    4: '游戏行业AI应用案例',
    5: '岗位任务拆解训练',
    6: 'AI辅助产出实战',
    7: '人工审查与质量控制',
    8: '团队协作与知识沉淀',
    9: '真实业务课题选择',
    10: 'AI协同执行项目',
    11: '复盘优化与迭代',
    12: '成果展示与转正评估',
  };
  return labels[week] || `第${week}周`;
}
