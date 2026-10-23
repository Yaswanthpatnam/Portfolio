import React, { useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, Sparkles } from "lucide-react";
import { playCardDealSound } from "../utils/cardSound";

const ratingDescriptions = {
  5: "Satisfied",
  4: "Good",
  3: "Average",
  2: "Not Bad",
  1: "Poor",
};

export const ReviewPortal = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [organization, setOrganization] = useState("");
  const [project, setProject] = useState("");
  const [rating, setRating] = useState(5.0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "YB";

  const currentLabel = ratingDescriptions[Math.round(rating)] || "Satisfied";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setIsSubmitting(true);

    const newReview = {
      id: `review-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || "Client",
      organization: organization.trim() || "Client Partner",
      project: project.trim() || "Collaborative Project",
      content: content.trim(),
      rating: parseFloat(rating),
      ratingLabel: currentLabel,
      year: new Date().getFullYear(),
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage so it is immediately visible upon redirect
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
      console.warn("Review submission error:", err);
    }

    playCardDealSound();
    setToast({
      title: "Thank you so much!",
      desc: "Your recommendation has been published. Redirecting to your card...",
    });

    // Seamless automatic redirect to the exact testimonials card deck viewport
    setTimeout(() => {
      window.location.href = "/#testimonials";
    }, 1100);
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-[#fafafa] p-4 sm:p-8 flex flex-col items-center justify-start">
      {/* Top Navigation */}
      <div className="w-full max-w-4xl mb-6 flex items-center justify-between text-xs font-mono">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors py-1.5 px-3 rounded-lg bg-zinc-900 border border-zinc-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Portfolio</span>
        </a>

        <div className="flex items-center gap-2 text-zinc-500 text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
          <span>Direct Client Portal</span>
        </div>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* Warm Personal Letter From Yaswanth */}
        <div className="relative rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-6 sm:p-8 space-y-3.5 shadow-2xl overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span className="uppercase tracking-wider">A Personal Note From Yaswanth</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            Thank you for collaborating with me.
          </h1>

          <p className="font-editorial text-[16px] sm:text-[18px] text-zinc-200 leading-relaxed font-light italic max-w-2xl">
            "Working together was an absolute pleasure. Your feedback means the world to me, and I deeply appreciate the trust and confidence you placed in our collaboration. I truly look forward to staying closely connected and building more impactful projects together in the future."
          </p>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-zinc-400 border-t border-zinc-800/80">
            <span>Software Engineer · Systems & Modern AI Workflows</span>
            <span className="text-zinc-200 font-semibold">— With warm regards, Yaswanth</span>
          </div>
        </div>

        {/* Main Recommendation Form & Live Real-Time Preview */}
        <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
              <div className="border-b border-zinc-800/80 pb-2">
                <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
                  Recommendation Form
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Your feedback will be featured on Yaswanth Babu's portfolio card deck.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-300 mb-1">
                    Your Full Name <span className="text-zinc-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. P. Obuleshwar Prasad"
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
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Director & Radiologist"
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
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Sree Keerthi Hospital"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-300 mb-1">
                    Project Name <span className="text-zinc-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    placeholder="e.g. Sree Keerthi Hospital Platform"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              {/* Traditional Star Rating (Zero Dropdown) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-mono text-zinc-300">
                    Experience Rating
                  </label>
                  <span className="text-[11px] font-mono text-white font-medium">
                    ★ {Number(rating).toFixed(1)} · {currentLabel}
                  </span>
                </div>

                {/* Traditional 5-Star Row */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = (hoverRating || rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className={`text-2xl transition-transform active:scale-125 cursor-pointer p-0.5 ${
                            active
                              ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                              : "text-zinc-700 hover:text-zinc-500"
                          }`}
                          aria-label={`${star} Stars`}
                        >
                          ★
                        </button>
                      );
                    })}
                  </div>

                  {/* Half-Star Quick Options */}
                  <div className="flex items-center gap-1">
                    {[5.0, 4.5, 4.0, 3.5, 2.5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setRating(val)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                          rating === val
                            ? "bg-white text-black font-semibold"
                            : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                        }`}
                      >
                        {val.toFixed(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5-Tier Scale Labels Displayed Below */}
                <div className="grid grid-cols-5 text-center text-[10px] font-mono text-zinc-500 pt-1.5">
                  <span>1: Poor</span>
                  <span>2: Not Bad</span>
                  <span>3: Average</span>
                  <span>4: Good</span>
                  <span>5: Satisfied</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-300 mb-1">
                  Your Recommendation & Feedback <span className="text-zinc-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share what it was like working together regarding communication, speed, technical quality, or project outcomes..."
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                  <span>Redirects directly to your live card upon submit</span>
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-mono text-xs font-semibold shadow-xl transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
                >
                  <span>{isSubmitting ? "Publishing..." : "Submit Recommendation"}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Right: Real-Time Live Card Preview with Storybook Quotes */}
            <div className="lg:col-span-5 space-y-2">
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                <span>LIVE CARD PREVIEW</span>
                <span className="text-zinc-400 text-[10px]">Real-Time Sync</span>
              </div>

              <div className="rounded-xl p-5 space-y-3 border border-zinc-800 shadow-xl relative overflow-hidden backdrop-blur-xl bg-gradient-to-b from-[#16161a] to-[#0a0a0d]">
                {/* Specular line */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center font-mono text-[11px] font-bold text-white shadow-sm shrink-0">
                      {initials}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-white">
                        {name.trim() || "Your Name"}
                      </div>
                      <div className="text-[11px] text-zinc-400 line-clamp-1">
                        {role.trim() || "Your Title"} ·{" "}
                        <span className="text-zinc-300">
                          {organization.trim() || "Organization"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/10 flex items-center gap-1 shrink-0">
                    <span>★ {Number(rating).toFixed(1)}</span>
                    <span className="text-zinc-500">· {currentLabel}</span>
                  </div>
                </div>

                {/* Double Storybook Quotations: Opening & Closing */}
                <div className="relative pl-4 pr-2 pt-1 pb-1">
                  <span className="absolute -top-1.5 left-0 font-serif text-2xl text-zinc-500 select-none pointer-events-none leading-none">
                    “
                  </span>

                  <p className="font-editorial text-[13px] sm:text-[14px] italic text-zinc-200 leading-[1.55] font-normal inline line-clamp-4">
                    {content.trim() ||
                      "Your testimonial text will appear here in this refined literary typeface with both opening and closing storybook quotations."}
                  </p>

                  <span className="inline-block font-serif text-xl text-zinc-500 select-none pointer-events-none leading-none ml-1">
                    ”
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-zinc-800/80">
                  <span className="text-zinc-400 truncate max-w-[70%]">
                    {project.trim() || organization.trim() || "Collaborative Project"}
                  </span>
                  <span>{new Date().getFullYear()}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-850 text-[10px] font-mono text-zinc-400 leading-relaxed">
                As soon as you submit, you will be smoothly redirected to Yaswanth's portfolio where your card will appear live on top of the deck.
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-xl border border-zinc-700 bg-zinc-950 text-xs font-mono text-white shadow-2xl transition-all duration-300 flex items-center gap-2.5 backdrop-blur">
          <div className="w-5 h-5 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-[10px]">
            <Check className="w-3 h-3 text-white" />
          </div>
          <div>
            <div className="font-semibold text-zinc-200">{toast.title}</div>
            <div className="text-zinc-400 text-[10px]">{toast.desc}</div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ReviewPortal;
