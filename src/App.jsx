import React, { useEffect, useState } from "react";
import Header from "./components/header";
import About  from "./components/about";
import Skills from "./components/skills";
import Projects from "./components/projects";
import Experiences from "./components/experiences";
import Navigator from "./components/navigator";

function App() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <main className="bg-[var(--bg-primary)] px-3 py-8 text-[var(--text-primary)] sm:px-4 md:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 sm:gap-12 lg:gap-14">
        <Header onToggleTheme={toggleTheme} theme={theme} />
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
