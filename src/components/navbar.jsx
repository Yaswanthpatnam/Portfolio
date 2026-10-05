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
          <div className="font-script text-2xl text-white font-bold leading-none tracking-wide">
            Yaswanth Babu
          </div>
          <div className="text-[11px] font-mono text-zinc-400 mt-1">
            Bangalore
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex items-center gap-3 sm:gap-5 text-xs font-mono text-zinc-400">
        <a href="#projects" className="hover:text-white transition-colors">
          Projects
        </a>
        <a href="#experience" className="hover:text-white transition-colors">
          Experience
        </a>
        <a href="#analytics" className="hover:text-white transition-colors">
          Analytics
        </a>
        <button
          onClick={onOpenResume}
          className="px-3 py-1 rounded border border-white/40 text-white hover:bg-white hover:text-black transition-all text-xs font-mono font-medium flex items-center gap-1 cursor-pointer"
        >
          <span>CV</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
