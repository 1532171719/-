import { EmployeeProfile, SkillRadar } from "../types";

export interface NewcomerRecord {
  profile: EmployeeProfile;
  skills: SkillRadar;
  weeksCompleted: number;
  totalWeeks: number;
  currentPhase: string;
  riskLevel: 'low' | 'medium' | 'high';
  riskReason?: string;
  lastFeedback?: string;
  mentorNote?: string;
  avatar: string;
}

export const hrViewName = 'HR 管理员';

export const mockNewcomers: NewcomerRecord[] = [
  {
    profile: {
      employeeId: 'E001',
      name: '张三',
      role: '游戏策划',
      aiExperience: '基础',
      mentor: '李四',
      department: '新项目组',
      startDate: '2026-06-01',
      avatar: '',
    },
    skills: {
      aiToolSkill: 45,
      promptSkill: 50,
      workflowSkill: 35,
      riskAwareness: 60,
      collaboration: 55,
      deliveryQuality: 40,
    },
    weeksCompleted: 4,
    totalWeeks: 12,
    currentPhase: '基础融入期',
    riskLevel: 'low',
    lastFeedback: '张三学习态度积极，Prompt 能力提升明显',
    mentorNote: '建议第5周开始实战任务训练',
    avatar: '',
  },
  {
    profile: {
      employeeId: 'E002',
      name: '王小明',
      role: '程序开发',
      aiExperience: '熟练',
      mentor: '赵六',
      department: '技术中台',
      startDate: '2026-05-15',
      avatar: '',
    },
    skills: {
      aiToolSkill: 70,
      promptSkill: 65,
      workflowSkill: 55,
      riskAwareness: 50,
      collaboration: 40,
      deliveryQuality: 68,
    },
    weeksCompleted: 8,
    totalWeeks: 12,
    currentPhase: '岗位训练期',
    riskLevel: 'medium',
    riskReason: '团队协作评分偏低，较少参与代码评审',
    lastFeedback: '代码能力扎实，但需要更多参与团队 code review',
    mentorNote: '安排每周至少2次 code review 参与',
    avatar: '',
  },
  {
    profile: {
      employeeId: 'E003',
      name: '李小花',
      role: '美术设计',
      aiExperience: '基础',
      mentor: '孙七',
      department: '美术中心',
      startDate: '2026-04-20',
      avatar: '',
    },
    skills: {
      aiToolSkill: 80,
      promptSkill: 55,
      workflowSkill: 60,
      riskAwareness: 75,
      collaboration: 85,
      deliveryQuality: 72,
    },
    weeksCompleted: 11,
    totalWeeks: 12,
    currentPhase: '业务实战期',
    riskLevel: 'low',
    lastFeedback: '对 AI 工具掌握很好，风格一致性把控出色',
    mentorNote: '转正评估建议：通过，进入高阶训练',
    avatar: '',
  },
  {
    profile: {
      employeeId: 'E004',
      name: '陈小刚',
      role: 'QA测试',
      aiExperience: '基础',
      mentor: '周八',
      department: 'QA中心',
      startDate: '2026-06-05',
      avatar: '',
    },
    skills: {
      aiToolSkill: 30,
      promptSkill: 25,
      workflowSkill: 20,
      riskAwareness: 45,
      collaboration: 50,
      deliveryQuality: 35,
    },
    weeksCompleted: 1,
    totalWeeks: 12,
    currentPhase: '基础融入期',
    riskLevel: 'high',
    riskReason: 'AI 工具熟练度严重不足，需重点关注',
    lastFeedback: '对 AI 工具使用感到吃力，建议安排一对一辅导',
    mentorNote: '⚠️ 重点干预对象，每周至少2次面对面辅导',
    avatar: '',
  },
  {
    profile: {
      employeeId: 'E005',
      name: '赵晓雨',
      role: '运营发行',
      aiExperience: '专家',
      mentor: '吴九',
      department: '发行中心',
      startDate: '2026-05-01',
      avatar: '',
    },
    skills: {
      aiToolSkill: 90,
      promptSkill: 85,
      workflowSkill: 78,
      riskAwareness: 70,
      collaboration: 75,
      deliveryQuality: 82,
    },
    weeksCompleted: 9,
    totalWeeks: 12,
    currentPhase: '业务实战期',
    riskLevel: 'low',
    lastFeedback: '表现优异，多维度远超预期',
    mentorNote: '考虑加速培养，提前进入独立项目',
    avatar: '',
  },
];

export function getOverallStats(newcomers: NewcomerRecord[]) {
  return {
    total: newcomers.length,
    atRisk: newcomers.filter(n => n.riskLevel === 'high').length,
    avgProgress: Math.round(
      newcomers.reduce((sum, n) => sum + Math.round((n.weeksCompleted / n.totalWeeks) * 100), 0) / newcomers.length
    ),
    avgAiSkill: Math.round(
      newcomers.reduce((sum, n) => {
        const s = n.skills;
        return sum + (s.aiToolSkill + s.promptSkill + s.workflowSkill) / 3;
      }, 0) / newcomers.length
    ),
  };
}
