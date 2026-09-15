import React from "react";
import { Code2, Layout, Database, Wrench, Layers } from "lucide-react";
import { skillCategories } from "../data/skills";

const categoryIcons = {
  "Programming Languages": <Code2 className="h-5 w-5 text-[var(--accent)]" />,
  "Frameworks & Frontend": <Layout className="h-5 w-5 text-[var(--accent)]" />,
  "Databases & Caching": <Database className="h-5 w-5 text-[var(--accent)]" />,
  "DevOps, Tools & Workflow": <Wrench className="h-5 w-5 text-[var(--accent)]" />,
};

const Skills = () => {
  return (
    <section id="skills" className="panel p-6 sm:p-8 md:p-10 lg:p-12">
      <div className="space-y-8">
        {/* Section Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            <span className="font-albert text-xs sm:text-sm font-semibold tracking-widest uppercase text-[var(--accent)]">
              02 // Capabilities
            </span>
          </div>
          <h2 className="font-sansation text-2xl font-bold tracking-[0.1em] text-[var(--text-primary)] sm:text-3xl lg:text-4xl">
            SKILLS & TOOLKIT
          </h2>
          <p className="max-w-2xl font-albert text-base text-[color:var(--text-muted)]">
            A versatile technical stack built around end-to-end web engineering, from data modeling and robust APIs to fluid client-side interfaces.
          </p>
        </div>

        {/* Categorized Bento Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {skillCategories.map((category) => (
            <div
              key={category.title}
              className="flex flex-col justify-between rounded-2xl border border-[var(--panel-border)] bg-[var(--card-bg)] p-6 transition-all duration-300 hover:border-[var(--panel-border-hover)]"
            >
              <div>
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--panel-border)] bg-[var(--pill-bg)]">
                    {categoryIcons[category.title] || <Layers className="h-5 w-5 text-[var(--accent)]" />}
                  </div>
                  <div>
                    <h3 className="font-albert text-lg font-bold tracking-wide text-[var(--text-primary)]">
                      {category.title}
                    </h3>
                    <p className="font-albert text-xs text-[color:var(--text-muted)]">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Skill Pills */}
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {category.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="pill group cursor-default text-xs sm:text-sm"
                      title={skill.tag}
                    >
                      <span className="font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                        {skill.name}
                      </span>
                      {skill.tag && (
                        <span className="ml-2 hidden rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-[color:var(--text-muted)] group-hover:inline-block sm:inline-block">
                          {skill.tag}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
