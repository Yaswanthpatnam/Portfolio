import React from "react";

const programmingLanguages = ["Python", "JavaScript", "Html/Css", "SQL", "PostgreSQL"];

const technologies = [
  "Django",
  "Django Rest Framework",
  "Flask",
  "React.js",
  "Tailwind Css",
  "MySQL",
  "Redis",
  "Git/GitHub",
  "Docker",
  "Postman",
  "PyCharm",
  "VS Code",
  "Figma",
];

const Skills = () => {
  return (
    <section className="panel px-4 py-8 sm:px-8 md:px-10 md:py-12">
      <div className="space-y-7">
        <h2 className="font-sansation text-2xl tracking-[0.1em] sm:text-3xl">SKILLS</h2>

        <div>
          <p className="inline-block border border-[var(--panel-border)] rounded-xl px-3 py-2 font-albert text-lg tracking-[0.05em] text-[color:var(--text-primary)] sm:text-xl">
            Programming Languages
          </p>
          <div className="mt-4 flex flex-wrap gap-3 sm:mt-6 sm:gap-4">
            {programmingLanguages.map((language) => (
              <span key={language} className="pill min-w-[120px] text-base sm:text-lg">
                {language}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="inline-block border border-[var(--panel-border)] rounded-xl px-3 py-2 font-albert text-lg tracking-[0.05em] text-[color:var(--text-primary)] sm:text-xl">
            Technologies & Frameworks
          </p>
          <div className="mt-4 flex flex-wrap gap-3 sm:mt-6 sm:gap-4">
            {technologies.map((tech) => (
              <span key={tech} className="pill min-w-[120px] text-base sm:text-lg">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
