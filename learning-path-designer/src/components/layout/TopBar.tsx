import React from "react";
import { useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Search, Bell, Users } from "lucide-react";

const breadcrumbMap: Record<string, string> = {
  "/": "仪表盘",
  "/coach": "任务教练",
  "/path": "学习路径",
  "/workflow": "工作流库",
  "/mentor": "团队看板",
  "/report": "成长报告",
  "/settings": "设置",
};

export default function TopBar() {
  const { profile, daysSinceStart, currentPhase, role } = useApp();
  const location = useLocation();
  const currentPage = breadcrumbMap[location.pathname] || "仪表盘";
  const isHR = role === 'hr';

  return (
    <header className="fixed top-0 left-[220px] right-0 h-[60px] bg-white/85 backdrop-blur-md border-b border-border-light flex items-center justify-between px-6 z-40">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[13px] text-text-muted">
        <span>{currentPage}</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-border-light bg-white text-text-muted text-[13px]">
          <Search size={15} />
          <input
            type="text"
            placeholder={isHR ? "搜索新人或团队..." : "搜索任务或课程..."}
            className="bg-transparent border-none outline-none w-[140px] text-text-main placeholder:text-text-muted"
            aria-label={isHR ? "搜索新人或团队" : "搜索任务或课程"}
          />
        </div>

        {/* Notification */}
        <button
          className="relative w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:bg-bg-elevated transition-colors"
          aria-label="通知中心"
        >
          <Bell size={19} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-red" />
        </button>

        {isHR ? (
          /* HR 视角右上角 */
          <>
            <button className="flex items-center gap-2.5 py-1 pl-1 pr-3 rounded-full hover:bg-bg-elevated transition-colors">
              <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-heading font-bold text-sm">
                H
              </div>
              <div className="text-left leading-tight">
                <p className="text-[13px] font-semibold text-text-main">HR 管理员</p>
                <p className="text-[11px] text-text-secondary">导师团队</p>
              </div>
            </button>

            <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-[12px] font-semibold tabular-nums font-heading flex items-center gap-1">
              <Users size={13} strokeWidth={2} />
              管理 5 人
            </span>
          </>
        ) : (
          /* 员工视角右上角 */
          <>
            <button className="flex items-center gap-2.5 py-1 pl-1 pr-3 rounded-full hover:bg-bg-elevated transition-colors">
              <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-brand to-brand-light flex items-center justify-center text-white font-heading font-bold text-sm">
                {profile.name[0]}
              </div>
              <div className="text-left leading-tight">
                <p className="text-[13px] font-semibold text-text-main">{profile.name}</p>
                <p className="text-[11px] text-text-secondary">{profile.role}</p>
              </div>
            </button>

            <span className="px-3 py-1 rounded-full bg-brand-bg text-brand text-[12px] font-semibold tabular-nums font-heading">
              已学习 {daysSinceStart} 天
            </span>

            <span className="px-3 py-1 rounded-full bg-accent-cyan-bg text-accent-cyan text-[12px] font-semibold">
              {currentPhase}
            </span>
          </>
        )}
      </div>
    </header>
  );
}
