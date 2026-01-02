import React from "react";

const Experiences = () => {
  return (
    <section className="panel px-4 py-8 sm:px-8 md:px-10 md:py-12">
      <h2 className="font-sansation text-2xl tracking-[0.1em] sm:text-3xl">EXPERIENCE</h2>

      <article className="mt-6 rounded-3xl border border-[var(--panel-border)] bg-[var(--card-bg)] p-5 shadow-lg shadow-black/30 sm:mt-8 sm:p-7">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <h3 className="font-albert text-xl font-bold leading-8 tracking-[0.05em] sm:text-2xl sm:leading-9">
               Web Development Intern · Edunoverse Tech Solutions
            </h3>
            <p className="text-[#C8BD56]">Django . Django Rest Framework . React . Figma . Deployment</p>
          </div>
          <p className="font-albert text-base tracking-[0.05em] text-[color:var(--text-muted)] sm:text-lg">
            Oct 2025 – Dec 2025
          </p>
        </div>
      </article>
            <article className="mt-6 rounded-3xl border border-[var(--panel-border)] bg-[var(--card-bg)] p-5 shadow-lg shadow-black/30 sm:mt-8 sm:p-7">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <h3 className="font-albert text-xl font-bold leading-8 tracking-[0.05em] sm:text-2xl sm:leading-9">
              Front-End Web Development Intern · Think-Champ Pvt Ltd
            </h3>
            <p className="text-[#C8BD56]">HTML · CSS · JavaScript</p>
          </div>
          <p className="font-albert text-base tracking-[0.05em] text-[color:var(--text-muted)] sm:text-lg">
            Jan 2024 – Feb 2024
          </p>
        </div>
      </article>
    </section>
  );
};

export default Experiences;
