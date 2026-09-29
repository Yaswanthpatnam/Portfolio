import React from "react";
import { Cpu, Sparkles, Layers } from "lucide-react";

export const About = () => {
  const pillars = [
    {
      icon: <Cpu className="h-5 w-5 text-[var(--accent)]" />,
      title: "Foundational Architecture",
      text: "Writing modular, clean, and maintainable code grounded in strong computer science fundamentals, data modeling, algorithmic efficiency, and scalable system design.",
    },
    {
      icon: <Sparkles className="h-5 w-5 text-[var(--accent)]" />,
      title: "AI-Integrated Workflows",
      text: "Leveraging artificial intelligence, LLM APIs, and modern automated developer toolchains to accelerate engineering velocity and create intelligent, future-ready applications.",
    },
    {
      icon: <Layers className="h-5 w-5 text-[var(--accent)]" />,
      title: "End-to-End Ownership",
      text: "Taking complete ownership from problem formulation and architectural design to pixel-precise interfaces, containerized deployment, and continuous performance tuning.",
    },
  ];

  return (
    <section id="about" className="panel p-6 sm:p-8 md:p-10 lg:p-12">
      <div className="space-y-8">
        {/* Section Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            <span className="font-albert text-xs sm:text-sm font-semibold tracking-widest uppercase text-[var(--accent)]">
              01 // Philosophy & Approach
            </span>
          </div>
          <h2 className="font-sansation text-2xl font-bold tracking-[0.1em] text-[var(--text-primary)] sm:text-3xl lg:text-4xl">
            ABOUT ME
          </h2>
        </div>

        {/* Narrative */}
        <div className="relative rounded-2xl border border-[var(--panel-border)] bg-[var(--card-bg)] p-6 sm:p-8 space-y-4">
          <p className="font-albert text-lg font-semibold tracking-wide text-[var(--accent)] sm:text-xl">
            "I don’t define myself by a specific framework or toolset — I define myself as an engineer who solves problems from the ground up."
          </p>

          <p className="font-albert text-base leading-relaxed text-[color:var(--text-muted)] sm:text-lg sm:leading-8">
            My approach to software development stands on two pillars: <strong className="font-semibold text-[var(--text-primary)]">deep respect for fundamentals</strong> and a <strong className="font-semibold text-[var(--text-primary)]">relentless curiosity for what’s next</strong>.
          </p>

          <p className="font-albert text-base leading-relaxed text-[color:var(--text-muted)] sm:text-lg sm:leading-8">
            On one hand, I care deeply about core engineering principles: clean architecture, data structures, predictable state, and building systems that scale reliably under load. On the other hand, the software landscape is evolving faster than ever. I actively integrate modern AI tools, automated pipelines, and intelligent API workflows into how I design, develop, and test software.
          </p>

          <p className="font-albert text-base leading-relaxed text-[color:var(--text-muted)] sm:text-lg sm:leading-8">
            I treat every project as an opportunity to master new paradigms — whether that means digging into low-level mechanics, optimizing database query performance, or architecting intelligent, AI-augmented applications. For me, software engineering is a craft of daily learning, critical thinking, and turning complex ideas into dependable software.
          </p>
        </div>

        {/* Engineering Pillars */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl border border-[var(--panel-border)] bg-[var(--card-bg)] p-6 transition-all duration-300 hover:border-[var(--accent)] hover:shadow-card-hover"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--panel-border)] bg-[var(--pill-bg)] transition-transform duration-300 group-hover:scale-110">
                {pillar.icon}
              </div>
              <h3 className="font-albert text-lg font-bold tracking-wide text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
                {pillar.title}
              </h3>
              <p className="mt-2 font-albert text-sm leading-relaxed text-[color:var(--text-muted)]">
                {pillar.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;