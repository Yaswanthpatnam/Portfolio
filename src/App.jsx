import React, { useEffect, useState } from "react";
import Navbar from "./components/navbar";
import Header from "./components/header";
import About from "./components/about";
import Skills from "./components/skills";
import Projects from "./components/projects";
import Experiences from "./components/experiences";
import Navigator from "./components/navigator";

function App() {
  const [theme, setTheme] = useState("dark");
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  // Subtle interactive ambient spotlight on pointer move
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <main className="relative min-h-screen bg-[var(--bg-primary)] px-3 pb-12 pt-3 text-[var(--text-primary)] sm:px-5 md:px-8">
      {/* Dynamic Ambient Cursor Glow (Smooth, GPU-accelerated) */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500"
        style={{
          background:
            theme === "dark"
              ? `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(200, 189, 86, 0.05), transparent 80%)`
              : `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(200, 189, 86, 0.08), transparent 80%)`,
        }}
        aria-hidden="true"
      />

      {/* Atmospheric Background Ambient Spheres */}
      <div
        className="pointer-events-none fixed -top-40 left-1/4 h-[500px] w-[500px] rounded-full opacity-20 blur-[120px]"
        style={{ background: "#c8bd56" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed top-1/2 -right-40 h-[600px] w-[600px] rounded-full opacity-10 blur-[140px]"
        style={{ background: "#83ce7e" }}
        aria-hidden="true"
      />

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8 sm:gap-12 lg:gap-14">
        {/* Sticky Top Section Navigation */}
        <Navbar onToggleTheme={toggleTheme} theme={theme} />

        {/* Hero Header */}
        <Header onToggleTheme={toggleTheme} theme={theme} />

        {/* Section Blocks */}
        <About />
        <Skills />
        <Projects />
        <Experiences />
        <Navigator />
      </div>
    </main>
  );
}

export default App;
