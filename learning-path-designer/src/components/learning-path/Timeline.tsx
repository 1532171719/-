import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import WeekCard from "./WeekCard";
import { WeekTask, LearningPhase } from "../../types";
import { useApp } from "../../context/AppContext";

interface TimelineProps {
  activePhase: number;
  phases: LearningPhase[];
  weekTasks: WeekTask[];
  onToggle: (week: number) => void;
}

export default function Timeline({ activePhase, phases, weekTasks, onToggle }: TimelineProps) {
  const { daysSinceStart } = useApp();
  const currentWeek = Math.ceil(daysSinceStart / 7);
  const phaseWeeks = phases[activePhase]?.weeks || [];
  const filteredTasks = weekTasks.filter(t => phaseWeeks.includes(t.week));

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activePhase}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="pl-2 pt-4"
      >
        {filteredTasks.map((task, i) => (
          <WeekCard
            key={task.week}
            task={task}
            index={i}
            isCurrentWeek={task.week === currentWeek}
            onToggle={onToggle}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
