import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Link2, Copy, Check } from "lucide-react";
import { playCardDealSound } from "../utils/cardSound";

const ratingDescriptions = {
  5: "Satisfied",
  4: "Good",
  3: "Average",
  2: "Not Bad",
  1: "Poor",
};

export const FeedbackModal = ({ isOpen, onClose, onSuccess }) => {
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formOrg, setFormOrg] = useState("");
  const [formProject, setFormProject] = useState("");
  const [formRating, setFormRating] = useState(5.0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formContent, setFormContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyClientLink = () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/review` : "https://yaswanth-babu.vercel.app/review";
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  // Lock body scroll completely when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  if (typeof document === "undefined") return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim() || !formContent.trim()) return;

    setIsSubmitting(true);
    const parsedRating = parseFloat(formRating) || 5.0;
    const ratingLabel = ratingDescriptions[Math.round(parsedRating)] || "Satisfied";

    const newReview = {
      id: `review-${Date.now()}`,
      name: formName.trim(),
      role: formRole.trim() || "Client",
      organization: formOrg.trim() || "Partner",
      project: formProject.trim() || "Collaborative Project",
      content: formContent.trim(),
      rating: parsedRating,
      ratingLabel,
      year: new Date().getFullYear(),
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage immediately
    try {
      const existing = JSON.parse(localStorage.getItem("portfolio_user_reviews") || "[]");
      localStorage.setItem("portfolio_user_reviews", JSON.stringify([newReview, ...existing]));
    } catch {}

    // Cloud persistence to Upstash Redis
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });
    } catch (err) {
      console.warn("Background review sync:", err);
    }

    playCardDealSound();
    setIsSubmitting(false);
    onClose();

    if (onSuccess) {
      onSuccess(newReview);
    }

    // Reset form
    setFormName("");
    setFormRole("");
    setFormOrg("");
    setFormProject("");
    setFormContent("");
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-xl transition-opacity duration-200"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#0e0e12] p-5 sm:p-6 shadow-2xl space-y-4 max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white" />
            <h3 className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
              PROVIDE YOUR FEEDBACK
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 cursor-pointer transition-colors"
            aria-label="Close Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warm Greeting From Yaswanth */}
        <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-1">
          <div className="text-[11px] font-mono text-zinc-300 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
            <span>A Warm Welcome</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            Thank you for collaborating with me! Your perspective and feedback mean a great deal. I truly value the trust we built, and I hope we stay closely connected for more impactful projects in the future.
          </p>
        </div>

        {/* Shareable Direct Client Link Bar */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-400 min-w-0">
            <Link2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="text-[11px] text-zinc-300 shrink-0">Client URL:</span>
            <span className="text-[11px] text-zinc-500 truncate">
              {typeof window !== "undefined" ? `${window.location.origin}/review` : "https://yaswanth-babu.vercel.app/review"}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyClientLink}
            className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-white text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer shrink-0 ml-2"
          >
            {copiedLink ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3 text-zinc-400" />}
            <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-zinc-300 mb-1">
                Your Full Name <span className="text-zinc-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-300 mb-1">
                Role & Title <span className="text-zinc-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                placeholder="e.g. Director / Co-founder"
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-zinc-300 mb-1">
                Organization / Company <span className="text-zinc-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formOrg}
                onChange={(e) => setFormOrg(e.target.value)}
                placeholder="e.g. Sree Keerthi Hospital"
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-300 mb-1">
                Project Reference <span className="text-zinc-500 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={formProject}
                onChange={(e) => setFormProject(e.target.value)}
                placeholder="e.g. Web Platform Architecture"
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          {/* Traditional Star Rating */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono text-zinc-300">
                Experience Rating
              </label>
              <span className="text-[11px] font-mono text-zinc-200 font-medium">
                ★ {Number(formRating).toFixed(1)} · {ratingDescriptions[Math.round(formRating)] || "Satisfied"}
              </span>
            </div>

            {/* Traditional 5-Star Row */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950 border border-zinc-800">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || formRating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setFormRating(star)}
                      className={`text-xl transition-all active:scale-125 cursor-pointer p-0.5 ${
                        active
                          ? "text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.45)]"
                          : "text-zinc-700 hover:text-zinc-500"
                      }`}
                      aria-label={`${star} Stars`}
                    >
                      ★
                    </button>
                  );
                })}
              </div>

              {/* Half-Star Quick Selectors */}
              <div className="flex items-center gap-1">
                {[5.0, 4.5, 4.0, 3.5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setFormRating(val)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-colors ${
                      formRating === val
                        ? "bg-white text-black font-semibold"
                        : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                    }`}
                  >
                    {val.toFixed(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Explicit 5-Tier Labels Displayed Below */}
            <div className="grid grid-cols-5 text-center text-[9px] font-mono text-zinc-500 pt-1.5">
              <span>1: Poor</span>
              <span>2: Not Bad</span>
              <span>3: Average</span>
              <span>4: Good</span>
              <span>5: Satisfied</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-300 mb-1">
              Testimonial Feedback <span className="text-zinc-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              placeholder="Share your experience working with Yaswanth regarding communication, technical execution, or project outcomes..."
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
            <span className="text-[10px] font-mono text-zinc-500">
              Published live to the card deck
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white font-mono text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-mono text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Publishing..." : "Submit Feedback"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default FeedbackModal;
