import React, { useEffect, useState } from "react";
import Navbar from "./components/navbar";
import Header from "./components/header";
import Projects from "./components/projects";
import Testimonials from "./components/testimonials";
import Experiences from "./components/experiences";
import Skills from "./components/skills";
import ReviewPortal from "./components/reviewPortal";
import FeedbackModal from "./components/feedbackModal";
import Navigator from "./components/navigator";
import ContactModal from "./components/addProjectModal";
import { X, FileText, Settings } from "lucide-react";

const DEFAULT_RESUME_URL =
  "https://drive.google.com/file/d/1DNXFfR2togGa4ipmtmrP7pifQ5FELnG1/view?usp=sharing";

export function App() {
  const checkIsReviewRoute = () => {
    if (typeof window === "undefined") return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return (
      path === "/review" ||
      path.startsWith("/review/") ||
      search.includes("mode=review") ||
      hash === "#review" ||
      hash === "#reviews" ||
      hash === "#feedback" ||
      hash === "#review-portal"
    );
  };

  const [isReviewRoute, setIsReviewRoute] = useState(checkIsReviewRoute);

  useEffect(() => {
    const handleRouteCheck = () => {
      setIsReviewRoute(checkIsReviewRoute());
    };
    window.addEventListener("popstate", handleRouteCheck);
    window.addEventListener("hashchange", handleRouteCheck);
    return () => {
      window.removeEventListener("popstate", handleRouteCheck);
      window.removeEventListener("hashchange", handleRouteCheck);
    };
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 350);
    }
  }, [isReviewRoute]);

  const [reviews, setReviews] = useState(() => {
    try {
      const cached = localStorage.getItem("portfolio_user_reviews");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return [];
  });

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const hasReviews = Boolean(reviews && reviews.length > 0);

  // Sync with live Upstash database
  useEffect(() => {
    let isMounted = true;
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews");
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.reviews) && isMounted) {
          const localCached = (() => {
            try {
              return JSON.parse(localStorage.getItem("portfolio_user_reviews") || "[]");
            } catch {
              return [];
            }
          })();
          const merged = [...data.reviews, ...localCached];
          const unique = Array.from(new Map(merged.map((m) => [m.id, m])).values());
          setReviews(unique);
        }
      } catch (err) {
        console.warn("Live reviews fetch fallback:", err);
      }
    };
    fetchReviews();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleNewReview = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
    setTimeout(() => {
      const el = document.getElementById("testimonials");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 250);
  };

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

  if (isReviewRoute) {
    return (
      <ReviewPortal
        onBack={() => {
          window.history.pushState({}, "", "/");
          setIsReviewRoute(false);
        }}
      />
    );
  }

  return (
    <main className="relative min-h-screen bg-black text-[#e4e4e7] overflow-x-hidden selection:bg-white selection:text-black">
      {/* Main Content Layout Container */}
      <div id="main-content-column" className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-14 sm:space-y-20">
        <Navbar
          onOpenResume={() => setIsResumeOpen(true)}
          onOpenFeedback={() => {
            window.history.pushState({}, "", "/review");
            setIsReviewRoute(true);
          }}
          hasReviews={hasReviews}
        />
        <Header />
        <Projects />
        {hasReviews && (
          <Testimonials
            reviews={reviews}
            onOpenFeedback={() => setIsFeedbackOpen(true)}
          />
        )}
        <Experiences sectionNumber={hasReviews ? "[03]" : "[02]"} />
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

      {/* Feedback Modal (Mounted via Portal onto document.body with z-[100]) */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSuccess={handleNewReview}
      />

      {/* Resume Modal */}
      {isResumeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md transition-opacity duration-200"
          onClick={() => setIsResumeOpen(false)}
        >
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-5 sm:p-6 shadow-2xl space-y-4"
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
