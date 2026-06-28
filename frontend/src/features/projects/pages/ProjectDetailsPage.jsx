import { useParams, useNavigate } from "react-router-dom";

export default function ProjectDetailsPage() {
const { projectId } = useParams();
const navigate = useNavigate();

// Mocked ProjectResponse
const project = {
id: Number(projectId),
title: "Forge",
description:
"An AI-powered project mentor designed to help student teams validate ideas, manage projects, and improve collaboration.",
idea:
"A platform that assists student teams with idea validation, team analysis, roadmap generation, task tracking, and project presentation preparation.",
timeline_weeks: 12,
status: "active",
created_by: 1,
created_at: "2026-06-20T10:00:00",
updated_at: "2026-06-27T15:30:00",
};

const formatDate = (dateString) =>
new Date(dateString).toLocaleString();

return ( <div className="max-w-5xl mx-auto space-y-8">
{/* Header */} <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#232323] pb-4"> <div> <h1 className="text-3xl font-bold text-white">
{project.title} </h1>

```
      <p className="text-zinc-400 mt-2">
        Project ID: {project.id}
      </p>
    </div>

    <button
      onClick={() => navigate("/projects")}
      className="px-4 py-2 border border-[#232323] rounded-lg text-zinc-300 hover:text-white hover:border-zinc-600 transition"
    >
      ← Back to Projects
    </button>
  </div>

  {/* Overview */}
  <div className="bg-[#111111] border border-[#232323] rounded-xl p-6">
    <h2 className="text-xl font-semibold text-white mb-4">
      Project Overview
    </h2>

    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase text-zinc-500">
          Description
        </p>

        <p className="text-zinc-300 mt-2">
          {project.description}
        </p>
      </div>

      <div>
        <p className="text-xs uppercase text-zinc-500">
          Startup Idea
        </p>

        <p className="text-zinc-300 mt-2">
          {project.idea}
        </p>
      </div>
    </div>
  </div>

  {/* Metadata */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div className="bg-[#111111] border border-[#232323] rounded-xl p-5">
      <p className="text-xs uppercase text-zinc-500">
        Status
      </p>

      <p className="text-lg font-semibold text-[#D97706] mt-2">
        {project.status}
      </p>
    </div>

    <div className="bg-[#111111] border border-[#232323] rounded-xl p-5">
      <p className="text-xs uppercase text-zinc-500">
        Timeline
      </p>

      <p className="text-lg font-semibold text-white mt-2">
        {project.timeline_weeks} Weeks
      </p>
    </div>

    <div className="bg-[#111111] border border-[#232323] rounded-xl p-5">
      <p className="text-xs uppercase text-zinc-500">
        Created By
      </p>

      <p className="text-lg font-semibold text-white mt-2">
        User #{project.created_by}
      </p>
    </div>

    <div className="bg-[#111111] border border-[#232323] rounded-xl p-5">
      <p className="text-xs uppercase text-zinc-500">
        Project ID
      </p>

      <p className="text-lg font-semibold text-white mt-2">
        {project.id}
      </p>
    </div>
  </div>

  {/* Dates */}
  <div className="bg-[#111111] border border-[#232323] rounded-xl p-6">
    <h2 className="text-xl font-semibold text-white mb-4">
      Activity Information
    </h2>

    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <p className="text-xs uppercase text-zinc-500">
          Created At
        </p>

        <p className="text-zinc-300 mt-2">
          {formatDate(project.created_at)}
        </p>
      </div>

      <div>
        <p className="text-xs uppercase text-zinc-500">
          Last Updated
        </p>

        <p className="text-zinc-300 mt-2">
          {formatDate(project.updated_at)}
        </p>
      </div>
    </div>
  </div>

  {/* Actions */}
  <div className="bg-[#111111] border border-[#232323] rounded-xl p-6">
    <h2 className="text-xl font-semibold text-white mb-4">
      Project Actions
    </h2>

    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => navigate(`/validation/${project.id}`)}
        className="px-4 py-2 bg-[#D97706] text-black rounded-lg font-medium hover:bg-[#b56205]"
      >
        Validate Idea
      </button>

      <button
        onClick={() => navigate(`/team-analysis/${project.id}`)}
        className="px-4 py-2 border border-[#232323] rounded-lg text-zinc-300 hover:text-white hover:border-zinc-600"
      >
        Team Analysis
      </button>

      <button
        onClick={() => navigate(`/tasks/${project.id}`)}
        className="px-4 py-2 border border-[#232323] rounded-lg text-zinc-300 hover:text-white hover:border-zinc-600"
      >
        Manage Tasks
      </button>
    </div>
  </div>
</div>


);
}
