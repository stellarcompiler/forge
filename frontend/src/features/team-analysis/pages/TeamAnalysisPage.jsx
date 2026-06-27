import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function TeamAnalysisPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // Mocking the team roster data passed or fetched from project_members table
  const [roster] = useState([
    { id: 1, email: "harish@forge.edu", skills: "FastAPI, PostgreSQL, AsyncIO, Docker, Python Linux scripts" },
    { id: 2, email: "alex@forge.edu", skills: "React, TailwindCSS, Redux Toolkit, Framer Motion, Figma designs" },
    { id: 3, email: "rahul@forge.edu", skills: "PyTorch, HuggingFace Transformers, LangChain, Core AI prompt engineering" }
  ]);

  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const triggerTeamAnalysis = () => {
    setIsAnalyzing(true);
    
    // Simulating Llama 3 semantic processing delays
    setTimeout(() => {
      setAnalysis({
        assignments: [
          { email: "harish@forge.edu", role: "Backend Systems Architect", reasoning: "Deep knowledge in asynchronous Python architectures and relation caching structures." },
          { email: "alex@forge.edu", role: "Frontend UI/UX Engineer", reasoning: "Strong grasp over Tailwind layout matrices and responsive modern web viewport hooks." },
          { email: "rahul@forge.edu", role: "AI Pipeline Engineer", reasoning: "Demonstrated technical proficiency in token streaming and LLM orchestration wrappers." }
        ],
        workloadBalance: "Optimal (3 Nodes Distributed)",
        riskAssessment: "Low risk. Stack coverage is 100% compliant with project initialization criteria. Recommendation: Set up strict type-safety boundaries between frontend and backend models early."
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Header Context */}
      <div className="pb-4 border-b border-[#232323] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">AI Team Analysis Engine</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Map developer skill competencies to structural project dependencies using semantic weight evaluations.
          </p>
        </div>
        <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800 self-start sm:self-center">
          Context ID: project_ref_{projectId || 1}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Input Roster Nodes Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-4 bg-[#111111] border border-[#232323] rounded-xl space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">Target Developer Roster</h3>
            
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {roster.map((member) => (
                <div key={member.id} className="p-3 bg-[#151515] border border-[#1c1c1c] rounded-lg font-mono text-[11px] space-y-1">
                  <div className="text-zinc-300 font-bold truncate">{member.email}</div>
                  <div className="text-zinc-500 leading-relaxed">
                    Skills: <span className="text-zinc-400">{member.skills}</span>
                  </div>
                </div>
              ))}
            </div>

            {!analysis && !isAnalyzing && (
              <button
                onClick={triggerTeamAnalysis}
                className="w-full py-2.5 bg-[#D97706] text-black font-semibold font-mono text-xs rounded-md hover:bg-[#b56205] transition-all"
              >
                Compute Optimal Roles →
              </button>
            )}
          </div>
        </div>

        {/* Right Column: AI Analysis Output Processing Unit */}
        <div className="lg:col-span-2">
          {/* Default Neutral Placeholder state */}
          {!isAnalyzing && !analysis && (
            <div className="h-full min-h-[300px] border border-dashed border-[#232323] bg-[#111111]/30 rounded-xl flex flex-col items-center justify-center text-center p-6 space-y-2">
              <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">Awaiting Role Diagnostics Execution</span>
              <p className="text-xs text-zinc-500 max-w-xs font-sans">
                Click compute to push your team's capability metrics into Llama 3 for pipeline engineering synthesis.
              </p>
            </div>
          )}

          {/* Loading Console Frame */}
          {isAnalyzing && (
            <div className="p-6 bg-black border border-amber-500/20 rounded-xl font-mono text-xs text-amber-500 space-y-3 shadow-2xl shadow-amber-950/5">
              <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                <span className="w-2 h-2 rounded-full bg-red-500/50" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <span className="w-2 h-2 rounded-full bg-green-500/50" />
                <span className="text-[10px] text-zinc-600 ml-2">llama3-role-parser.sh</span>
              </div>
              <div className="space-y-1 animate-pulse">
                <p>&gt; Reading active project scope vectors...</p>
                <p>&gt; Parsing {roster.length} team identity skill profiles...</p>
                <p>&gt; Matrix balancing roles allocation arrays...</p>
              </div>
            </div>
          )}

          {/* Rendered Diagnostic Layout Result */}
          {analysis && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-5 bg-[#111111] border border-[#232323] rounded-xl space-y-4">
                
                <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-3">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-amber-500">
                    Structural Role Allocations
                  </h3>
                  <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                    Distribution: {analysis.workloadBalance}
                  </span>
                </div>

                {/* Grid list of dynamic responsibilities */}
                <div className="space-y-3">
                  {analysis.assignments.map((node, index) => (
                    <div key={index} className="p-4 bg-[#151515] border border-[#1c1c1c] rounded-lg space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-xs font-mono font-bold text-zinc-200">{node.email}</span>
                        <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/30 w-fit">
                          ⚙️ {node.role}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">{node.reasoning}</p>
                    </div>
                  ))}
                </div>

                {/* Risk assessment alert container */}
                <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg space-y-1 font-sans text-xs">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                    Risk Assessment & Architectural Advice
                  </div>
                  <p className="text-zinc-400 leading-relaxed">{analysis.riskAssessment}</p>
                </div>

              </div>

              {/* Sequential Flow Footer to Task Matrix */}
              <div className="flex items-center justify-end pt-2">
                <button
                  onClick={() => navigate("/tasks")}
                  className="px-6 py-2.5 text-xs font-mono font-semibold bg-[#D97706] text-black rounded hover:bg-[#b56205] transition-all shadow-lg shadow-amber-500/5 flex items-center gap-2"
                >
                  Proceed to Sprint Task Matrix →
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}