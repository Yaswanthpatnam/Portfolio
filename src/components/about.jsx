import React from "react";
import { Compass, Palette, Terminal, Sparkles } from "lucide-react";

export const About = () => {
  const pillars = [
    {
      icon: <Compass className="h-5 w-5 text-[var(--accent)]" />,
      title: "Mindset Over Title",
      text: "Believing that being a developer is about an exploratory problem-solving mindset, curiosity, and continuous learning rather than just labels.",
    },
    {
      icon: <Palette className="h-5 w-5 text-[var(--accent)]" />,
      title: "Design-Driven Engineering",
      text: "Crafting wireframes and design systems in Figma first, then implementing them into clean, performant, responsive code.",
    },
    {
      icon: <Terminal className="h-5 w-5 text-[var(--accent)]" />,
      title: "Full-Stack Reliability",
      text: "Architecting solid RESTful APIs and PostgreSQL databases while maintaining smooth, modern component interactions on the frontend.",
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
              01 // Biography
            </span>
          </div>
          <h2 className="font-sansation text-2xl font-bold tracking-[0.1em] text-[var(--text-primary)] sm:text-3xl lg:text-4xl">
            ABOUT ME
          </h2>
        </div>

        {/* Narrative */}
        <div className="relative rounded-2xl border border-[var(--panel-border)] bg-[var(--card-bg)] p-6 sm:p-8">
          <p className="font-albert text-base leading-relaxed text-[color:var(--text-muted)] sm:text-lg sm:leading-8">
            Hey, I'm <strong className="font-semibold text-[var(--text-primary)]">Yaswanth</strong> — a full-stack developer who truly believes that being a developer is more about the mindset than just a title. I love creating things, exploring new ideas, and doing something different every time I start a project.
          </p>
          <p className="mt-4 font-albert text-base leading-relaxed text-[color:var(--text-muted)] sm:text-lg sm:leading-8">
            I constantly try to upgrade myself, learn new things, and experiment with what's next — whether it's a new design approach, a fresh concept, or a new technology that excites me. I'm someone who enjoys designing, building, and thinking creatively. I find joy in turning ideas into something real.
          </p>
        </div>

        {/* Philosophy Cards */}
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