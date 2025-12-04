import React from "react";

const projects = [
  {
    title: "FindIt",
    description:
      "FindIt is a Full Stack Web application where it enables users to search lost belongings and submit found things .It was developed by using Django, Postgres for backend and React.js, Tailwind CSS for frontend. ",
    stack: ["Django Rest Framework", "PostgreSQL", "React.js", "Tailwind CSS", "JavaScript", "Figma", "Docker"],
    status: "Live",
    statusColor: "#83CE7E",
    github: "https://github.com/Yaswanthpatnam/FindIt",
    live: "https://findit-bice.vercel.app/",
  },
  {
    title: "To-Do App",
    description:
      "A simple yet powerful app to organize daily tasks and boost productivity effortlessly.",
    stack: ["JavaScript", "React.js", "CSS", "Axios"],
    status: "Live",
    statusColor: "#83CE7E",
    github: "https://github.com/Yaswanthpatnam/Todo-app",
    live: "https://todo-app-ashen-nine.vercel.app/",
  },
  {
    title: "Weather App",
    description:
      "A real-time weather tracker that provides accurate forecasts by city or ZIP code in a clean, responsive design.",
    stack: ["Python", "Django", "OpenWeatherAPI"],
    status: "Live",
    statusColor: "#83CE7E",
    github: "https://github.com/Yaswanthpatnam/weather",
    live: "https://weather-app-ma7h.onrender.com/",
  },
];

const Projects = () => {
  return (
    <section className="panel px-4 py-8 sm:px-8 md:px-10 md:py-12">
      <h2 className="font-sansation text-2xl tracking-[0.1em] sm:text-3xl">PROJECTS</h2>

      <div className="mt-6 space-y-6 sm:mt-8 sm:space-y-8">
        {projects.map((project) => (
          <article
            key={project.title}
            className="rounded-3xl border border-white/20 bg-[#282829]/70 p-5 shadow-lg shadow-black/30 sm:p-7"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h3 className="font-albert text-xl font-bold tracking-[0.05em] sm:text-2xl">
                {project.title}
              </h3>
              <div className="flex items-center gap-3 text-sm">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ghost-btn"
                >
                  GitHub
                </a>
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ghost-btn"
                >
                  Live
                </a>
              </div>
            </div>

            <p className="mt-3 font-albert text-base leading-7 text-[color:var(--text-muted)] sm:text-lg sm:leading-8">
              {project.description}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-semibold tracking-[0.05em] text-[#C8BD56]">
              {project.stack.join(", ")}
            </div>

            <div className="mt-6 inline-flex items-center rounded-full border border-white/40 bg-[#282829] px-4 py-2 text-base font-semibold tracking-[0.05em]" style={{ color: project.statusColor }}>
              {project.status}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Projects;
