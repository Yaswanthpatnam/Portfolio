import React from "react";
import { ArrowUpRight } from "lucide-react";

export const Navbar = ({ onOpenResume }) => {
  return (
    <header className="relative z-20 flex items-center justify-between border-b border-zinc-800/80 pb-5 pt-2">
      <div className="flex items-center gap-3">
        {/* Cylindrical Starting Point Node / Terminal Origin for Railway Track & Train */}
        <div
          id="track-origin"
          className="relative flex items-center justify-center w-6 h-6 flex-shrink-0 cursor-default"
          title="Railway Line Origin Terminal"
        >
          <span className="absolute w-8 h-8 rounded-full bg-white/15 animate-ping opacity-25 pointer-events-none" />
          <div className="w-5 h-5 rounded-full border border-zinc-500 bg-zinc-950 flex items-center justify-center shadow-[0_0_12px_rgba(255,255,255,0.4)]">
            <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)]" />
          </div>
        </div>

        <div>
          <div className="font-script text-xl sm:text-2xl text-white font-bold leading-none tracking-wide whitespace-nowrap">
            Yaswanth Babu
          </div>
          <div className="text-[11px] font-mono text-zinc-400 mt-1">
            Bangalore
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex items-center gap-2.5 sm:gap-5 text-[11px] sm:text-xs font-mono text-zinc-400 shrink-0">
        <a href="#projects" className="hover:text-white transition-colors whitespace-nowrap">
          Projects
        </a>
        <a href="#experience" className="hover:text-white transition-colors whitespace-nowrap">
          Experience
        </a>
        <a href="#analytics" className="hover:text-white transition-colors whitespace-nowrap">
          Analytics
        </a>
        <button
          onClick={onOpenResume}
          className="px-2.5 sm:px-3 py-1 rounded border border-white/40 text-white hover:bg-white hover:text-black transition-all text-[11px] sm:text-xs font-mono font-medium flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>CV</span>
          <ArrowUpRight className="w-3 h-3 shrink-0" />
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
