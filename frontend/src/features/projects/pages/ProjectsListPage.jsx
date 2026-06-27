import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectsListPage() {
  const navigate = useNavigate();

  // Mocking active project database registry rows
  const [projects] = useState([
    {
      id: 1,
      title: "Smart Campus Optimizer",
      description: "Real-time tracking of classroom and laboratory occupancy metrics using coordinate-cached sensory endpoints to prevent over-allocation.",
      timeline_weeks: 12,
      progress: 65,
      health: "88%",
      status: { validation: true, team: true, scope: true, pitch: false }
    },
    {
      id: 2,
      title: "Secure Distributed Vault",
      description: "Asynchronous decentralized secret store utilizing multi-tenant hardware security modules and transient key rotation rings.",
      timeline_weeks: 8,
      progress: 20,
      health: "94%",
      status: { validation: true, team: false, scope: false, pitch: false }
    }
  ]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      {/* Upper Registry Management Header */}
      <div className="pb-4 border-b border-[#232323] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Project Registries</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Initialize, track, and manage specialized project architectures across development pipelines.
          </p>
        </div>
        <button
          onClick={() => navigate("/projects/new")} // Assuming step 1 form path
          className="px-4 py-2 bg-[#D97706] text-black font-semibold font-mono text-xs rounded hover:bg-[#b56205] transition-all self-start sm:self-center shadow-md"
        >
          + Create Project
        </button>
      </div>

      {/* Grid of Dynamic System Registries */}
      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <div 
            key={project.id}
            className="p-5 bg-[#111111] border border-[#232323] rounded-xl hover:border-zinc-800 transition-all space-y-4"
          >
            {/* Header Matrix details */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-zinc-100">{project.title}</h3>
                  <span className="text-[10px] font-mono bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800">
                    ID: ref_0{project.id}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 max-w-3xl leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="flex items-center gap-4 font-mono text-xs self-start sm:self-auto bg-[#151515] p-2 rounded border border-[#1c1c1c]">
                <div className="text-center px-2">
                  <span className="block text-[10px] text-zinc-500 uppercase">Horizon</span>
                  <span className="text-[#D97706] font-bold">{project.timeline_weeks}w</span>
                </div>
                <div className="border-l border-zinc-800 h-6" />
                <div className="text-center px-2">
                  <span className="block text-[10px] text-zinc-500 uppercase">Health</span>
                  <span className="text-emerald-400 font-bold">{project.health}</span>
                </div>
              </div>
            </div>

            {/* Central Structural Progress Tracker */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>Core Engineering Execution</span>
                <span className="text-zinc-300 font-bold">{project.progress}%</span>
              </div>
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-950">
                <div 
                  className="bg-[#D97706] h-full transition-all duration-500" 
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Dynamic Status Badges and Quick Navigation Routing */}
            <div className="pt-2 border-t border-[#1a1a1a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                <span className={`px-2.5 py-0.5 rounded border ${
                  project.status.validation 
                    ? "bg-emerald-950/10 text-emerald-400 border-emerald-950" 
                    : "bg-zinc-900/50 text-zinc-600 border-zinc-900"
                }`}>
                  {project.status.validation ? "✓ Idea Validated" : "○ Unverified"}
                </span>
                <span className={`px-2.5 py-0.5 rounded border ${
                  project.status.team 
                    ? "bg-emerald-950/10 text-emerald-400 border-emerald-950" 
                    : "bg-zinc-900/50 text-zinc-600 border-zinc-900"
                }`}>
                  {project.status.team ? "✓ Roles Assigned" : "○ Pending Roster"}
                </span>
                <span className={`px-2.5 py-0.5 rounded border ${
                  project.status.scope 
                    ? "bg-emerald-950/10 text-emerald-400 border-emerald-950" 
                    : "bg-zinc-900/50 text-zinc-600 border-zinc-900"
                }`}>
                  {project.status.scope ? "✓ Scope Approved" : "○ Pending Core"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/validation/${project.id}`)}
                  className="px-3 py-1.5 text-[11px] font-mono bg-zinc-900 text-zinc-300 rounded border border-zinc-800 hover:bg-zinc-800 transition-all"
                >
                  Diagnostics
                </button>
                <button
                  onClick={() => navigate(`/team-analysis/${project.id}`)}
                  className="px-3 py-1.5 text-[11px] font-mono bg-[#D97706]/10 text-[#D97706] rounded border border-[#D97706]/20 hover:bg-[#D97706]/20 transition-all"
                >
                  Manage Roster →
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}