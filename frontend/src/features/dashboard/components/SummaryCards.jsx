export default function SummaryCards({
activeProjectsCount,
openTasksCount,
}) {
return ( <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

  {/* Active Projects */}
  <div className="p-5 bg-[#111111] border border-[#232323] rounded-lg">
    <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
      Active Projects
    </div>

    <div className="text-3xl font-bold mt-2 font-mono text-white">
      {activeProjectsCount}
    </div>

    <div className="text-xs text-zinc-400 mt-1">
      Projects currently in development
    </div>
  </div>

  {/* Open Tasks */}
  <div className="p-5 bg-[#111111] border border-[#232323] rounded-lg">
    <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
      Open Tasks
    </div>

    <div className="text-3xl font-bold mt-2 font-mono text-white">
      {openTasksCount}
    </div>

    <div className="text-xs text-amber-500 font-medium mt-1">
      Tasks awaiting completion
    </div>
  </div>

  {/* Project Health */}
  <div className="p-5 bg-[#111111] border border-[#232323] rounded-lg">
    <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
      Project Health
    </div>

    <div className="text-3xl font-bold mt-2 font-mono text-emerald-500">
      88%
    </div>

    <div className="text-xs text-zinc-400 mt-1">
      Overall project readiness
    </div>
  </div>

  {/* Upcoming Deadline */}
  <div className="p-5 bg-[#111111] border border-[#232323] rounded-lg">
    <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
      Upcoming Deadline
    </div>

    <div className="text-3xl font-bold mt-2 font-mono text-white">
      Jun 28
    </div>

    <div className="text-xs text-zinc-400 mt-1">
      Project Jam Final Submission
    </div>
  </div>

</div>


);
}
