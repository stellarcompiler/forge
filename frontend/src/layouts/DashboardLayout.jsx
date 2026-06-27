import { useAuth } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/"); 
  };

  // Helper function to dynamically calculate active route styling
  const getNavLinkClass = ({ isActive }) => 
    `text-sm font-medium transition-colors hover:text-[#F5F5F5] ${
      isActive ? "text-[#D97706]" : "text-zinc-400"
    }`;

  return (
    <div className="flex min-h-screen bg-[#0B0B0B] text-[#F5F5F5] font-sans">
      {/* Sidebar Workspace Navigation */}
      <aside className="w-64 border-r border-[#232323] bg-[#0B0B0B] flex flex-col justify-between p-6">
        <div className="space-y-8">
          <div className="font-bold tracking-wider text-sm border-b border-[#232323] pb-4">
            FORGE HUB
          </div>
          <nav className="flex flex-col gap-4">
            <NavLink to="/dashboard" className={getNavLinkClass}>
              Workspace
            </NavLink>
            <NavLink to="/projects" className={getNavLinkClass}>
              Projects
            </NavLink>
             <NavLink to="/validation/1" className={getNavLinkClass}>
              Idea Validation
            </NavLink>
            <NavLink to="/team-analysis/1" className={getNavLinkClass}>
              Team Analysis
            </NavLink>
            <NavLink to="/tasks" className={getNavLinkClass}>
              Tasks
            </NavLink>
            <NavLink to="/ai-reports" className={getNavLinkClass}>
              AI Reports
            </NavLink>
          </nav>
        </div>
        
        <div className="border-t border-[#232323] pt-4">
          <div className="text-xs text-zinc-400 mb-2">@{user?.username || "user"}</div>
          <button onClick={handleSignOut} className="text-xs text-[#D97706] hover:underline text-left w-full">
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Feature Content Frame */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}