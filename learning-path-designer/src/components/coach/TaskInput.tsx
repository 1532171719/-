import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, RotateCcw } from "lucide-react";
import { useCoach } from "../../context/CoachContext";

export default function TaskInput() {
  const [input, setInput] = useState('');
  const { sendMessage, resetCoach, phase, isLoading } = useCoach();

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-white/5 p-4">
      <div className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={phase === 'WAITING_INPUT' ? '输入你的岗位任务，例如：帮我设计一个新手7日登录活动...' : '补充任务细节...'}
            disabled={isLoading}
            className="w-full bg-bg-elevated border border-white/10 rounded-xl px-4 py-3 text-sm text-text-main placeholder-text-secondary outline-none transition-all focus:border-brand/50 focus:shadow-[0_0_15px_rgba(123,97,255,0.1)] disabled:opacity-50"
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand to-brand-light flex items-center justify-center text-white shadow-lg hover:shadow-brand/20 disabled:opacity-40 transition-all flex-shrink-0"
        >
          <Send size={18} />
        </motion.button>
        {phase === 'COMPLETE' && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetCoach}
            className="w-11 h-11 rounded-xl bg-white border border-border-light shadow-card flex items-center justify-center text-text-secondary hover:text-text-main transition-colors flex-shrink-0"
            title="开始新任务"
          >
            <RotateCcw size={18} />
          </motion.button>
        )}
      </div>
    </div>
  );
}
