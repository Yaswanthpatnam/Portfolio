import React, { useState, useEffect } from "react";

const roles = [
  { role: "Backend Engineer", article: "a" },
  { role: "Software Engineer", article: "a" },
  { role: "AI Developer", article: "an" },
  { role: "AI Full-Stack Engineer", article: "an" },
];

export const Header = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % roles.length);
        setFade(true);
      }, 250);
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  const current = roles[roleIndex];

  return (
    <section className="relative z-10 pt-4 sm:pt-6 space-y-4">
      <h1 className="text-4xl sm:text-6xl text-white leading-tight font-light select-none">
        <span className="font-script text-zinc-300 text-3xl sm:text-5xl mr-2">
          I'm {current.article}
        </span>
        <span
          className={`font-instrument font-normal text-white tracking-normal underline decoration-white/25 underline-offset-8 transition-all duration-300 inline-block ${
            fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
        >
          {current.role}
        </span>
        <span className="text-zinc-500 font-sans">.</span>
      </h1>

      <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light max-w-xl pt-2">
        Architecting end-to-end web platforms that blend high-performance server APIs with modern LLM capabilities. Turning complex engineering problems into clean, production-grade solutions.
      </p>

      <div className="flex items-center gap-3 text-xs font-mono text-zinc-500 pt-1">
        <span className="text-zinc-400">● Based in Bangalore</span>
        <span>·</span>
        <span className="text-zinc-400">Open for ambitious engineering roles</span>
      </div>
    </section>
  );
};

export default Header;
