import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { CoachProvider } from "./context/CoachContext";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import AITaskCoach from "./pages/AITaskCoach";
import LearningPath from "./pages/LearningPath";
import WorkflowLibrary from "./pages/WorkflowLibrary";
import ProfileSettings from "./pages/ProfileSettings";
import MentorDashboard from "./pages/MentorDashboard";
import GrowthReport from "./pages/GrowthReport";
import RoleGuard from "./components/auth/RoleGuard";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <AppProvider>
      <CoachProvider>
        <ErrorBoundary>
          <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="coach" element={<AITaskCoach />} />
                <Route path="path" element={<LearningPath />} />
                <Route path="workflow" element={<WorkflowLibrary />} />
                <Route path="settings" element={<ProfileSettings />} />
                {/* HR 专属页面，需 HR 角色 */}
                <Route path="mentor" element={
                  <RoleGuard requiredRole="hr"><MentorDashboard /></RoleGuard>
                } />
                <Route path="report" element={
                  <RoleGuard requiredRole="hr"><GrowthReport /></RoleGuard>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </HashRouter>
        </ErrorBoundary>
      </CoachProvider>
    </AppProvider>
  );
}
