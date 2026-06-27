import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ValidationScore from "../components/ValidationScore";
import ValidationReport from "../components/ValidationReport";

export default function IdeaValidationPage() {
  const { projectId } = useParams(); // Prepares engine for true database id linking
  const navigate = useNavigate();
  
  const [project] = useState({
    id: projectId || 1,
    title: "Smart Campus Optimizer",
    idea: "Real-time tracking of classroom and laboratory occupancy metrics using coordinate-cached sensory endpoints to prevent over-allocation.",
    timeline_weeks: 12,
  });

  const [validationResult, setValidationResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const triggerLlamaValidation = () => {
    setIsValidating(true);
    setTimeout(() => {
      setValidationResult({
        score: 88,
        feasibility: "Highly Viable",
        critique: "The core sensory framework is highly practical for a 12-week sprint cycle. However, cross-referencing live databases might hit network serialization limits if latency isn't throttled.",
        recommendations: [
          "Establish an MVP strictly around the computer lab tracking sub-nodes first.",
          "Use lightweight polling mechanisms over heavy raw WebSockets to stay within compute boundaries."
        ]
      });
      setIsValidating(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Context Top Header */}
      <div className="pb-4 border-b border-[#232323]">
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">AI Idea Validation Engine</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Evaluate project feasibility targets against timelines, parameters, and structural constraints.
        </p>
      </div>

      {/* Target Evaluation Scope Context Card */}
      <div className="p-5 bg-[#111111] border border-[#232323] rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Active Analysis Subject</span>
          <span className="text-xs font-mono text-[#D97706] bg-[#D97706]/10 px-2.5 py-0.5 rounded border border-[#D97706]/20">
            {project.timeline_weeks} Weeks Horizon
          </span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-zinc-200">{project.title}</h3>
          <p className="text-sm text-zinc-400 mt-2 font-mono leading-relaxed bg-[#151515] p-3 rounded border border-[#1c1c1c]">
            {project.idea}
          </p>
        </div>

        {!validationResult && !isValidating && (
          <button
            onClick={triggerLlamaValidation}
            className="w-full py-3 bg-[#D97706] text-black font-semibold font-mono text-xs rounded-md hover:bg-[#b56205] transition-all flex items-center justify-center gap-2"
          >
            Execute Llama 3 Feasibility Check →
          </button>
        )}
      </div>

      {/* Loading Vector Feedback */}
      {isValidating && (
        <div className="p-8 border border-dashed border-amber-500/20 bg-amber-500/[0.02] rounded-xl text-center space-y-3">
          <div className="w-6 h-6 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-amber-500 animate-pulse">
            Parsing textual tokens... Streaming weights evaluation through Groq API engine...
          </p>
        </div>
      )}

      {/* Structured Output Presentation Sheet using Clean Components */}
      {validationResult && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ValidationScore 
              score={validationResult.score} 
              feasibility={validationResult.feasibility} 
            />
            <div className="md:col-span-2">
              <ValidationReport 
                critique={validationResult.critique} 
                recommendations={validationResult.recommendations} 
              />
            </div>
          </div>

          {/* NEW STEP INTEGRATION: Flow Sequence Footer */}
          <div className="flex items-center justify-end pt-4 border-t border-[#1c1c1c]">
            <button
              onClick={() => navigate(`/team-analysis/${project.id}`)}
              className="px-6 py-2.5 text-xs font-mono font-semibold bg-[#D97706] text-black rounded hover:bg-[#b56205] transition-all shadow-lg shadow-amber-500/5 flex items-center gap-2"
            >
              Proceed to Team Role Allocation →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}