import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  MessageCircle, Map, Briefcase, LayoutDashboard,
  Settings, Users, FileText, SwitchCamera
} from "lucide-react";
import { useApp } from "../../context/AppContext";

interface NavItem {
  to: string;
  icon: any;
  label: string;
  badge?: string;
}

const employeeNav: NavItem[] = [
  { to: "/", icon: LayoutDashboard, label: "仪表盘" },
  { to: "/coach", icon: MessageCircle, label: "任务教练", badge: "新" },
  { to: "/path", icon: Map, label: "学习路径" },
  { to: "/workflow", icon: Briefcase, label: "工作流库" },
];

const hrNav: NavItem[] = [
  { to: "/mentor", icon: Users, label: "团队看板" },
  { to: "/report", icon: FileText, label: "成长报告" },
];

export default function Sidebar() {
  const { role, switchRole } = useApp();
  const navigate = useNavigate();
  const isHR = role === 'hr';

  const handleSwitchRole = () => {
    switchRole();
    // 切换角色后跳转到对应首页
    if (isHR) {
      navigate('/');
    } else {
      navigate('/mentor');
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[220px] bg-white border-r border-border-light z-50 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-3">
        <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center text-white font-heading font-bold text-sm ${
          isHR ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-brand to-accent-cyan'
        }`}>
          {isHR ? 'H' : 'A'}
        </div>
        <span className="font-heading font-bold text-[17px] text-text-main">
          {isHR ? 'HR 管理台' : '个人平台'}
        </span>
      </div>

      {/* Role badge */}
      <div className="px-5 pb-3">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium ${
          isHR
            ? 'bg-purple-50 text-purple-600'
            : 'bg-brand-bg text-brand'
        }`}>
          {isHR ? '👔 HR/导师' : '👤 个人视角'}
        </span>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-1 flex flex-col gap-0.5 overflow-y-auto" aria-label="主导航">
        {(isHR ? hrNav : employeeNav).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-colors ${
                isActive
                  ? isHR
                    ? "bg-purple-50 text-purple-600 font-semibold"
                    : "bg-brand-bg text-brand font-semibold"
                  : "text-text-secondary hover:bg-bg-elevated hover:text-text-main"
              }`
            }
          >
            <item.icon size={19} strokeWidth={1.8} />
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-brand-bg text-brand text-[11px] font-semibold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Settings (仅员工视角可见) */}
      {!isHR && (
        <nav className="px-3 pb-2 border-t border-border-light" aria-label="设置">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-bg text-brand font-semibold"
                  : "text-text-secondary hover:bg-bg-elevated hover:text-text-main"
              }`
            }
          >
            <Settings size={19} strokeWidth={1.8} />
            <span>设置</span>
          </NavLink>
        </nav>
      )}

      {/* Role switcher (for demo) */}
      <div className="px-3 pb-4">
        <button
          onClick={handleSwitchRole}
          className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-colors ${
            isHR
              ? 'text-brand hover:bg-brand-bg'
              : 'text-purple-600 hover:bg-purple-50'
          }`}
        >
          <SwitchCamera size={16} strokeWidth={1.8} />
          <span>切换到{isHR ? '个人' : 'HR'}视角</span>
        </button>
      </div>
    </aside>
  );
}
