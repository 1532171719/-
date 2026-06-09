import React from "react";
import { motion } from "framer-motion";
import { useCoach } from "../context/CoachContext";
import ChatWindow from "../components/coach/ChatWindow";
import TaskInput from "../components/coach/TaskInput";
import TaskCard from "../components/coach/TaskCard";
import ParticleBg from "../components/ui/ParticleBg";
import { Sparkles, ListChecks } from "lucide-react";

export default function AITaskCoach() {
  const { subTasks, phase } = useCoach();
  const hasResults = phase === 'COMPLETE' && subTasks.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative h-[calc(100vh-7rem)]"
    >
      <ParticleBg />

      <div className="relative z-10 h-full">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-4"
        >
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Sparkles size={24} className="text-accent-purple" />
            任务教练
          </h1>
          <p className="text-sm text-text-secondary mt-1">输入你的岗位任务，教练帮你一步步拆解并生成执行方案</p>
        </motion.div>

        <div className="flex gap-4 h-[calc(100%-4rem)]">
          <div className={`${hasResults ? 'w-[60%]' : 'w-full'} flex flex-col glass rounded-2xl overflow-hidden transition-all duration-500`}>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
              <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
              <span className="text-xs text-text-secondary">Coach Online</span>
              {phase === 'FOLLOW_UP' && (
                <span className="text-[11px] text-accent-orange ml-auto">等待补充信息...</span>
              )}
            </div>
            <ChatWindow />
            <TaskInput />
          </div>

          {hasResults && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="w-[40%] flex flex-col glass rounded-2xl overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <ListChecks size={16} className="text-accent-purple" />
                <span className="text-sm font-semibold text-text-primary">任务拆解结果</span>
                <span className="text-[11px] text-text-secondary">{subTasks.length} 步</span>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {subTasks.map((task, i) => (
                  <TaskCard key={task.id} task={task} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
