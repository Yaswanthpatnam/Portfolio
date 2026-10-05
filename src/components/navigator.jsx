import React from "react";
import { ArrowUpRight } from "lucide-react";

export const Navigator = ({ onOpenContact, onOpenResume }) => {
  return (
    <footer
      id="ocean-terminal"
      className="relative mt-20 pt-16 pb-24 overflow-hidden bg-black border-t border-zinc-900"
    >
      <div className="relative z-20 max-w-xl mx-auto px-6 text-center space-y-10 mb-20">
        {/* TERMINAL DESTINATION: Get In Touch (Spotlighted by Locomotive Headlight at Track End) */}
        <div id="get-in-touch-terminal" className="space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-zinc-950 text-[11px] font-mono text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
            <span>TERMINAL STATION // ARRIVAL</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Let's Connect
          </h3>

          <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-md mx-auto">
            Open for engineering roles, technical consultations & distributed systems architecture.
          </p>

          <div className="pt-2">
            <button
              id="btn-get-in-touch"
              type="button"
              onClick={onOpenContact}
              className="px-7 py-3 rounded-full bg-white hover:bg-zinc-200 text-black font-mono text-xs font-semibold transition-all shadow-[0_0_30px_rgba(255,255,255,0.45)] cursor-pointer"
            >
              Get in Touch ↗
            </button>
          </div>
        </div>

        {/* Social Accounts (Clean & Direct) */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-zinc-400 border-t border-zinc-900/80 pt-8">
          <a
            href="https://github.com/Yaswanthpatnam"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/yaswanth-patnam-2aa28b340/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="mailto:patnamyaswanth79@gmail.com"
            className="hover:text-white transition-colors"
          >
            Email
          </a>
          <button
            type="button"
            onClick={onOpenResume}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Resume.pdf
          </button>
        </div>

        {/* BHAGAVAD GITA VERSE (Chapter 2, Verse 47) */}
        <div className="pt-6 border-t border-zinc-900/80 space-y-3">
          {/* Sanskrit Verse */}
          <div className="text-zinc-300 font-serif text-sm sm:text-base tracking-widest leading-relaxed opacity-90 select-none">
            कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।<br />
            मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥
          </div>

          {/* English Translation */}
          <p className="text-xs text-zinc-500 font-light italic max-w-md mx-auto leading-relaxed">
            "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself the cause of results, nor be attached to inaction."
          </p>
          <span className="block text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
            — Bhagavad Gita 2.47
          </span>
        </div>
      </div>

      {/* Monochrome Animated Undulating Ocean Waves */}
      <div className="absolute bottom-0 left-0 w-full h-44 pointer-events-none overflow-hidden z-10">
        <svg
          className="wave-band wave-back"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C150,75 350,10 500,40 C650,75 900,15 1200,40 L1200,120 L0,120 Z"
            fill="#08080a"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        </svg>
        <svg
          className="wave-band wave-mid"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 C200,15 400,85 600,50 C800,15 1000,75 1200,50 L1200,120 L0,120 Z"
            fill="#0c0c0e"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="1"
          />
        </svg>
        <svg
          className="wave-band wave-fore"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C250,90 450,30 700,65 C950,100 1100,45 1200,60 L1200,120 L0,120 Z"
            fill="#000000"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.2"
          />
        </svg>
      </div>
    </footer>
  );
};

export default Navigator;
