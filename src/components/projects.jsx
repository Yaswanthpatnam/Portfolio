import React, { useState } from "react";
import { ExternalLink, Sparkles, ArrowUpRight, Plus } from "lucide-react";
import { GithubIcon } from "./icons";
import { projects as initialProjects, projectCategories } from "../data/projects";
import AddProjectModal from "./addProjectModal";

const Projects = () => {
  const [projectList, setProjectList] = useState(initialProjects);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredProjects =
    activeCategory === "all"
      ? projectList
      : projectList.filter((p) => p.category === activeCategory);

  const handleProjectAdded = (newProject) => {
    setProjectList((prev) => [newProject, ...prev]);
  };

  return (
    <section id="projects" className="panel p-6 sm:p-8 md:p-10 lg:p-12">
      <div className="space-y-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
              <span className="font-albert text-xs sm:text-sm font-semibold tracking-widest uppercase text-[var(--accent)]">
                03 // Selected Works
              </span>
            </div>
            <h2 className="font-sansation text-2xl font-bold tracking-[0.1em] text-[var(--text-primary)] sm:text-3xl lg:text-4xl">
              FEATURED PROJECTS
            </h2>
            <p className="max-w-xl font-albert text-base text-[color:var(--text-muted)]">
              Production-grade web apps, tools, and platforms engineered with performance, scalability, and clean user experience in mind.
            </p>
          </div>

          {/* Action Row: Category Filters + Add Project Button */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2 rounded-full border border-[var(--panel-border)] bg-[var(--pill-bg)] p-1.5 self-start md:self-auto">
              {projectCategories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`rounded-full px-4 py-1.5 font-albert text-xs sm:text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-[var(--accent)] text-black shadow-md shadow-[#c8bd56]/20"
                        : "text-[color:var(--text-muted)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* In-app + Add Project Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)] bg-[var(--accent)]/10 px-4 py-2 font-albert text-xs sm:text-sm font-semibold text-[var(--accent)] transition-all hover:bg-[var(--accent)] hover:text-black hover:shadow-glow-gold"
              title="Add a new project to your portfolio"
            >
              <Plus className="h-4 w-4" />
              <span>Add Project</span>
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-6 lg:gap-8">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className={`group relative overflow-hidden rounded-3xl border border-[var(--panel-border)] bg-[var(--card-bg)] p-6 transition-all duration-300 hover:border-[var(--accent)] hover:shadow-card-hover sm:p-8 ${
                project.featured ? "ring-1 ring-[var(--accent)]/30" : ""
              }`}
            >
              {/* Subtle accent line on top */}
              <div
                className="absolute inset-x-0 top-0 h-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #c8bd56, transparent)",
                }}
              />

              <div className="flex flex-col gap-5">
                {/* Card Header: Meta Badges + Links */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--panel-border)] pb-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Status badge */}
                    <span className="badge-live">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#83CE7E] opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#83CE7E]"></span>
                      </span>
                      {project.status}
                    </span>

                    {/* Category badge */}
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-albert text-xs font-medium text-[color:var(--text-muted)]">
                      {project.categoryLabel}
                    </span>

                    {project.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#c8bd56]/15 px-2.5 py-0.5 text-xs font-semibold text-[#c8bd56]">
                        <Sparkles className="h-3 w-3" />
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2.5">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ghost-btn px-3.5 py-1.5 text-xs sm:text-sm"
                        aria-label={`View ${project.title} on GitHub`}
                      >
                        <GithubIcon className="h-4 w-4" />
                        <span>Code</span>
                      </a>
                    )}

                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#c8bd56] px-4 py-1.5 text-xs sm:text-sm font-semibold text-black transition-all hover:brightness-110 hover:shadow-md hover:shadow-[#c8bd56]/30"
                        aria-label={`Open live demo of ${project.title}`}
                      >
                        <span>Live Demo</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="font-albert text-xl font-bold tracking-wide text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)] sm:text-2xl">
                    {project.title}
                  </h3>
                  {project.subtitle && (
                    <p className="mt-1 font-albert text-sm font-medium text-[var(--accent)]">
                      {project.subtitle}
                    </p>
                  )}
                </div>

                {/* Description */}
                <p className="font-albert text-base leading-relaxed text-[color:var(--text-muted)] sm:text-lg">
                  {project.description}
                </p>

                {/* Highlights (if any) */}
                {project.highlights && project.highlights.length > 0 && (
                  <div className="rounded-xl border border-white/5 bg-black/20 p-4">
                    <p className="font-albert text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                      Key Engineering Highlights
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {project.highlights.map((highlight, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 font-albert text-xs sm:text-sm text-[color:var(--text-muted)]"
                        >
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8bd56]" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="font-albert text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)] mr-1">
                    Tech:
                  </span>
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-albert text-xs font-medium text-[var(--text-primary)] transition-colors group-hover:border-[#c8bd56]/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* In-app Project Manager Modal */}
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProjectAdded={handleProjectAdded}
      />
    </section>
  );
};

export default Projects;
