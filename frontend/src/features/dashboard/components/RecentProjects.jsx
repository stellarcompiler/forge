export default function RecentProjects({ projects }) {
return ( <div className="space-y-4">
{projects.map((project) => ( <div
       key={project.id}
       className="p-6 bg-[#111111] border border-[#232323] hover:border-zinc-700 transition-all rounded-xl space-y-6"
     >
{/* Project Header */} <div className="flex items-start justify-between"> <div> <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-amber-500/10 text-[#D97706] border border-amber-500/20">
{project.status} </span>

          <h3 className="text-xl font-bold mt-2 text-zinc-100">
            {project.title}
          </h3>

          <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
            {project.description}
          </p>
        </div>

        <div className="text-right text-xs font-mono text-zinc-500">
          Timeline:
          <span className="text-zinc-300 ml-1">
            {project.timeline_weeks} Weeks
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-zinc-500">
            Project Progress
          </span>

          <span className="text-zinc-300">
            {project.completion}%
          </span>
        </div>

        <div className="w-full bg-[#1c1c1c] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#D97706] h-full transition-all duration-500"
            style={{ width: `${project.completion}%` }}
          />
        </div>
      </div>

      {/* Project Status */}
      <div className="border-t border-[#1c1c1c] pt-4">
        <div className="text-xs font-mono text-zinc-500 mb-3">
          Project Status
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
          <div
            className={`p-2 rounded border ${
              project.validated
                ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/30"
                : "bg-[#151515] text-zinc-600 border-[#232323]"
            }`}
          >
            ✓ Idea Validated
          </div>

          <div
            className={`p-2 rounded border ${
              project.validated
                ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/30"
                : "bg-[#151515] text-zinc-600 border-[#232323]"
            }`}
          >
            ✓ Roles Assigned
          </div>

          <div
            className={`p-2 rounded border ${
              project.scope_checked
                ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/30"
                : "bg-[#151515] text-zinc-600 border-[#232323]"
            }`}
          >
            ✓ Scope Approved
          </div>

          <div
            className={`p-2 rounded border ${
              project.pitch_ready
                ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/30"
                : "bg-[#151515] text-zinc-600 border-[#232323]"
            }`}
          >
            ◷ Pitch Pending
          </div>
        </div>
      </div>
    </div>
  ))}
</div>


);
}
