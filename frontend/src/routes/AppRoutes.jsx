import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "../context/AuthContext";
import { RequireAuth, RejectAuth } from "./ProtectedRoutes";

import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import ProjectsListPage from "../features/projects/pages/ProjectsListPage";
import TaskManagementPage from "../features/tasks/pages/TaskManagementPage";
import TeamAnalysisPage from "../features/team-analysis/pages/TeamAnalysisPage";
import AIReportsPage from "../features/ai-reports/pages/AIReportsPage";
import CreateProjectPage from "../features/projects/pages/CreateProjectPage";
import ProjectDetailsPage from "../features/projects/pages/ProjectDetailsPage";
import IdeaValidationPage from "../features/validation/pages/IdeaValidationPage";

function RouteManager() {
  const navigate = useNavigate();
  const [isExpanding, setIsExpanding] = useState(false);
  const [useTransition, setUseTransition] = useState(true);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });

  const handleGetStarted = (e) => {
    setUseTransition(true);
    if (e && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      setOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    } else {
      setOrigin({ x: window.innerWidth - 80, y: 40 });
    }
    setIsExpanding(true);

    setTimeout(() => {
      setUseTransition(false);
      setIsExpanding(false);
      navigate("/login");
    }, 500);
  };

  return (
    <div className="relative min-h-screen bg-[#0B0B0B]">
      <div
        className="fixed rounded-full bg-[#D97706] pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${origin.x}px`,
          top: `${origin.y}px`,
          width: isExpanding ? "350vmax" : "0vmax",
          height: isExpanding ? "350vmax" : "0vmax",
          transition: useTransition ? "width 500ms ease-out, height 500ms ease-out" : "none"
        }}
      />
      
      <Routes>
        <Route path="/" element={<RejectAuth><LandingPage onGetStarted={handleGetStarted} /></RejectAuth>} />
        <Route path="/login" element={<RejectAuth><Login /></RejectAuth>} />
        
        {/* Securely Wrapped Feature Route */}
        <Route path="/dashboard" element={
          <RequireAuth>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </RequireAuth>
        } />
        <Route
  path="/projects/:projectId"
  element={
    <RequireAuth>
      <DashboardLayout>
        <ProjectDetailsPage />
      </DashboardLayout>
    </RequireAuth>
  }
/>

        <Route path="/projects" element={
          <RequireAuth>
            <DashboardLayout><ProjectsListPage /></DashboardLayout>
          </RequireAuth>
        } />
        
        <Route path="/tasks" element={
          <RequireAuth>
            <DashboardLayout><TaskManagementPage /></DashboardLayout>
          </RequireAuth>
        } />
        
        <Route path="/team-analysis/:projectId" element={
          <RequireAuth>
            <DashboardLayout><TeamAnalysisPage /></DashboardLayout>
          </RequireAuth>
        } />
        
        <Route path="/ai-reports" element={
          <RequireAuth>
            <DashboardLayout><AIReportsPage /></DashboardLayout>
          </RequireAuth>
        } />

        <Route path="/projects/new" element={
          <RequireAuth>
            <DashboardLayout><CreateProjectPage /></DashboardLayout>
          </RequireAuth>
        } />

        <Route path="/tasks/manage" element={
          <RequireAuth>
            <DashboardLayout><TaskManagementPage /></DashboardLayout>
          </RequireAuth>
        } />

        <Route path="/validation/:projectId" element={
          <RequireAuth>
            <DashboardLayout><IdeaValidationPage /></DashboardLayout>
          </RequireAuth>
        } />
        
      </Routes>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <AuthProvider>
      <Router>
        <RouteManager />
      </Router>
    </AuthProvider>
  );
}