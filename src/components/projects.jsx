import React, { useState, useEffect } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { GithubIcon } from "./icons";
import localProjects from "../data/projects.json";

// Blacklist of test or unwanted repo names
const EXCLUDED_REPOS = [
  "lost_and_found",
  "lost_-_found",
  "port",
  "stock",
  "story",
  "yaswanthbabu-",
  "flask-react-template",
  "portfolio",
];

export const Projects = () => {
  const [projectsList, setProjectsList] = useState(localProjects);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const processRepos = (repos) => {
      // Identify repos tagged specifically with topic 'portfolio'
      const githubDiscovered = repos
        .filter((repo) => {
          if (repo.fork) return false;
          const nameLower = repo.name.toLowerCase();
          if (EXCLUDED_REPOS.includes(nameLower)) return false;
          return repo.topics && repo.topics.includes("portfolio");
        })
        .map((repo) => {
          const matchedLocal = localProjects.find(
            (p) =>
              p.title.toLowerCase() === repo.name.toLowerCase() ||
              (p.github && p.github.toLowerCase().includes(repo.name.toLowerCase()))
          );

          const topicsStack =
            repo.topics && repo.topics.length > 0
              ? repo.topics.filter((t) => t !== "portfolio").slice(0, 4)
              : repo.language
              ? [repo.language]
              : ["Software"];

          return {
            id: repo.name.toLowerCase(),
            title: matchedLocal?.title || repo.name.replace(/[-_]/g, " "),
            subtitle:
              matchedLocal?.subtitle ||
              repo.description ||
              "Automated GitHub Project",
            description:
              matchedLocal?.description ||
              repo.description ||
              "Continuously integrated project repository tagged with #portfolio on GitHub.",
            stack: matchedLocal?.stack || topicsStack,
            status: repo.homepage ? "Live" : "Deployed",
            github: repo.html_url,
            live: repo.homepage || matchedLocal?.live || null,
            year: new Date(repo.updated_at).getFullYear(),
            isAutomated: !matchedLocal,
          };
        });

      const existingIds = new Set(localProjects.map((p) => p.id.toLowerCase()));
      const newFromGithub = githubDiscovered.filter(
        (p) => !existingIds.has(p.id.toLowerCase())
      );

      if (newFromGithub.length > 0 && isMounted) {
        setProjectsList([...newFromGithub, ...localProjects]);
      }
    };

    // 1. Instant hydration from sessionStorage cache if available (prevents hitting GitHub 60 req/hr rate limit)
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

  return (
    <section id="projects" className="relative z-10 space-y-4 pt-2">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-zinc-500">[01]</span>
          <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold">
            SELECTED PROJECTS
          </h2>
        </div>
        <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Auto-synced with GitHub #portfolio</span>
        </span>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {projectsList.map((project, idx) => {
          const isExpanded = expandedId === project.id;
          const displayYear = project.year || 2026;

          return (
            <div
              key={project.id || idx}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] backdrop-blur-md hover:border-[var(--border-lit)] transition-all duration-200 overflow-hidden"
            >
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

              {/* Zero-Flicker Smooth Animated Accordion Drawer */}
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-200 ease-in-out ${
                  isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 pt-2 border-t border-[var(--border)] bg-black/90 space-y-3">
                    <p className="text-xs text-zinc-300 leading-relaxed font-light">
                      {project.description}
                    </p>

                    {/* Concise Tech Stack Pills */}
                    {project.stack && project.stack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 font-mono text-[10px] pt-0.5">
                        {project.stack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-[var(--border)]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Clean Action Links */}
                    <div className="flex items-center gap-4 text-xs font-mono pt-1">
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:underline flex items-center gap-1 font-medium"
                        >
                          <span>↗ Live Site</span>
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-400 hover:text-white flex items-center gap-1"
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
          );
        })}
      </div>
    </section>
  );
};

export default Projects;
