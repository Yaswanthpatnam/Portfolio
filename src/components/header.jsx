import React from "react";


const Header = ({ onToggleTheme, theme }) => {
  return (
    <section className="panel px-4 py-8 sm:px-8 md:px-10 md:py-12">
      <div className="flex items-center justify-between gap-4 sm:gap-6">
        <div className="min-w-0 flex-1 space-y-5">
          <p className="font-albert text-[clamp(0.9rem,2.4vw,1.05rem)] tracking-[0.05em] text-[color:var(--text-muted)]">
            alias Yaswanth
          </p>
          <h1 className="font-sansation text-[clamp(1.9rem,5vw,2.8rem)] leading-tight tracking-[0.1em]">
            YASWANTH BABU PATNAM
          </h1>
          <p className="font-albert text-[clamp(1.1rem,3.1vw,1.5rem)] tracking-[0.05em]">
            Full Stack Developer
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href="https://drive.google.com/file/d/16_IQW1UpNp4PxT7CqIQzSUnTkLybI8RM/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-[var(--panel-border)] bg-[var(--pill-bg)] px-5 py-2.5 text-[clamp(0.95rem,2.6vw,1.05rem)] font-semibold tracking-[0.05em] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Resume
            </a>
            <button
              onClick={onToggleTheme}
              className="inline-flex items-center justify-center rounded-full border border-[var(--panel-border)] px-5 py-2.5 text-[clamp(0.95rem,2.6vw,1.05rem)] font-semibold tracking-[0.05em] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>

        <a
          className="ml-3 h-24 w-24 shrink-0 overflow-hidden rounded-full border border-[var(--panel-border)] bg-[var(--pill-bg)] transition hover:scale-105 sm:h-28 sm:w-28 md:h-36 md:w-36 lg:h-40 lg:w-40"
        >
          <img
            src="/profile.jpg"
            alt="Yaswanth Babu Patnam"
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </a>
      </div>
    </section>
  );
};

export default Header;
