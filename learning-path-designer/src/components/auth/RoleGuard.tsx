import React from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole: "employee" | "hr";
}

/**
 * 角色守卫组件：只有匹配角色才能访问，否则重定向到对应首页
 */
export default function RoleGuard({ children, requiredRole }: RoleGuardProps) {
  const { role } = useApp();

  if (role !== requiredRole) {
    // 角色不匹配，重定向到正确首页
    const redirectTo = role === "hr" ? "/mentor" : "/";
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
