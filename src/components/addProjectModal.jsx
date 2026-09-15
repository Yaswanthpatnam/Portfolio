import React, { useState } from "react";
import { X, Plus, Sparkles, Check, AlertCircle, Copy, ExternalLink } from "lucide-react";
import { GithubIcon } from "./icons";

const AddProjectModal = ({ isOpen, onClose, onProjectAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "fullstack",
    stack: "",
    github: "",
    live: "",
    highlights: "",
    featured: false,
  });

  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const constructProjectObject = () => {
    const categoryLabels = {
      fullstack: "Full-Stack",
      frontend: "Frontend",
      backend: "Backend & API",
    };

    const id = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || `project-${Date.now()}`;

    const stackArray = formData.stack
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const highlightsArray = formData.highlights
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    return {
      id,
      title: formData.title || "Untitled Project",
      subtitle: formData.subtitle || `${categoryLabels[formData.category] || "Full-Stack"} Project`,
      description: formData.description || "Project summary coming soon.",
      category: formData.category,
      categoryLabel: categoryLabels[formData.category] || "Full-Stack",
      stack: stackArray.length > 0 ? stackArray : ["JavaScript"],
      status: "Live",
      statusColor: "#83CE7E",
      github: formData.github,
      live: formData.live,
      featured: formData.featured,
      highlights: highlightsArray,
    };
  };

  const handleCopyJson = () => {
    const project = constructProjectObject();
    navigator.clipboard.writeText(JSON.stringify(project, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setStatusMessage({ type: "error", text: "Please provide a project title." });
      return;
    }

    const project = constructProjectObject();
    setSaving(true);
    setStatusMessage(null);

    try {
      // Attempt saving to local Vite dev server API
      const res = await fetch("/api/save-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });

      if (res.ok) {
        setStatusMessage({
          type: "success",
          text: `"${project.title}" saved successfully to src/data/projects.json!`,
        });
        if (onProjectAdded) onProjectAdded(project);
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1200);
      } else {
        throw new Error("Server endpoint not available in static preview.");
      }
    } catch (err) {
      // If deployed or dev server API is unavailable, fallback to copying JSON
      navigator.clipboard.writeText(JSON.stringify(project, null, 2));
      setStatusMessage({
        type: "info",
        text: "Project JSON copied to clipboard! You can paste it into src/data/projects.json or run `npm run add-project` in terminal.",
      });
    } finally {
      setSaving(false);
    }
  };

  const previewProject = constructProjectObject();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col rounded-3xl border border-white/20 bg-[#121216] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c8bd56]/20 text-[#c8bd56]">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-sansation text-lg font-bold text-white tracking-wide sm:text-xl">
                ADD NEW PROJECT
              </h3>
              <p className="font-albert text-xs text-white/60">
                Easily append a new showcase to your portfolio
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body: Form + Live Preview */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {statusMessage && (
            <div
              className={`flex items-center gap-2.5 rounded-xl p-3 text-sm font-medium ${
                statusMessage.type === "success"
                  ? "bg-[#83CE7E]/15 border border-[#83CE7E]/40 text-[#83CE7E]"
                  : statusMessage.type === "error"
                  ? "bg-red-500/15 border border-red-500/40 text-red-300"
                  : "bg-[#c8bd56]/15 border border-[#c8bd56]/40 text-[#c8bd56]"
              }`}
            >
              {statusMessage.type === "success" ? (
                <Check className="h-5 w-5 shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form id="project-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-albert text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. AI Code Reviewer"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white focus:border-[#c8bd56] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-albert text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  name="subtitle"
                  placeholder="e.g. Full-Stack Automated Git Reviewer"
                  value={formData.subtitle}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white focus:border-[#c8bd56] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-albert text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                rows="3"
                placeholder="Describe what the application does, problems it solved, and system architecture..."
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white focus:border-[#c8bd56] focus:outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-albert text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/15 bg-[#1a1a20] px-3.5 py-2 text-sm text-white focus:border-[#c8bd56] focus:outline-none"
                >
                  <option value="fullstack">Full-Stack</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend & API</option>
                </select>
              </div>

              <div>
                <label className="block font-albert text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                  Tech Stack (comma-separated)
                </label>
                <input
                  type="text"
                  name="stack"
                  placeholder="e.g. React, Django, PostgreSQL, Tailwind"
                  value={formData.stack}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white focus:border-[#c8bd56] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-albert text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  name="github"
                  placeholder="https://github.com/Yaswanthpatnam/..."
                  value={formData.github}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white focus:border-[#c8bd56] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-albert text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                  Live Preview / Demo URL
                </label>
                <input
                  type="url"
                  name="live"
                  placeholder="https://..."
                  value={formData.live}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white focus:border-[#c8bd56] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-albert text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                Key Engineering Highlights (comma-separated)
              </label>
              <input
                type="text"
                name="highlights"
                placeholder="e.g. Redis caching for 5x query speed, Docker containerization"
                value={formData.highlights}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white focus:border-[#c8bd56] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="h-4 w-4 rounded border-white/20 text-[#c8bd56] focus:ring-0"
              />
              <label htmlFor="featured" className="font-albert text-sm text-white/80 cursor-pointer">
                Mark as Featured Project
              </label>
            </div>
          </form>

          {/* Live Preview Section */}
          <div className="border-t border-white/10 pt-4">
            <p className="font-albert text-xs font-semibold uppercase tracking-wider text-[#c8bd56] mb-3">
              Card Live Preview:
            </p>
            <div className="rounded-2xl border border-white/15 bg-[#18181c] p-4 text-left">
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                <span className="badge-live text-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#83CE7E]" />
                  </span>
                  Live
                </span>
                <span className="text-xs text-white/60">{previewProject.categoryLabel}</span>
              </div>
              <h4 className="mt-2 font-albert text-base font-bold text-white">
                {previewProject.title}
              </h4>
              <p className="font-albert text-xs text-white/70 line-clamp-2 mt-1">
                {previewProject.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {previewProject.stack.map((t) => (
                  <span key={t} className="rounded bg-white/10 px-2 py-0.5 text-[11px] text-white">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-black/40 px-6 py-4">
          <button
            type="button"
            onClick={handleCopyJson}
            className="ghost-btn text-xs py-1.5 px-3"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-[#83CE7E]" />
                <span className="text-[#83CE7E]">JSON Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-[#c8bd56]" />
                <span>Copy JSON</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 font-albert text-xs sm:text-sm font-semibold text-white/70 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="project-form"
              disabled={saving}
              className="primary-btn text-xs sm:text-sm px-5 py-2"
            >
              {saving ? "Saving..." : "Save Project"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProjectModal;
