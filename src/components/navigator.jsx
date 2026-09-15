import React, { useState } from "react";
import {
  Mail,
  ArrowUp,
  Copy,
  Check,
  Send,
  ExternalLink,
} from "lucide-react";
import { LinkedinIcon, GithubIcon } from "./icons";

const socials = [
  {
    label: "LinkedIn",
    name: "yaswanth-patnam",
    href: "https://www.linkedin.com/in/yaswanth-patnam-2aa28b340/",
    icon: <LinkedinIcon className="h-5 w-5" />,
    color: "#0a66c2",
  },
  {
    label: "GitHub",
    name: "Yaswanthpatnam",
    href: "https://github.com/Yaswanthpatnam",
    icon: <GithubIcon className="h-5 w-5" />,
    color: "#ffffff",
  },
  {
    label: "Email",
    name: "patnamyaswanth79@gmail.com",
    href: "mailto:patnamyaswanth79@gmail.com",
    icon: <Mail className="h-5 w-5" />,
    color: "#c8bd56",
  },
];

const Navigator = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("patnamyaswanth79@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Dedicated Connect Section */}
      <section id="connect" className="panel p-6 sm:p-8 md:p-10 lg:p-12 text-center">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            <span className="font-albert text-xs sm:text-sm font-semibold tracking-widest uppercase text-[var(--accent)]">
              05 // Get In Touch
            </span>
          </div>

          <h2 className="font-sansation text-3xl font-bold tracking-[0.1em] text-[var(--text-primary)] sm:text-4xl">
            LET'S BUILD SOMETHING EXTRAORDINARY
          </h2>

          <p className="font-albert text-base leading-relaxed text-[color:var(--text-muted)] sm:text-lg">
            Whether you have an exciting project, full-time opportunity, or want to collaborate on something new — my inbox is always open.
          </p>

          {/* Direct Email Action Box */}
          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <a
              href="mailto:patnamyaswanth79@gmail.com"
              className="primary-btn w-full sm:w-auto"
            >
              <Send className="h-4 w-4" />
              <span>Say Hello</span>
            </a>

            <button
              onClick={handleCopyEmail}
              className="ghost-btn w-full sm:w-auto px-5 py-2.5"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-[#83CE7E]" />
                  <span className="text-[#83CE7E]">Email Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-[var(--accent)]" />
                  <span>Copy Email</span>
                </>
              )}
            </button>
          </div>

          {/* Social Links Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 rounded-full border border-[var(--panel-border)] bg-[var(--pill-bg)] px-5 py-2.5 font-albert text-sm font-medium transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-glow-gold hover:-translate-y-1"
                aria-label={social.label}
              >
                <span className="text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
                  {social.icon}
                </span>
                <span>{social.label}</span>
                <ExternalLink className="h-3 w-3 opacity-50 transition-opacity group-hover:opacity-100" />
              </a>
            ))}
          </div>

          <div className="pt-8 text-center">
            <p className="font-albert text-xs tracking-wider text-[color:var(--text-muted)]">
              Designed with Figma Wireframes & Engineered with React + Tailwind CSS by Yaswanth Babu Patnam.
            </p>
          </div>
        </div>
      </section>

      {/* Floating Bottom Quick Dock */}
      <div className="sticky bottom-5 z-40 flex justify-center px-4">
        <nav
          aria-label="Floating quick navigation"
          className="flex items-center gap-1 sm:gap-2 rounded-full border border-white/20 bg-[#121216]/80 px-4 py-2.5 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-white/30"
        >
          <a
            href="#hero"
            className="rounded-full px-3 py-1 font-albert text-xs sm:text-sm font-semibold text-[color:var(--text-muted)] transition-colors hover:text-[var(--accent)]"
          >
            Top
          </a>
          <a
            href="#about"
            className="rounded-full px-3 py-1 font-albert text-xs sm:text-sm font-semibold text-[color:var(--text-muted)] transition-colors hover:text-[var(--accent)]"
          >
            About
          </a>
          <a
            href="#skills"
            className="rounded-full px-3 py-1 font-albert text-xs sm:text-sm font-semibold text-[color:var(--text-muted)] transition-colors hover:text-[var(--accent)]"
          >
            Skills
          </a>
          <a
            href="#projects"
            className="rounded-full px-3 py-1 font-albert text-xs sm:text-sm font-semibold text-[color:var(--text-muted)] transition-colors hover:text-[var(--accent)]"
          >
            Projects
          </a>
          <a
            href="#experience"
            className="hidden sm:inline-block rounded-full px-3 py-1 font-albert text-xs sm:text-sm font-semibold text-[color:var(--text-muted)] transition-colors hover:text-[var(--accent)]"
          >
            Experience
          </a>

          <div className="mx-1 h-4 w-px bg-white/20" />

          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-[var(--accent)] hover:text-black"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </nav>
      </div>
    </>
  );
};

export default Navigator;
