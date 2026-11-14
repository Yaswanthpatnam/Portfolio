import React from "react";
import { ArrowUpRight } from "lucide-react";

export const Navbar = ({ onOpenResume, onOpenFeedback, hasReviews = true }) => {
  return (
    <header className="relative z-20 border-b border-zinc-800/80 pb-4 sm:pb-5 pt-2">
      {/* Top Primary Bar */}
      <div className="flex items-center justify-between gap-3">
        {/* Brand / Identity */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div>
            <div className="font-script text-xl sm:text-2xl text-white font-bold leading-none tracking-wide whitespace-nowrap">
              Yaswanth Babu
            </div>
            <div className="text-[10px] sm:text-[11px] font-mono text-zinc-400 mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/90 animate-pulse" />
              <span>Bangalore</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Desktop Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Desktop in-page links */}
          <nav className="hidden md:flex items-center gap-3 lg:gap-4 text-[11px] sm:text-xs font-mono text-zinc-400 mr-1">
            <a href="#projects" className="hover:text-white transition-colors whitespace-nowrap">
              Projects
            </a>
            {hasReviews && (
              <a href="#testimonials" className="hover:text-white transition-colors whitespace-nowrap">
                Reviews
              </a>
            )}
            <a href="#experience" className="hover:text-white transition-colors whitespace-nowrap">
              Experience
            </a>
            <a href="#analytics" className="hover:text-white transition-colors whitespace-nowrap">
              Analytics
            </a>
          </nav>

          {/* Feedback Button - Always accessible */}
          <a
            href="/review"
            onClick={(e) => {
              if (onOpenFeedback) {
                e.preventDefault();
                onOpenFeedback();
              }
            }}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-white/20 bg-white/5 text-zinc-200 hover:bg-white hover:text-black transition-all text-[11px] sm:text-xs font-mono font-medium flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 active:scale-95 shadow-xs"
            title="Client review link & portal (/review)"
          >
            <span>Feedback</span>
          </a>

          {/* CV Button - Prominent, touch-friendly, NEVER clipped */}
          <button
            type="button"
            onClick={onOpenResume}
            className="px-3 sm:px-3.5 py-1.5 rounded-lg border border-white/50 bg-white/10 sm:bg-transparent text-white hover:bg-white hover:text-black transition-all text-[11px] sm:text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 active:scale-95 shadow-sm"
            aria-label="Open Curriculum Vitae / Resume"
          >
            <span>CV</span>
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* Mobile-friendly horizontal navigation strip (visible on < md screens) */}
      <nav className="flex md:hidden items-center gap-4 text-[11px] font-mono text-zinc-400 pt-3 mt-3 border-t border-zinc-900/80 overflow-x-auto no-scrollbar select-none">
        <a href="#projects" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
          Projects
        </a>
        {hasReviews && (
          <a href="#testimonials" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Reviews
          </a>
        )}
        <a href="#experience" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
          Experience
        </a>
        <a href="#analytics" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
          Analytics
        </a>
      </nav>
    </header>
  );
};

export default Navbar;
