import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SummaryCards from "../components/SummaryCards";
import RecentProjects from "../components/RecentProjects";

export default function DashboardPage() {
  const navigate = useNavigate();

  const [activeProjects] = useState([
    {
      id: 1,
      title: "Forge",
      description:
        "An AI-powered project mentor that helps student teams validate ideas, assign roles, generate roadmaps, track progress, and prepare project presentations.",
      status: "In Progress",
      timeline_weeks: 4,
      completion: 65,
      tasks_open: 4,
      validated: true,
      scope_checked: true,
      pitch_ready: false,
    },
  ]);

  const totalOpenTasks = activeProjects.reduce(
    (acc, curr) => acc + curr.tasks_open,
    0
  );

  const handleGeneratePitchOutline = () => {
    navigate("/presentation", {
      state: {
        autoGenerate: true,
        projectTitle: activeProjects[0]?.title || "Forge",
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-[#232323]">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            Forge Workspace
          </h1>

          <p className="text-sm text-zinc-400 mt-1">
            Track project progress, manage tasks, and keep your team aligned.
          </p>
        </div>

        <button
          onClick={() => navigate("/projects/new")}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#D97706] text-black font-semibold text-sm rounded-md hover:bg-[#b56205] transition-all shadow-lg shadow-[#D97706]/10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Create Project
        </button>
      </div>

      <SummaryCards
        activeProjectsCount={activeProjects.length}
        openTasksCount={totalOpenTasks}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-sm font-mono text-zinc-400 uppercase tracking-widest">
            Recent Projects
          </h2>

          <RecentProjects projects={activeProjects} />
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-mono text-zinc-400 uppercase tracking-widest">
            Forge Mentor
          </h2>

          <div className="p-6 bg-[#111111] border border-dashed border-[#232323] rounded-xl space-y-4">
            <div className="flex items-center gap-2 text-amber-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>

              <span className="text-xs font-mono uppercase tracking-wider">
                Next Recommendation
              </span>
            </div>

            <h4 className="text-md font-bold text-zinc-200">
              Generate Project Pitch
            </h4>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Your project idea has been validated and your team structure is
              ready. Generate a presentation outline to prepare for reviews and
              final submissions.
            </p>

            <button
              onClick={handleGeneratePitchOutline}
              className="w-full py-2 bg-[#1c1c1c] hover:bg-[#252525] text-zinc-300 hover:text-white font-mono text-xs border border-[#232323] transition-all rounded-md"
            >
              Generate Pitch Outline -&gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
