import React from "react";
import { Calendar } from "lucide-react";

const experiencesData = [
  {
    role: "Web Development Intern",
    company: "Edunoverse Tech Solutions",
    period: "Oct 2025 – Dec 2025",
    type: "Internship",
    description:
      "Contributed to Bridge, a web application connecting local street vendors with customers through a centralized platform for browsing offerings and placing orders.",
    highlights: [
      "Integrated Google OAuth for user signup/login and JWT authentication for protected Django APIs.",
      "Implemented Django order processing using models, views, and ORM to create orders and manage their status lifecycle.",
      "Connected authenticated users with their application accounts and supported customer order requests through the backend.",
    ],
    stack: [
      "Django",
      "Django REST Framework",
      "React.js",
      "PostgreSQL",
      "Google OAuth",
      "JWT",
      "Django ORM",
    ],
  },
];

export const Experiences = () => {
  return (
    <section id="experience" className="relative z-10 space-y-4 pt-2">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-zinc-500">[02]</span>
          <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold">
            WORK EXPERIENCE
          </h2>
        </div>
        <span className="text-[11px] font-mono text-zinc-400">Career Trajectory</span>
      </div>

      <div className="space-y-3">
        {experiencesData.map((exp, index) => (
          <div
            key={index}
            className="p-4 sm:p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] backdrop-blur-md hover:border-[var(--border-lit)] transition-colors space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <div className="text-sm font-semibold text-white flex items-center gap-2">
                  <span>{exp.company}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/15">
                    {exp.type}
                  </span>
                </div>
                <div className="text-xs font-mono text-zinc-300 mt-0.5">
                  {exp.role}
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>{exp.period}</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              {exp.description}
            </p>

            {exp.highlights && exp.highlights.length > 0 && (
              <ul className="space-y-1 pt-1">
                {exp.highlights.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-[11px] text-zinc-400 flex items-start gap-2"
                  >
                    <span className="text-white">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {exp.stack && exp.stack.length > 0 && (
              <div className="flex flex-wrap gap-1.5 font-mono text-[10px] pt-1">
                {exp.stack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experiences;
