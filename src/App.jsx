import React, { useEffect, useRef, useState, useCallback } from "react";
import Navbar from "./components/navbar";
import Header from "./components/header";
import Projects from "./components/projects";
import Experiences from "./components/experiences";
import Skills from "./components/skills";
import Navigator from "./components/navigator";
import ContactModal from "./components/addProjectModal";
import { X, FileText, Settings } from "lucide-react";

// Monotonic Catmull-Rom to Cubic Bezier Curve Converter with zero loop/cusp guarantee
function catmullRomToBezier(points, tension = 0.4) {
  if (points.length < 2) return "";
  const t = tension;
  let d = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : p2;

    let cp1x = p1.x + ((p2.x - p0.x) * t) / 3;
    let cp1y = p1.y + ((p2.y - p0.y) * t) / 3;

    let cp2x = p2.x - ((p3.x - p1.x) * t) / 3;
    let cp2y = p2.y - ((p3.y - p1.y) * t) / 3;

    // Strict monotonic Y clamping to mathematically guarantee zero loops, cusps, or reversals
    const dy = p2.y - p1.y;
    if (dy > 0) {
      cp1y = Math.max(p1.y, Math.min(p1.y + dy * 0.85, cp1y));
      cp2y = Math.max(cp1y, Math.min(p2.y, cp2y));
    }

    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

const DEFAULT_RESUME_URL =
  "https://drive.google.com/file/d/1DNXFfR2togGa4ipmtmrP7pifQ5FELnG1/view?usp=sharing";

export function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState(() => {
    try {
      return localStorage.getItem("portfolio_resume_url") || DEFAULT_RESUME_URL;
    } catch {
      return DEFAULT_RESUME_URL;
    }
  });
  const [isEditingResume, setIsEditingResume] = useState(false);
  const [inputResumeUrl, setInputResumeUrl] = useState(resumeUrl);

  // Train and Track DOM refs
  const trainRef = useRef(null);
  const trackRailsRef = useRef(null);
  const trackSleepersRef = useRef(null);
  const trackGlowRef = useRef(null);
  const originGroupRef = useRef(null);
  const endGroupRef = useRef(null);
  const totalLengthRef = useRef(0);

  // Pixel Dog DOM and animation refs
  const dogRef = useRef(null);
  const dogSvgRef = useRef(null);
  const dogPosRef = useRef({ x: 80, y: 80, targetX: 140, targetY: 140 });

  // 1. Build Railway Track Waypoints — strictly in margins & interstitial gaps, never obstructing text
  const buildTrackArchitecture = useCallback(() => {
    const docHeight = document.documentElement.scrollHeight;
    const docWidth = window.innerWidth;
    const mid = docWidth / 2;

    // Measure the exact boundary of the centered content column
    const contentEl = document.getElementById("main-content-column");
    let contentLeft = Math.max(0, mid - 336);
    let contentRight = Math.min(docWidth, mid + 336);

    if (contentEl) {
      const rect = contentEl.getBoundingClientRect();
      const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
      contentLeft = rect.left + scrollLeft;
      contentRight = rect.right + scrollLeft;
    }

    const isMobile = docWidth < 768;
    // Gutters placed comfortably in outer black margins outside the text column
    const leftGutter = isMobile ? 16 : Math.max(16, Math.round(contentLeft - 44));
    const rightGutter = isMobile ? 16 : Math.min(docWidth - 16, Math.round(contentRight + 44));

    // Starting Point: Cylindrical Depot (#track-origin)
    const originEl = document.getElementById("track-origin");
    let startX = isMobile ? 24 : Math.round(contentLeft + 24);
    let startY = 70;

    if (originEl) {
      const rect = originEl.getBoundingClientRect();
      const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      startX = Math.round(rect.left + scrollLeft + rect.width / 2);
      startY = Math.round(rect.top + scrollTop + rect.height / 2);
    }

    if (originGroupRef.current) {
      originGroupRef.current.setAttribute("transform", `translate(${startX}, ${startY})`);
    }

    // Dynamic Section Anchor Waypoints
    const heroEl = document.getElementById("hero-section");
    const projectsEl = document.getElementById("projects");
    const expEl = document.getElementById("experience");
    const analyticsEl = document.getElementById("analytics");
    const contactBtn = document.getElementById("btn-get-in-touch");

    const yHeroBottom = heroEl
      ? Math.round(heroEl.offsetTop + heroEl.offsetHeight)
      : Math.round(startY + 280);

    const yProjectsTop = projectsEl
      ? Math.round(projectsEl.offsetTop)
      : Math.round(yHeroBottom + 80);

    const projectsHeight = projectsEl ? projectsEl.offsetHeight : 600;
    const yProjectsMid = Math.round(yProjectsTop + projectsHeight * 0.5);
    const yProjectsBottom = projectsEl
      ? Math.round(projectsEl.offsetTop + projectsHeight)
      : Math.round(yProjectsTop + projectsHeight);

    const yExpTop = expEl
      ? Math.round(expEl.offsetTop)
      : Math.round(yProjectsBottom + 80);

    const expHeight = expEl ? expEl.offsetHeight : 400;
    const yExpBottom = expEl
      ? Math.round(expEl.offsetTop + expHeight)
      : Math.round(yExpTop + expHeight);

    const yAnalyticsTop = analyticsEl
      ? Math.round(analyticsEl.offsetTop)
      : Math.round(yExpBottom + 80);

    const analyticsHeight = analyticsEl ? analyticsEl.offsetHeight : 500;
    const yAnalyticsBottom = analyticsEl
      ? Math.round(analyticsEl.offsetTop + analyticsHeight)
      : Math.round(yAnalyticsTop + analyticsHeight);

    let btnX = mid;
    let btnY = docHeight - 320;
    if (contactBtn) {
      const rect = contactBtn.getBoundingClientRect();
      const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      btnX = Math.round(rect.left + scrollLeft + rect.width / 2);
      btnY = Math.round(rect.top + scrollTop + rect.height / 2);
    }

    // Terminal stop: to the left of the button, pointing straight horizontally at it
    const stopX = Math.round(isMobile ? btnX - 85 : btnX - 110);
    const stopY = Math.round(btnY);

    if (endGroupRef.current) {
      endGroupRef.current.setAttribute("transform", `translate(${stopX}, ${stopY})`);
    }

    // Construct strictly monotonic waypoints ensuring the track stays in gutters
    // and only crosses through empty vertical gaps between sections.
    const waypoints = [];
    let prevY = -Infinity;
    const addWaypoint = (x, targetY, minDelta = 20) => {
      const y = Math.max(Math.round(targetY), prevY + minDelta);
      prevY = y;
      waypoints.push({ x: Math.round(x), y });
    };

    addWaypoint(startX, startY, 0);
    // Smoothly exit depot into left outer margin before reaching hero text
    addWaypoint(leftGutter, startY + (isMobile ? 50 : 70), 25);
    // Run down the left gutter alongside hero text — 100% text clearance
    addWaypoint(leftGutter, yHeroBottom, 25);

    if (isMobile) {
      // On narrow mobile screens, stay reliably in the left padding margin
      addWaypoint(leftGutter, yProjectsTop, 25);
      addWaypoint(leftGutter, yProjectsMid, 25);
      addWaypoint(leftGutter, yProjectsBottom, 25);
      addWaypoint(leftGutter, yExpTop, 25);
      addWaypoint(leftGutter, yAnalyticsTop, 25);
      addWaypoint(leftGutter, yAnalyticsBottom, 25);
      addWaypoint((leftGutter + stopX) * 0.5, yAnalyticsBottom + (stopY - yAnalyticsBottom) * 0.5, 25);
      addWaypoint(stopX - 60, stopY - 8, 20);
      addWaypoint(stopX - 20, stopY - 1, 5);
      addWaypoint(stopX, stopY, 1);
    } else {
      // On desktop / tablet:
      // 1. Cross through empty vertical gap between Hero and Projects
      addWaypoint(mid, yHeroBottom + (yProjectsTop - yHeroBottom) * 0.5, 25);
      // 2. Run down the right gutter alongside Projects cards
      addWaypoint(rightGutter, yProjectsTop, 25);
      addWaypoint(rightGutter, yProjectsMid, 25);
      // 3. Cross through empty vertical gap between Projects and Experience
      addWaypoint(mid, yProjectsBottom + (yExpTop - yProjectsBottom) * 0.5, 25);
      // 4. Run down the left gutter alongside Experience & Analytics
      addWaypoint(leftGutter, yExpTop, 25);
      addWaypoint(leftGutter, yAnalyticsTop, 25);
      // 5. Approach arrival terminal and align horizontally into Get in Touch button
      addWaypoint((leftGutter + stopX) * 0.5, yAnalyticsBottom + (stopY - yAnalyticsBottom) * 0.5, 25);
      addWaypoint(stopX - 70, stopY - 10, 20);
      addWaypoint(stopX - 25, stopY - 1, 5);
      addWaypoint(stopX, stopY, 1);
    }

    const pathD = catmullRomToBezier(waypoints, 0.4);

    if (trackSleepersRef.current) trackSleepersRef.current.setAttribute("d", pathD);
    if (trackRailsRef.current) trackRailsRef.current.setAttribute("d", pathD);
    if (trackGlowRef.current) trackGlowRef.current.setAttribute("d", pathD);

    if (trackRailsRef.current) {
      totalLengthRef.current = trackRailsRef.current.getTotalLength();
    }
  }, []);

  // Helper: Binary search for distance along path matching target vertical position Y
  const getDistAtY = (targetY, totalLen, path) => {
    if (!totalLen || !path) return 0;
    let low = 0;
    let high = totalLen;
    let bestDist = (targetY / (document.documentElement.scrollHeight || 1)) * totalLen;
    let bestDiff = Infinity;

    for (let i = 0; i < 16; i++) {
      const mid = (low + high) / 2;
      const pt = path.getPointAtLength(mid);
      const diff = Math.abs(pt.y - targetY);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestDist = mid;
      }
      if (pt.y < targetY) {
        low = mid;
      } else {
        high = mid;
      }
    }
    return bestDist;
  };

  // 2. Synchronize Train Along Track — Always locked comfortably in user's viewport eye view
  const updateTrainOnScroll = useCallback(() => {
    if (!totalLengthRef.current || !trackRailsRef.current || !trainRef.current) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const vh = window.innerHeight;
    const maxScroll = Math.max(document.documentElement.scrollHeight - vh, 1);
    const scrollProgress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);

    const startPt = trackRailsRef.current.getPointAtLength(0);
    const endPt = trackRailsRef.current.getPointAtLength(totalLengthRef.current);
    const startY = startPt.y;
    const stopY = endPt.y;

    let dist;
    let isTerminal = false;

    if (scrollProgress >= 0.985) {
      // At terminal stop: exactly at end of track
      dist = totalLengthRef.current;
      isTerminal = true;
    } else if (scrollTop <= 15) {
      // At top: parked at origin depot
      dist = 0;
    } else {
      // While scrolling: target 42% from top of screen (natural eye view)
      const eyeViewY = scrollTop + vh * 0.42;
      const targetY = Math.max(startY, Math.min(stopY, eyeViewY));
      dist = getDistAtY(targetY, totalLengthRef.current, trackRailsRef.current);
    }

    const pt = trackRailsRef.current.getPointAtLength(dist);

    let angle = 0;
    if (isTerminal) {
      // Spotlight directly horizontally onto the "Get in Touch" button
      angle = 0;
    } else {
      const nextDist = Math.min(dist + 5, totalLengthRef.current);
      const ptNext = trackRailsRef.current.getPointAtLength(nextDist);
      angle = Math.atan2(ptNext.y - pt.y, ptNext.x - pt.x) * (180 / Math.PI);
    }

    // Centered on the 38x20px locomotive (origin: 19px, 10px)
    trainRef.current.style.transform = `translate3d(${pt.x - 19}px, ${pt.y - 10}px, 0) rotate(${angle}deg)`;
  }, []);

  // Set up listeners for Track & Train
  useEffect(() => {
    const handleResize = () => {
      buildTrackArchitecture();
      updateTrainOnScroll();
    };

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateTrainOnScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial setup with timeouts to ensure complete rendering
    buildTrackArchitecture();
    updateTrainOnScroll();

    const t1 = setTimeout(() => {
      buildTrackArchitecture();
      updateTrainOnScroll();
    }, 150);

    const t2 = setTimeout(() => {
      buildTrackArchitecture();
      updateTrainOnScroll();
    }, 500);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [buildTrackArchitecture, updateTrainOnScroll]);

  // 3. Pixel Dog Companion Movement
  useEffect(() => {
    let animId;
    const handleMouseMove = (e) => {
      dogPosRef.current.targetX = e.clientX + 16;
      dogPosRef.current.targetY = e.clientY + 16;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const animateDog = () => {
      const { targetX, targetY } = dogPosRef.current;
      let { x, y } = dogPosRef.current;

      const dx = targetX - x;
      const dy = targetY - y;
      const dist = Math.hypot(dx, dy);

      if (dist > 22) {
        const speed = Math.min(dist * 0.13, 11);
        x += (dx / dist) * speed;
        y += (dy / dist) * speed;
        dogPosRef.current.x = x;
        dogPosRef.current.y = y;

        if (dogSvgRef.current) {
          dogSvgRef.current.style.transform = dx < 0 ? "scaleX(-1)" : "scaleX(1)";
        }
      }

      if (dogRef.current) {
        dogRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      animId = requestAnimationFrame(animateDog);
    };

    animId = requestAnimationFrame(animateDog);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-black text-[#e4e4e7] overflow-x-hidden selection:bg-white selection:text-black">
      {/* Interactive Desktop Pixel Dog Companion */}
      <div id="dog-companion" ref={dogRef}>
        <svg
          ref={dogSvgRef}
          className="dog-svg"
          viewBox="0 0 34 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="8" y="13" width="16" height="11" rx="2" fill="#d4d4d8" />
          <rect x="8" y="16" width="6" height="7" rx="1" fill="#ffffff" />
          <rect x="18" y="8" width="11" height="10" rx="2" fill="#d4d4d8" />
          <rect x="17" y="7" width="3" height="6" rx="1" fill="#71717a" />
          <rect x="27" y="7" width="3" height="6" rx="1" fill="#71717a" />
          <rect x="25" y="12" width="6" height="5" rx="1" fill="#ffffff" />
          <rect x="29" y="12" width="2" height="2" rx="0.5" fill="#09090b" />
          <rect x="23" y="10" width="2" height="2" rx="0.5" fill="#09090b" />
          <rect x="9" y="24" width="3" height="4" rx="0.5" fill="#52525b" />
          <rect x="14" y="24" width="3" height="4" rx="0.5" fill="#52525b" />
          <rect x="20" y="24" width="3" height="4" rx="0.5" fill="#52525b" />
          <path
            className="dog-tail"
            d="M8 15 C5 13 4 10 6 7"
            stroke="#d4d4d8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* 2D Locomotive with Soft Feathered Front Headlight Searchlight (Behind text) */}
      <div id="train-engine" ref={trainRef}>
        <div className="headlight-cone-ambient" />
        <div className="headlight-cone" />
        <div className="headlight-core-flare" />

        {/* 2D Locomotive SVG */}
        <svg
          viewBox="0 0 38 20"
          fill="none"
          className="w-full h-full relative"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="2"
            y="4"
            width="30"
            height="12"
            rx="2"
            fill="#141416"
            stroke="#71717a"
            strokeWidth="1.2"
          />
          <rect x="23" y="6" width="6" height="5" rx="1" fill="#ffffff" opacity="0.95" />
          <rect x="15" y="6" width="4" height="5" rx="0.5" fill="#71717a" opacity="0.6" />
          <rect x="5" y="1" width="3" height="4" rx="0.5" fill="#a1a1aa" />
          <circle cx="8" cy="16" r="2.5" fill="#09090b" stroke="#71717a" strokeWidth="1" />
          <circle cx="17" cy="16" r="2.5" fill="#09090b" stroke="#71717a" strokeWidth="1" />
          <circle cx="26" cy="16" r="2.5" fill="#09090b" stroke="#71717a" strokeWidth="1" />
          <circle cx="33" cy="10" r="2" fill="#ffffff" />
        </svg>
      </div>

      {/* Full-Page SVG 2D Railway Track Overlay */}
      <svg id="railway-svg">
        <g id="track-terminal-origin" ref={originGroupRef}>
          <circle cx="0" cy="0" r="14" fill="#141416" stroke="#52525b" strokeWidth="1.5" />
          <circle
            cx="0"
            cy="0"
            r="9"
            fill="none"
            stroke="#a1a1aa"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
        </g>
        <g id="track-terminal-end" ref={endGroupRef}>
          <line
            x1="0"
            y1="-12"
            x2="0"
            y2="12"
            stroke="#e4e4e7"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="0" cy="0" r="3.5" fill="#ffffff" />
        </g>
        <path
          id="track-path-sleepers"
          ref={trackSleepersRef}
          className="track-sleepers"
          d=""
        />
        <path
          id="track-path-rails"
          ref={trackRailsRef}
          className="track-rails"
          d=""
        />
        <path
          id="track-path-glow"
          ref={trackGlowRef}
          className="track-beam-glow"
          d=""
        />
      </svg>

      {/* Main Content Layout Container */}
      <div id="main-content-column" className="relative z-10 max-w-2xl mx-auto px-6 py-8 space-y-16 sm:space-y-20">
        <Navbar onOpenResume={() => setIsResumeOpen(true)} />
        <Header />
        <Projects />
        <Experiences />
        <Skills />
        <Navigator
          onOpenContact={() => setIsContactOpen(true)}
          onOpenResume={() => setIsResumeOpen(true)}
        />
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Resume Modal */}
      {isResumeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-opacity duration-200"
          onClick={() => setIsResumeOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white" />
                <h3 className="font-mono text-xs font-semibold text-white">
                  CURRICULUM VITAE // 2026.PDF
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsResumeOpen(false)}
                className="text-zinc-400 hover:text-white font-mono text-xs p-1"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 pt-2 text-xs font-mono text-zinc-300">
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-2">
                <div className="text-sm font-semibold text-white">
                  Yaswanth Babu 
                </div>
                <div className="text-xs text-zinc-400">
                  Software Engineer · Systems & Modern AI Workflows · Bangalore
                </div>
              </div>

              <div className="space-y-2 text-zinc-400">
                <p>
                  • Core Focus: Backend systems, distributed architecture, Django REST, React.js.
                </p>
                <p>
                  • Experience: Edunoverse Tech Solutions (Web Development Intern).
                </p>
              </div>

              {/* In-App Resume URL Updater */}
              {isEditingResume && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (inputResumeUrl.trim()) {
                      setResumeUrl(inputResumeUrl.trim());
                      try {
                        localStorage.setItem("portfolio_resume_url", inputResumeUrl.trim());
                      } catch {}
                      setIsEditingResume(false);
                    }
                  }}
                  className="p-3 rounded-xl border border-zinc-700 bg-zinc-900/90 space-y-2.5"
                >
                  <label className="block text-[11px] font-mono text-zinc-300">
                    Paste New Resume / Drive URL:
                  </label>
                  <input
                    type="url"
                    required
                    value={inputResumeUrl}
                    onChange={(e) => setInputResumeUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3 py-1.5 rounded bg-zinc-950 border border-zinc-700 text-xs text-white focus:outline-none focus:border-white"
                  />
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditingResume(false)}
                      className="px-3 py-1 rounded text-zinc-400 hover:text-white text-xs font-mono"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1 rounded bg-white text-black font-mono text-xs font-semibold hover:bg-zinc-200"
                    >
                      Save Link
                    </button>
                  </div>
                </form>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setInputResumeUrl(resumeUrl);
                    setIsEditingResume(!isEditingResume);
                  }}
                  className="text-zinc-500 hover:text-zinc-300 font-mono text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                  title="Update the resume link directly without editing code"
                >
                  <Settings className="w-3 h-3" />
                  <span>{isEditingResume ? "Close Editor" : "Change Link"}</span>
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-1.5 text-xs font-mono"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Open Resume ↗</span>
                  </a>
                </div>
              </div>

              {/* Tip Box */}
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-[10px] text-zinc-400 leading-relaxed font-mono">
                <span className="text-white font-semibold">💡 Google Drive Pro-Tip:</span> In Google Drive, right-click your file → <i>File information</i> → <i>Manage versions</i> → <i>Upload new version</i>. Google Drive replaces the file while preserving the exact same link permanently!
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
