import React, { createContext, useContext, useState, useCallback } from "react";
import { EmployeeProfile, SkillRadar, WeekTask, JobRole } from "../types";
import { defaultProfile, defaultSkills } from "../data/userProfile";
import { weekTasks as defaultWeekTasks } from "../data/learningPath";

type UserRole = 'employee' | 'hr';

const VALID_TASK_TYPES: WeekTask['type'][] = ['learning', 'practice', 'collaboration'];
const VALID_TASK_STATUSES: WeekTask['status'][] = ['completed', 'in_progress', 'pending'];
const VALID_ROLES: JobRole[] = ['游戏策划', '程序开发', '美术设计', 'QA测试', '运营发行'];
const VALID_AI_EXPERIENCE: EmployeeProfile['aiExperience'][] = ['基础', '熟练', '专家'];

/** 清洗从 localStorage 加载的 weekTasks，修复损坏的数据 */
function sanitizeWeekTasks(tasks: unknown): WeekTask[] {
  if (!Array.isArray(tasks)) return defaultWeekTasks;
  const sanitized = tasks.map((t: any, i: number): WeekTask => ({
    week: typeof t?.week === 'number' ? t.week : i + 1,
    title: typeof t?.title === 'string' ? t.title : `第${i + 1}周`,
    type: VALID_TASK_TYPES.includes(t?.type) ? t.type : 'learning',
    status: VALID_TASK_STATUSES.includes(t?.status) ? t.status : 'pending',
    deliverables: Array.isArray(t?.deliverables) ? t.deliverables.filter((d: any) => typeof d === 'string') : [],
  }));
  return sanitized.length === 12 ? sanitized : defaultWeekTasks;
}

/** 清洗从 localStorage 加载的 profile */
function sanitizeProfile(data: unknown): EmployeeProfile {
  if (!data || typeof data !== 'object') return defaultProfile;
  const d = data as any;
  return {
    employeeId: typeof d.employeeId === 'string' ? d.employeeId : defaultProfile.employeeId,
    name: typeof d.name === 'string' ? d.name : defaultProfile.name,
    role: VALID_ROLES.includes(d.role) ? d.role : defaultProfile.role,
    aiExperience: VALID_AI_EXPERIENCE.includes(d.aiExperience) ? d.aiExperience : defaultProfile.aiExperience,
    mentor: typeof d.mentor === 'string' ? d.mentor : defaultProfile.mentor,
    department: typeof d.department === 'string' ? d.department : defaultProfile.department,
    startDate: typeof d.startDate === 'string' ? d.startDate : defaultProfile.startDate,
    avatar: typeof d.avatar === 'string' ? d.avatar : defaultProfile.avatar,
  };
}

interface AppContextValue {
  profile: EmployeeProfile;
  skills: SkillRadar;
  daysSinceStart: number;
  currentPhase: string;
  role: UserRole;
  weekTasks: WeekTask[];
  updateProfile: (updates: Partial<EmployeeProfile>) => void;
  updateSkills: (updates: Partial<SkillRadar>) => void;
  toggleTaskStatus: (week: number) => void;
  updateWeekTasks: (tasks: WeekTask[]) => void;
  resetProfile: () => void;
  switchRole: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<EmployeeProfile>(() => {
    try {
      const saved = localStorage.getItem('aihr_profile');
      return saved ? sanitizeProfile(JSON.parse(saved)) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const [skills, setSkills] = useState<SkillRadar>(() => {
    try {
      const saved = localStorage.getItem('aihr_skills');
      return saved ? JSON.parse(saved) : defaultSkills;
    } catch {
      return defaultSkills;
    }
  });

  const [weekTasks, setWeekTasks] = useState<WeekTask[]>(() => {
    try {
      const saved = localStorage.getItem('aihr_weekTasks');
      return saved ? sanitizeWeekTasks(JSON.parse(saved)) : defaultWeekTasks;
    } catch {
      return defaultWeekTasks;
    }
  });

  const [role, setRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem('aihr_role');
      return (saved === 'hr' ? 'hr' : 'employee') as UserRole;
    } catch {
      return 'employee';
    }
  });

  const updateProfile = useCallback((updates: Partial<EmployeeProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem('aihr_profile', JSON.stringify(next));
      return next;
    });
  }, []);

  const updateSkills = useCallback((updates: Partial<SkillRadar>) => {
    setSkills(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem('aihr_skills', JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleTaskStatus = useCallback((week: number) => {
    setWeekTasks(prev => {
      const next = prev.map(t => {
        if (t.week !== week) return t;
        const newStatus = (t.status === 'pending' ? 'in_progress' : t.status === 'in_progress' ? 'completed' : 'pending') as WeekTask['status'];
        return { ...t, status: newStatus };
      });
      localStorage.setItem('aihr_weekTasks', JSON.stringify(next));
      return next;
    });
  }, []);

  const updateWeekTasks = useCallback((tasks: WeekTask[]) => {
    setWeekTasks(tasks);
    localStorage.setItem('aihr_weekTasks', JSON.stringify(tasks));
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(defaultProfile);
    setSkills(defaultSkills);
    setWeekTasks(defaultWeekTasks);
    localStorage.removeItem('aihr_profile');
    localStorage.removeItem('aihr_skills');
    localStorage.removeItem('aihr_weekTasks');
  }, []);

  const switchRole = useCallback(() => {
    setRole(prev => {
      const next = prev === 'employee' ? 'hr' : 'employee';
      localStorage.setItem('aihr_role', next);
      return next;
    });
  }, []);

  const startDate = new Date(profile.startDate);
  const daysSinceStart = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const currentPhase = daysSinceStart <= 30 ? '基础融入期' : daysSinceStart <= 60 ? '岗位训练期' : '业务实战期';

  return (
    <AppContext.Provider value={{
      profile,
      skills,
      daysSinceStart,
      currentPhase,
      role,
      weekTasks,
      updateProfile,
      updateSkills,
      toggleTaskStatus,
      updateWeekTasks,
      resetProfile,
      switchRole,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
