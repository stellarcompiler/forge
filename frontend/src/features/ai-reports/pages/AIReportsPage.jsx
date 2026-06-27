import { useState } from "react";

export default function AIReportsPage() {
  // Mock data for AI-generated analytical report artifacts
  const [reports] = useState([
    {
      id: "rep-0881",
      projectTitle: "Smart Campus Optimizer",
      type: "Architectural Deep-Dive",
      engine: "DeepSeek-R1",
      generatedAt: "2026-06-25",
      summary: "Comprehensive network topology modeling. Analyzes data serialization bounds, edge caching optimizations, and mitigation strategies for websocket message bursts.",
      status: "Verified",
    },
    {
      id: "rep-0742",
      projectTitle: "Smart Campus Optimizer",
      type: "Risk & Mitigation Matrix",
      engine: "Llama 3.1 70B",
      generatedAt: "2026-06-26",
      summary: "Evaluates physical sensor coordinate tamper vectors and outlines fallback logic loops for nodes registering zero-occupancy due to edge drops.",
      status: "Draft",
    }
  ]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      {/* Upper Context Header */}
      <div className="pb-4 border-b border-[#232323] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">AI Analytical Reports</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Generate, review, and export structural system risk modeling, scalability reviews, and edge mitigation summaries.
          </p>
        </div>
        <button 
          className="px-4 py-2 bg-zinc-900 text-zinc-300 font-semibold font-mono text-xs rounded border border-zinc-800 hover:bg-zinc-800 transition-all self-start sm:self-center"
          onClick={() => alert("Initializing full workspace compilation payload...")}
        >
          ⚙️ Run Batch Evaluation
        </button>
      </div>

      {/* Reports Pipeline List Container */}
      <div className="grid grid-cols-1 gap-4">
        {reports.map((report) => (
          <div 
            key={report.id}
            className="p-5 bg-[#111111] border border-[#232323] rounded-xl space-y-4 hover:border-zinc-800 transition-all"
          >
            {/* Top Meta Attributes Grid */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-[#1c1c1c] pb-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#D97706]">
                    {report.type}
                  </span>
                  <span className="text-[10px] text-zinc-600 font-mono">•</span>
                  <span className="text-xs font-semibold text-zinc-200">
                    {report.projectTitle}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500 font-mono">
                  Artifact Ref: <span className="text-zinc-400">{report.id}</span> | Compiled: <span className="text-zinc-400">{report.generatedAt}</span>
                </div>
              </div>

              {/* Status Flag and Engine Node */}
              <div className="flex items-center gap-2 font-mono text-[10px] self-start sm:self-auto">
                <span className="bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800">
                  {report.engine}
                </span>
                <span className={`px-2 py-0.5 rounded border ${
                  report.status === "Verified"
                    ? "bg-emerald-950/10 text-emerald-400 border-emerald-950"
                    : "bg-amber-950/10 text-amber-500 border-amber-950"
                }`}>
                  {report.status}
                </span>
              </div>
            </div>

            {/* Document Core Summary Block */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500">
                Executive Synthesis Summary
              </h4>
              <p className="text-sm text-zinc-400 leading-relaxed font-sans bg-[#151515] p-3.5 rounded border border-[#1b1b1b]">
                {report.summary}
              </p>
            </div>

            {/* Component Layout Action Interface */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button 
                className="px-3 py-1.5 text-[11px] font-mono bg-zinc-900 text-zinc-400 hover:text-zinc-200 rounded border border-zinc-800 transition-all"
                onClick={() => alert(`Streaming raw JSON tokens for ${report.id}`)}
              >
                Inspect Source JSON
              </button>
              <button 
                className="px-3 py-1.5 text-[11px] font-mono bg-[#D97706]/10 text-[#D97706] hover:bg-[#D97706]/20 rounded border border-[#D97706]/20 transition-all"
                onClick={() => alert(`Rendering complete markdown viewport for report ${report.id}`)}
              >
                Open Document Layout →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}