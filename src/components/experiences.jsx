import React from "react";
import { Briefcase, Calendar, CheckCircle2 } from "lucide-react";

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
    "Connected authenticated users with their application accounts and supported customer order requests through the backend."
  ],
  stack: [
    "Django",
    "Django REST Framework",
    "React.js",
    "PostgreSQL",
    "Google OAuth",
    "JWT",
    "Django ORM"
  ],
},

];

const Experiences = () => {
  return (
    <section id="experience" className="panel p-6 sm:p-8 md:p-10 lg:p-12">
      <div className="space-y-8">
        {/* Section Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            <span className="font-albert text-xs sm:text-sm font-semibold tracking-widest uppercase text-[var(--accent)]">
              04 // Career Journey
            </span>
          </div>
          <h2 className="font-sansation text-2xl font-bold tracking-[0.1em] text-[var(--text-primary)] sm:text-3xl lg:text-4xl">
            WORK EXPERIENCE
          </h2>
          <p className="max-w-xl font-albert text-base text-[color:var(--text-muted)]">
            Practical hands-on industry experience delivering real-world code, collaborative team development, and reliable web applications.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative space-y-8 before:absolute before:inset-0 before:left-4 before:h-full before:w-0.5 before:bg-[var(--panel-border)] sm:before:left-6">
          {experiencesData.map((exp, index) => (
            <div key={index} className="relative flex items-start gap-4 sm:gap-6">
              {/* Timeline Node Icon */}
              <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[var(--accent)] bg-[var(--bg-primary)] shadow-glow-gold sm:h-12 sm:w-12">
                <Briefcase className="h-4 w-4 text-[var(--accent)] sm:h-5 sm:w-5" />
              </div>

              {/* Experience Card */}
              <article className="group flex-1 rounded-2xl border border-[var(--panel-border)] bg-[var(--card-bg)] p-6 transition-all duration-300 hover:border-[var(--accent)] hover:shadow-card-hover sm:p-8">
                <div className="flex flex-col justify-between gap-2 border-b border-[var(--panel-border)] pb-4 md:flex-row md:items-center">
                  <div>
                    <span className="inline-block rounded-full bg-[#c8bd56]/15 px-2.5 py-0.5 text-xs font-semibold text-[#c8bd56]">
                      {exp.type}
                    </span>
                    <h3 className="mt-1.5 font-albert text-xl font-bold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)] sm:text-2xl">
                      {exp.role}
                    </h3>
                    <p className="font-albert text-base font-medium text-[var(--accent)]">
                      {exp.company}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 font-albert text-xs sm:text-sm text-[color:var(--text-muted)]">
                    <Calendar className="h-4 w-4 text-[var(--accent)]" />
                    <span>{exp.period}</span>
                  </div>
                </div>

                <p className="mt-4 font-albert text-base leading-relaxed text-[color:var(--text-muted)]">
                  {exp.description}
                </p>

                {/* Bullet Highlights */}
                <ul className="mt-4 space-y-2">
                  {exp.highlights.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 font-albert text-sm text-[color:var(--text-muted)]"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#83CE7E]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech Stack Pills */}
                <div className="mt-5 flex flex-wrap gap-2 pt-2">
                  {exp.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-albert text-xs font-medium text-[var(--text-primary)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experiences;
