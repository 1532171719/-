import React, { createContext, useContext, useState, useCallback } from "react";
import { EmployeeProfile, SkillRadar, WeekTask } from "../types";
import { defaultProfile, defaultSkills } from "../data/userProfile";
import { weekTasks as defaultWeekTasks } from "../data/learningPath";

type UserRole = 'employee' | 'hr';

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
      return saved ? JSON.parse(saved) : defaultProfile;
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
      return saved ? JSON.parse(saved) : defaultWeekTasks;
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
        const newStatus = t.status === 'pending' ? 'in_progress' : t.status === 'in_progress' ? 'completed' : 'pending';
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
