// Core type definitions for the Learning Path Designer Demo

export interface EmployeeProfile {
  employeeId: string;
  name: string;
  role: JobRole;
  aiExperience: '基础' | '熟练' | '专家';
  mentor: string;
  department: string;
  startDate: string;
  avatar: string;
}

export type JobRole = '游戏策划' | '程序开发' | '美术设计' | 'QA测试' | '运营发行';

export interface SkillRadar {
  aiToolSkill: number;
  promptSkill: number;
  workflowSkill: number;
  riskAwareness: number;
  collaboration: number;
  deliveryQuality: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  timestamp: number;
  isTyping?: boolean;
}

export interface SubTask {
  id: string;
  title: string;
  description: string;
  promptTemplate: string;
  recommendedTools: string[];
  checklist: string[];
  riskWarnings: string[];
}

export type CoachPhase = 'IDLE' | 'WAITING_INPUT' | 'THINKING' | 'FOLLOW_UP' | 'GENERATING' | 'COMPLETE';

export interface WeekTask {
  week: number;
  title: string;
  type: 'learning' | 'practice' | 'collaboration';
  status: 'completed' | 'in_progress' | 'pending';
  deliverables: string[];
}

export type PhaseName = '基础融入期' | '岗位训练期' | '业务实战期';

export interface LearningPhase {
  name: PhaseName;
  weeks: number[];
  color: string;
  description: string;
}

export interface WorkflowStep {
  id: string;
  label: string;
  role: 'ai' | 'human' | 'mentor';
  description: string;
}

export interface WorkflowTemplate {
  id: string;
  role: JobRole;
  title: string;
  description: string;
  steps: WorkflowStep[];
  icon: string;
}
