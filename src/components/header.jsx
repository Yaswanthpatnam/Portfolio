import React from "react";
import { FileText, Mail, Sun, Moon, ArrowUpRight, Sparkles, MapPin } from "lucide-react";

const Header = ({ onToggleTheme, theme }) => {
  return (
    <section id="hero" className="panel relative overflow-hidden p-6 sm:p-8 md:p-10 lg:p-12">
      {/* Subtle atmospheric ambient glow */}
      <div 
        className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full blur-3xl opacity-30 transition-opacity duration-700"
        style={{
          background: "radial-gradient(circle, rgba(200, 189, 86, 0.4) 0%, rgba(200, 189, 86, 0.05) 70%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col-reverse items-center justify-between gap-8 md:flex-row md:items-center lg:gap-12">
        {/* Left Column: Bio & Core Info */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          {/* Status & Alias Pill */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <span className="badge-live">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#83CE7E] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#83CE7E]"></span>
              </span>
              Available for Opportunities
            </span>
            <span className="inline-flex items-center rounded-full border border-[var(--panel-border)] bg-[var(--pill-bg)] px-3 py-1 font-albert text-xs sm:text-sm font-medium tracking-wide text-[color:var(--text-muted)]">
              alias Yaswanth
            </span>
          </div>

          {/* Name & Title */}
          <div className="space-y-2">
            <h1 className="font-sansation text-3xl font-bold tracking-[0.08em] sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.1]">
              <span className="accent-gradient-text">YASWANTH BABU</span>
              <br className="hidden sm:inline" />
              <span className="tracking-[0.1em] text-[var(--text-primary)]"> PATNAM</span>
            </h1>

            <p className="font-albert text-lg font-semibold tracking-wide text-[var(--accent)] sm:text-xl lg:text-2xl">
              Full Stack Developer & Creative Technologist
            </p>
          </div>

          {/* Value Pitch */}
          <p className="max-w-xl font-albert text-base leading-relaxed text-[color:var(--text-muted)] sm:text-lg sm:leading-8">
            Turning creative wireframes into production-grade, resilient software.
            Specializing in scalable Python/Django backends, relational databases, and
            clean, reactive interfaces built with modern React.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 md:justify-start">
            <a
              href="https://drive.google.com/file/d/1rH3k90oc-mZ1nQoLZFslmbJAteYnTtM4/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="primary-btn group"
            >
              <FileText className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Resume</span>
              <ArrowUpRight className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <a
              href="#connect"
              className="ghost-btn px-5 py-2.5 text-sm sm:text-base font-semibold"
            >
              <Mail className="h-4 w-4 text-[var(--accent)]" />
              <span>Let's Connect</span>
            </a>

            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme mode"
              className="ghost-btn px-4 py-2.5 text-sm sm:text-base font-semibold transition"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4 text-[var(--accent)] transition-transform hover:rotate-45" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-[var(--accent)] transition-transform hover:-rotate-12" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 border-t border-[var(--panel-border)] pt-5 text-left">
            <div>
              <p className="font-sansation text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
                5+
              </p>
              <p className="font-albert text-xs sm:text-sm text-[color:var(--text-muted)]">
                Web Applications
              </p>
            </div>
            <div>
              <p className="font-sansation text-xl font-bold text-[var(--accent)] sm:text-2xl">
                Full-Stack
              </p>
              <p className="font-albert text-xs sm:text-sm text-[color:var(--text-muted)]">
                Architecture Focus
              </p>
            </div>
            <div>
              <p className="font-sansation text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
                100%
              </p>
              <p className="font-albert text-xs sm:text-sm text-[color:var(--text-muted)]">
                Figma to Reality
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Portrait with Aesthetic Warm Lighting Frame */}
        <div className="relative shrink-0">
          {/* Ambient Golden Glow Behind Portrait matching the warm sunset tone in the image */}
          <div 
            className="absolute -inset-2 rounded-[2.5rem] opacity-70 blur-xl transition-all duration-700 hover:opacity-100"
            style={{
              background: "linear-gradient(135deg, rgba(200, 189, 86, 0.45) 0%, rgba(200, 189, 86, 0.1) 60%, transparent 100%)",
            }}
            aria-hidden="true"
          />

          {/* Main Portrait Frame */}
          <div className="group relative h-64 w-52 overflow-hidden rounded-[2.2rem] border border-[var(--panel-border)] bg-[var(--card-bg)] shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-[var(--accent)] sm:h-80 sm:w-64 md:h-96 md:w-72 lg:h-[26rem] lg:w-[19.5rem]">
            <img
              src="/hero.jpg"
              alt="Yaswanth Babu Patnam"
              className="h-full w-full object-cover object-[center_18%] transition-transform duration-700 ease-out group-hover:scale-105"
              onError={(e) => {
                // Fallback to profile.jpg if needed
                if (!e.currentTarget.src.includes("profile.jpg")) {
                  e.currentTarget.src = "/profile.jpg";
                }
              }}
            />

            {/* Subtle Gradient Vignette at the bottom */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

            {/* Floating Location Tag at bottom of photo */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-white/20 bg-black/60 px-3.5 py-2 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <MapPin className="h-3.5 w-3.5 text-[#C8BD56]" />
                <span>India</span>
              </div>
              <span className="text-[11px] font-medium tracking-wide text-white/80">
                Full-Stack Eng.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
