import React, { useState, useEffect } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { GithubIcon } from "./icons";
import localProjects from "../data/projects.json";

// Blacklist of test, duplicate, or unwanted repo names
const EXCLUDED_REPOS = [
  "lost_and_found",
  "lost_-_found",
  "port",
  "stock",
  "story",
  "yaswanthbabu-",
  "flask-react-template",
  "portfolio",
  "smart_attendance_management",
  "smart-attendance-management",
  "smart_attendance",
  "smart-attendance",
  "smartattendancemanagement",
];

const normalizeSlug = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

export const Projects = () => {
  const [projectsList, setProjectsList] = useState(localProjects);
  const [activeTab, setActiveTab] = useState("personal");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const processRepos = (repos) => {
      // Slugs already present in local database to avoid duplicates
      const localSlugs = new Set(
        localProjects
          .flatMap((p) => [
            normalizeSlug(p.id),
            normalizeSlug(p.title),
            p.github ? normalizeSlug(p.github.split("/").pop()) : null,
          ])
          .filter(Boolean)
      );

      // Ingest new repos tagged with 'portfolio', 'freelance', or 'client'
      const githubDiscovered = repos
        .filter((repo) => {
          if (repo.fork) return false;
          const nameLower = repo.name.toLowerCase();
          const normName = normalizeSlug(repo.name);
          if (EXCLUDED_REPOS.includes(nameLower) || EXCLUDED_REPOS.includes(normName)) return false;
          if (localSlugs.has(normName)) return false; // Prevent duplicates of local entries
          return (
            repo.topics &&
            (repo.topics.includes("portfolio") ||
              repo.topics.includes("freelance") ||
              repo.topics.includes("client"))
          );
        })
        .map((repo) => {
          const isFreelance =
            repo.topics &&
            (repo.topics.includes("freelance") || repo.topics.includes("client"));

          const topicsStack =
            repo.topics && repo.topics.length > 0
              ? repo.topics
                  .filter((t) => !["portfolio", "freelance", "client"].includes(t))
                  .slice(0, 4)
              : repo.language
              ? [repo.language]
              : ["Software"];

          return {
            id: repo.name.toLowerCase(),
            type: isFreelance ? "freelance" : "personal",
            title: repo.name.replace(/[-_]/g, " "),
            subtitle:
              repo.description ||
              (isFreelance ? "Client & Freelance Project" : "Automated GitHub Project"),
            description:
              repo.description ||
              `Continuously integrated project repository tagged with #${
                isFreelance ? "freelance" : "portfolio"
              } on GitHub.`,
            stack: topicsStack,
            status: repo.homepage ? "Live" : "Deployed",
            github: isFreelance ? "" : repo.html_url,
            live: repo.homepage || null,
            year: new Date(repo.updated_at || Date.now()).getFullYear(),
            thumbnail: null,
            isAutomated: true,
          };
        });

      if (isMounted) {
        // Merge without duplicating any local project
        const discoveredIds = new Set(githubDiscovered.map((p) => normalizeSlug(p.id)));
        const cleanLocal = localProjects.filter((p) => !discoveredIds.has(normalizeSlug(p.id)));
        setProjectsList([...githubDiscovered, ...cleanLocal]);
      }
    };

    // 1. Instant hydration from sessionStorage cache if available
    try {
      const cached = sessionStorage.getItem("portfolio_github_repos");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) processRepos(parsed);
      }
    } catch {}

    const fetchGithubProjects = async () => {
      try {
        const res = await fetch(
          "https://api.github.com/users/Yaswanthpatnam/repos?sort=updated&per_page=50",
          { headers: { Accept: "application/vnd.github.v3+json" } }
        );

        if (!res.ok) return;
        const repos = await res.json();

        if (Array.isArray(repos) && isMounted) {
          try {
            sessionStorage.setItem("portfolio_github_repos", JSON.stringify(repos));
          } catch {}
          processRepos(repos);
        }
      } catch (err) {
        console.warn("GitHub dynamic project ingestion fallback:", err);
      }
    };

    fetchGithubProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleProject = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const personalCount = projectsList.filter(
    (p) => (p.type || "personal") === "personal"
  ).length;
  const freelanceCount = projectsList.filter((p) => p.type === "freelance").length;

  const displayedProjects = projectsList.filter(
    (p) => (p.type || "personal") === activeTab
  );

  return (
    <section id="projects" className="relative z-10 space-y-4 pt-2">
      {/* Section Header with Ultra-Smooth Sliding Segmented Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-3.5">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="font-mono text-xs text-zinc-500 shrink-0 font-medium">[01]</span>
          
          {/* Ultra-Cool Sliding Segmented Pill */}
          <div className="relative inline-flex p-1 rounded-xl bg-zinc-900/90 border border-zinc-700/60 shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)] backdrop-blur-md">
            
            {/* Smooth Sliding Background Pill with Glow and Specular Line */}
            <div
              className={`absolute top-1 bottom-1 rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 border border-white/15 shadow-[0_2px_10px_rgba(0,0,0,0.5)] pointer-events-none transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                activeTab === "personal"
                  ? "left-1 w-[calc(50%-4px)] translate-x-0"
                  : "left-1 w-[calc(50%-4px)] translate-x-full"
              }`}
            >
              <div className="absolute inset-x-2 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            {/* Tab 1: Personal */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("personal");
                setExpandedId(null);
              }}
              className={`relative z-10 px-3 sm:px-4 py-1.5 rounded-lg font-mono text-[11px] sm:text-xs font-medium transition-colors duration-200 cursor-pointer flex items-center gap-2 select-none active:scale-[0.98] ${
                activeTab === "personal"
                  ? "text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                <span>PERSONAL <span className="hidden sm:inline">PROJECTS</span></span>
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono transition-colors duration-200 ${
                  activeTab === "personal"
                    ? "bg-white/15 text-white border border-white/20 shadow-sm"
                    : "bg-zinc-800/80 text-zinc-400 border border-zinc-700/60"
                }`}
              >
                {personalCount}
              </span>
            </button>

            {/* Tab 2: Freelance */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("freelance");
                setExpandedId(null);
              }}
              className={`relative z-10 px-3 sm:px-4 py-1.5 rounded-lg font-mono text-[11px] sm:text-xs font-medium transition-colors duration-200 cursor-pointer flex items-center gap-2 select-none active:scale-[0.98] ${
                activeTab === "freelance"
                  ? "text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400/80" />
                <span>FREELANCE <span className="hidden sm:inline">PROJECTS</span></span>
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono transition-colors duration-200 ${
                  activeTab === "freelance"
                    ? "bg-white/15 text-white border border-white/20 shadow-sm"
                    : "bg-zinc-800/80 text-zinc-400 border border-zinc-700/60"
                }`}
              >
                {freelanceCount}
              </span>
            </button>
          </div>
        </div>

        {/* Live GitHub Sync Status Indicator with Radar Beacon */}
        <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 flex items-center gap-2 shrink-0 self-start sm:self-auto pl-1 sm:pl-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>
            {activeTab === "personal"
              ? "Auto-synced with GitHub #portfolio"
              : "Auto-synced with GitHub #freelance"}
          </span>
        </span>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {displayedProjects.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-[var(--border)] bg-[var(--card)] text-zinc-500 font-mono text-xs">
            No {activeTab} projects found.
          </div>
        ) : (
          displayedProjects.map((project, idx) => {
            const isExpanded = expandedId === project.id;
            const isFreelance = project.type === "freelance";
            const displayYear = project.year || 2026;
            const domainPreview = project.live
              ? project.live.replace(/^https?:\/\//, "").replace(/\/$/, "")
              : project.title;

            return (
              <div
                key={project.id || idx}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] backdrop-blur-md hover:border-[var(--border-lit)] transition-all duration-200 overflow-hidden"
              >
                {/* Clickable Row Header */}
                <button
                  type="button"
                  onClick={() => toggleProject(project.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-zinc-900/60 transition-colors cursor-pointer select-none"
                  aria-expanded={isExpanded}
                >
                  <div className="pr-4">
                    <div className="text-sm sm:text-base font-medium text-white flex flex-wrap items-center gap-2">
                      <span>{project.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300">
                        {project.status || "Deployed"}
                      </span>
                      {isFreelance && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-700/50">
                          Client Work
                        </span>
                      )}
                      {project.isAutomated && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white border border-white/20">
                          GitHub Auto
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-400 mt-1 font-normal line-clamp-1">
                      {project.subtitle}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs font-mono text-zinc-500">{displayYear}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-white transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Animated Accordion Drawer */}
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-280 ease-in-out ${
                    isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="p-4 sm:p-5 border-t border-[var(--border)] bg-black/95">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                        
                        {/* Left: Website Thumbnail Mockup - Exact 16:7 aspect ratio with top-left anchor */}
                        <div className="md:col-span-6 w-full">
                          {project.thumbnail ? (
                            <div className="group relative rounded-xl border border-zinc-800 bg-zinc-900/90 overflow-hidden shadow-lg transition-all duration-300 hover:border-zinc-700">
                              {/* Browser Header Bar */}
                              <div className="px-3 py-2 bg-zinc-950/90 border-b border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-500 select-none">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                                  <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                                  <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                                </div>
                                <span className="text-[9px] text-zinc-400 truncate max-w-[160px]">
                                  {domainPreview}
                                </span>
                                <span className="text-[9px] text-zinc-600">PREVIEW</span>
                              </div>

                              {/* Exact 16:7 aspect ratio (1920x840) with object-left-top so brand logos are 100% visible */}
                              <div className="relative aspect-[16/7] overflow-hidden bg-zinc-950">
                                <img
                                  src={project.thumbnail}
                                  alt={`${project.title} Preview`}
                                  className="w-full h-full object-cover object-left-top transition-transform duration-300"
                                  loading="lazy"
                                />

                                {/* Interactive Hover Overlay for Live Site */}
                                {project.live && (
                                  <a
                                    href={project.live}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[1px]"
                                    aria-label={`Open live site for ${project.title}`}
                                  >
                                    <span className="px-3 py-1.5 rounded-full bg-white text-black font-mono text-xs font-semibold shadow-xl flex items-center gap-1.5">
                                      <span>View Live Site</span>
                                      <ArrowUpRight className="w-3.5 h-3.5" />
                                    </span>
                                  </a>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="aspect-[16/7] rounded-xl border border-zinc-800 bg-zinc-900/60 flex items-center justify-center text-xs font-mono text-zinc-500">
                              Preview image coming soon
                            </div>
                          )}
                        </div>

                        {/* Right: Content, Tech Stack & Action Links */}
                        <div className="md:col-span-6 flex flex-col justify-between space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>{project.status || "Live"}</span>
                              </span>
                              <span className="text-xs font-mono text-zinc-500">•</span>
                              <span className="text-xs font-mono text-zinc-400">{displayYear}</span>
                            </div>

                            <p className="text-xs sm:text-[13px] text-zinc-300 leading-relaxed font-light">
                              {project.description}
                            </p>

                            {/* Tech Stack Pills */}
                            {project.stack && project.stack.length > 0 && (
                              <div className="pt-1">
                                <span className="text-[10px] font-mono text-zinc-500 block mb-1.5 uppercase tracking-wider">
                                  Tech Architecture:
                                </span>
                                <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                                  {project.stack.map((tech, tIdx) => (
                                    <span
                                      key={tIdx}
                                      className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-700 transition-colors"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Action Links */}
                          <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-3 border-t border-zinc-900">
                            {project.live && (
                              <a
                                href={project.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-white text-black hover:bg-zinc-200 transition-colors flex items-center gap-1.5 font-semibold text-xs shadow-sm"
                              >
                                <span>↗ Live Site</span>
                              </a>
                            )}

                            {/* Privacy rule: Hide GitHub repo for freelance client projects */}
                            {!isFreelance && project.github && (
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors flex items-center gap-1.5 font-medium text-xs"
                              >
                                <GithubIcon className="w-3.5 h-3.5" />
                                <span>Source Code</span>
                              </a>
                            )}
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default Projects;
