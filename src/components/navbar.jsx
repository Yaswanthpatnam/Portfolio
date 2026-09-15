import React, { useState, useEffect } from "react";
import { Sun, Moon, FileText, Menu, X, ArrowUpRight } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Connect", href: "#connect" },
];

const Navbar = ({ onToggleTheme, theme }) => {
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ["about", "skills", "projects", "experience", "connect"];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-3 sm:top-4 z-50 w-full transition-all duration-300">
      <nav
        aria-label="Main Navigation"
        className={`mx-auto flex max-w-5xl items-center justify-between rounded-full border border-white/15 bg-[#121216]/80 px-4 py-2.5 shadow-2xl backdrop-blur-xl transition-all duration-300 sm:px-6 sm:py-3 ${
          scrolled ? "border-[var(--accent)]/30 shadow-[#c8bd56]/5" : ""
        }`}
      >
        {/* Brand / Logo */}
        <a
          href="#hero"
          className="group flex items-center gap-2.5 text-decoration-none"
          aria-label="Go to Top"
        >
          <div className="relative h-8 w-8 overflow-hidden rounded-full border border-[var(--accent)]/50 bg-[var(--pill-bg)]">
            <img
              src="/hero.jpg"
              alt="Yaswanth"
              className="h-full w-full object-cover object-top"
              onError={(e) => {
                if (!e.currentTarget.src.includes("profile.jpg")) {
                  e.currentTarget.src = "/profile.jpg";
                }
              }}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-sansation text-base font-bold tracking-wider text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
              YASWANTH
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#83CE7E] animate-pulse" />
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.label}
                href={link.href}
                className={`rounded-full px-3.5 py-1.5 font-albert text-sm font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--accent)] text-black shadow-sm"
                    : "text-[color:var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Right Actions: Resume, Theme Toggle, Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <a
            href="https://drive.google.com/file/d/1_1Bs-nRHi9SsyyDo30H6twvvQOsuHLq1/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[var(--panel-border)] bg-[var(--pill-bg)] px-3.5 py-1.5 font-albert text-xs sm:text-sm font-semibold text-[var(--text-primary)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <FileText className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span>Resume</span>
            <ArrowUpRight className="h-3 w-3 opacity-60" />
          </a>

          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme mode"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--panel-border)] bg-[var(--pill-bg)] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-[var(--accent)] transition-transform hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 text-[var(--accent)] transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Open mobile navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--panel-border)] bg-[var(--pill-bg)] text-[var(--text-primary)] transition hover:border-[var(--accent)] md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4 text-[var(--accent)]" />
            ) : (
              <Menu className="h-4 w-4 text-[var(--accent)]" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mx-auto mt-2 max-w-5xl rounded-2xl border border-white/15 bg-[#121216]/95 p-4 shadow-2xl backdrop-blur-2xl md:hidden">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-4 py-2.5 font-albert text-base font-semibold transition ${
                    isActive
                      ? "bg-[var(--accent)] text-black"
                      : "text-[var(--text-primary)] hover:bg-white/5 hover:text-[var(--accent)]"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
            <a
              href="https://drive.google.com/file/d/1rH3k90oc-mZ1nQoLZFslmbJAteYnTtM4/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 font-albert text-base font-semibold text-black"
            >
              <FileText className="h-4 w-4" />
              <span>View Resume</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
