import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { generatePresentationPrepSummary } from "../services/presentationService";

function splitSections(text) {
  if (!text) {
    return [];
  }

  const sections = [];
  let currentSection = {
    title: "Pitch Outline",
    body: [],
  };

  text.split(/\r?\n/).forEach((line) => {
    const headingMatch = line.match(/^##\s+(?:\d+\.\s*)?(.+)$/);

    if (headingMatch) {
      if (currentSection.body.join("").trim()) {
        sections.push({
          title: currentSection.title,
          body: currentSection.body.join("\n").trim(),
        });
      }

      currentSection = {
        title: headingMatch[1].trim(),
        body: [],
      };
      return;
    }

    currentSection.body.push(line);
  });

  if (currentSection.body.join("").trim()) {
    sections.push({
      title: currentSection.title,
      body: currentSection.body.join("\n").trim(),
    });
  }

  return sections;
}

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${part}-${index}`} className="text-zinc-100">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part;
  });
}

function SectionBody({ body }) {
  return (
    <div className="space-y-2">
      {body.split(/\r?\n/).map((line, index) => {
        const trimmedLine = line.trim();

        if (!trimmedLine) {
          return <div key={`gap-${index}`} className="h-2" />;
        }

        if (/^[-*]\s+/.test(trimmedLine)) {
          return (
            <div
              key={`${trimmedLine}-${index}`}
              className="flex gap-3 text-sm leading-6 text-zinc-300"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D97706]" />
              <span>{renderInline(trimmedLine.replace(/^[-*]\s+/, ""))}</span>
            </div>
          );
        }

        if (/^\*\*.+\*\*$/.test(trimmedLine)) {
          return (
            <h4
              key={`${trimmedLine}-${index}`}
              className="pt-2 text-xs font-mono uppercase tracking-widest text-[#D97706]"
            >
              {trimmedLine.replaceAll("**", "")}
            </h4>
          );
        }

        return (
          <p
            key={`${trimmedLine}-${index}`}
            className="text-sm leading-6 text-zinc-300"
          >
            {renderInline(trimmedLine)}
          </p>
        );
      })}
    </div>
  );
}

export default function PresentationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasRequestedRef = useRef(false);

  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(Boolean(location.state?.autoGenerate));
  const [error, setError] = useState("");

  const sections = splitSections(aiResult?.text || "");

  const generateOutline = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await generatePresentationPrepSummary();
      setAiResult(result);
    } catch (err) {
      setError(err.message || "Unable to generate pitch outline");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!location.state?.autoGenerate || hasRequestedRef.current) {
      return;
    }

    hasRequestedRef.current = true;
    generateOutline();
  }, [location.state?.autoGenerate]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 border-b border-[#232323] pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-[#D97706]">
            Presentation Studio
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-100">
            {location.state?.projectTitle || "Forge"} Pitch Outline
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Review the generated prep summary before converting it into a deck
            or speaker notes.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-md border border-[#232323] px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
          >
            Back to Workspace
          </button>
          <button
            type="button"
            onClick={generateOutline}
            disabled={loading}
            className="rounded-md bg-[#D97706] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#b56205] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Generating..." : "Regenerate"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="rounded-xl border border-dashed border-[#232323] bg-[#111111] p-8">
          <div className="flex items-center gap-3 text-[#D97706]">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500" />
            </span>
            <span className="font-mono text-xs uppercase tracking-widest">
              Gemini is preparing your pitch outline
            </span>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
            Hold tight while Forge generates the presentation prep summary.
            The outline will appear here automatically when the backend returns
            the parsed AI response.
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-900 bg-red-950/20 p-5 text-sm text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && !aiResult && (
        <div className="rounded-xl border border-[#232323] bg-[#111111] p-8">
          <h2 className="text-lg font-semibold text-zinc-100">
            No outline generated yet
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Start generation from the dashboard or use the regenerate button.
          </p>
        </div>
      )}

      {aiResult && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            {sections.map((section) => (
              <section
                key={section.title}
                className="rounded-xl border border-[#232323] bg-[#111111] p-6"
              >
                <h2 className="text-lg font-semibold text-zinc-100">
                  {section.title}
                </h2>
                <div className="mt-4">
                  <SectionBody body={section.body} />
                </div>
              </section>
            ))}
          </div>

          <aside className="h-fit rounded-xl border border-[#232323] bg-[#111111] p-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500">
              AI Metadata
            </h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-zinc-500">Provider</dt>
                <dd className="text-zinc-200">{aiResult.provider}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Model</dt>
                <dd className="break-words text-zinc-200">{aiResult.model}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Finish reason</dt>
                <dd className="text-zinc-200">{aiResult.finish_reason}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Tokens</dt>
                <dd className="text-zinc-200">
                  {aiResult.tokens?.total ?? 0} total
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      )}
    </div>
  );
}
