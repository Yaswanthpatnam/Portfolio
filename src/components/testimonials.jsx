import React, { useState, useEffect, useRef } from "react";
import { playCardDealSound, isSoundEnabled, setSoundEnabled } from "../utils/cardSound";
import { Volume2, VolumeX, Share2, Plus, ChevronLeft, ChevronRight, Check } from "lucide-react";

export const Testimonials = ({ reviews = [], onOpenFeedback }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [copiedLink, setCopiedLink] = useState(false);

  // Swipe gesture refs
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const topCardRef = useRef(null);

  const total = Array.isArray(reviews) ? reviews.length : 0;

  // Safeguard: Ensure currentIndex is always valid when reviews change
  useEffect(() => {
    if (currentIndex >= total && total > 0) {
      setCurrentIndex(0);
    }
  }, [currentIndex, total]);

  // Safeguard: Always ensure top card is visually reset whenever currentIndex changes
  useEffect(() => {
    if (topCardRef.current) {
      topCardRef.current.style.transition = "none";
      topCardRef.current.style.transform = "translate(0px, 0px) scale(1) rotate(0deg)";
      topCardRef.current.style.opacity = "1";
    }
  }, [currentIndex]);

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const showToast = (title, desc) => {
    setToastMessage({ title, desc });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const dealNext = () => {
    if (total <= 1) return;
    playCardDealSound();
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const dealPrev = () => {
    if (total <= 1) return;
    playCardDealSound();
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const jumpTo = (idx) => {
    if (total <= 1 || idx === currentIndex) return;
    playCardDealSound();
    setCurrentIndex(idx % total);
  };

  const handleToggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    setSoundEnabled(nextState);
    if (nextState) playCardDealSound();
  };

  const handleCopyClientLink = () => {
    const url = `${window.location.origin}/review`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopiedLink(true);
        showToast("Client Link Copied", `Direct review portal: ${url}`);
        setTimeout(() => setCopiedLink(false), 2500);
      })
      .catch(() => {
        showToast("Review Link", url);
      });
  };

  // Pointer drag/swipe events for physical card deck
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    currentXRef.current = e.clientX;
    if (topCardRef.current) {
      topCardRef.current.style.transition = "none";
      try {
        topCardRef.current.setPointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !topCardRef.current) return;
    currentXRef.current = e.clientX;
    const deltaX = currentXRef.current - startXRef.current;
    const rotation = deltaX * 0.04;
    topCardRef.current.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current || !topCardRef.current) return;
    isDraggingRef.current = false;

    try {
      if (topCardRef.current.hasPointerCapture(e.pointerId)) {
        topCardRef.current.releasePointerCapture(e.pointerId);
      }
    } catch {}

    const deltaX = currentXRef.current - startXRef.current;
    const threshold = 50;

    // IF ONLY 1 CARD IN DECK: Smoothly spring snap back! Never fly off screen.
    if (total <= 1) {
      playCardDealSound();
      topCardRef.current.style.transition = "transform 360ms cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      topCardRef.current.style.transform = "translate(0px, 0px) scale(1) rotate(0deg)";
      topCardRef.current.style.opacity = "1";
      return;
    }

    if (deltaX > threshold) {
      // Swiped Right -> Deal next card
      playCardDealSound();
      topCardRef.current.style.transition = "transform 220ms cubic-bezier(0.4, 0, 0.2, 1), opacity 220ms ease";
      topCardRef.current.style.transform = "translateX(460px) rotate(18deg)";
      topCardRef.current.style.opacity = "0";

      setTimeout(() => {
        if (topCardRef.current) {
          topCardRef.current.style.transition = "none";
          topCardRef.current.style.transform = "translate(0px, 0px) scale(1) rotate(0deg)";
          topCardRef.current.style.opacity = "1";
        }
        setCurrentIndex((prev) => (prev + 1) % total);
      }, 210);
    } else if (deltaX < -threshold) {
      // Swiped Left -> Deal next card
      playCardDealSound();
      topCardRef.current.style.transition = "transform 220ms cubic-bezier(0.4, 0, 0.2, 1), opacity 220ms ease";
      topCardRef.current.style.transform = "translateX(-460px) rotate(-18deg)";
      topCardRef.current.style.opacity = "0";

      setTimeout(() => {
        if (topCardRef.current) {
          topCardRef.current.style.transition = "none";
          topCardRef.current.style.transform = "translate(0px, 0px) scale(1) rotate(0deg)";
          topCardRef.current.style.opacity = "1";
        }
        setCurrentIndex((prev) => (prev + 1) % total);
      }, 210);
    } else {
      // Snap back smoothly
      topCardRef.current.style.transition = "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)";
      topCardRef.current.style.transform = "translate(0px, 0px) scale(1) rotate(0deg)";
      topCardRef.current.style.opacity = "1";
    }
  };

  const handlePointerCancel = () => {
    if (!isDraggingRef.current || !topCardRef.current) return;
    isDraggingRef.current = false;
    topCardRef.current.style.transition = "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)";
    topCardRef.current.style.transform = "translate(0px, 0px) scale(1) rotate(0deg)";
    topCardRef.current.style.opacity = "1";
  };

  // Prevent ghost duplicate cards: stack offsets adapt to exact item count
  const stackOffsets = total === 1 ? [0] : total === 2 ? [1, 0] : [2, 1, 0];
  const safeCurrentIndex = currentIndex < total ? currentIndex : 0;

  return (
    <section id="testimonials" className="relative z-10 space-y-3 pt-2 scroll-mt-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[var(--border)] pb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-zinc-500 font-semibold">[02]</span>
          <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold flex items-center gap-2">
            <span>CLIENT TESTIMONIALS</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 font-normal">
              {safeCurrentIndex + 1}/{total}
            </span>
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Audio toggle button with Lucide SVG */}
          <button
            type="button"
            onClick={handleToggleSound}
            className="p-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title={soundOn ? "Mute Card Audio" : "Enable Card Audio"}
            aria-label="Toggle Sound"
          >
            {soundOn ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
            )}
          </button>

          {/* Copy Direct Review URL with Lucide icon */}
          <button
            type="button"
            onClick={handleCopyClientLink}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white font-mono text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Copy link to send to clients (/review)"
          >
            {copiedLink ? (
              <>
                <Check className="w-3 h-3 text-zinc-200" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3 h-3 text-zinc-400" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          {/* CTA: Provide Feedback */}
          <button
            type="button"
            onClick={onOpenFeedback}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-mono text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(255,255,255,0.15)] active:scale-95 shrink-0"
          >
            <Plus className="w-3 h-3 text-black stroke-[2.5]" />
            <span>Provide feedback</span>
          </button>
        </div>
      </div>

      {/* Sleek, Compact 3D Playing Card Deck Stage */}
      <div className="relative pt-1">
        <div
          className="relative select-none"
          style={{ perspective: "1200px", height: "235px" }}
        >
          {/* Render stack without duplicates */}
          {stackOffsets.map((offset) => {
            const itemIndex = (safeCurrentIndex + offset) % total;
            const item = reviews[itemIndex];
            if (!item) return null;
            const isTop = offset === 0;

            const translateY = offset * 8;
            const scale = 1 - offset * 0.035;
            const opacity = offset === 0 ? 1 : offset === 1 ? 0.72 : 0.42;
            const zIndex = 30 - offset * 10;
            const initials = item.name
              ? item.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
              : "YB";

            return (
              <div
                key={`${item.id || itemIndex}-${offset}`}
                ref={isTop ? topCardRef : null}
                onPointerDown={isTop ? handlePointerDown : null}
                onPointerMove={isTop ? handlePointerMove : null}
                onPointerUp={isTop ? handlePointerUp : null}
                onPointerCancel={isTop ? handlePointerCancel : null}
                onPointerLeave={isTop ? handlePointerCancel : null}
                className={`absolute inset-0 rounded-xl p-4 sm:p-5 flex flex-col justify-between border border-white/10 shadow-xl backdrop-blur-xl select-none ${
                  isTop ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
                }`}
                style={{
                  background: "linear-gradient(180deg, rgba(20, 20, 24, 0.98) 0%, rgba(10, 10, 13, 0.99) 100%)",
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  opacity,
                  zIndex,
                  transformOrigin: "50% 120%",
                  willChange: "transform, opacity",
                  touchAction: isTop ? "none" : "auto",
                }}
              >
                {/* Specular Top Edge */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                <div className="space-y-2.5">
                  {/* Top Row: Avatar, Name, Organization, Monochromatic Rating Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700/80 flex items-center justify-center font-mono text-[11px] font-bold text-white shadow-sm shrink-0">
                        {initials}
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-white tracking-tight">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          {item.role} · <span className="text-zinc-300">{item.organization}</span>
                        </div>
                      </div>
                    </div>

                    {/* Monochromatic Rating Badge */}
                    <div className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/10 flex items-center gap-1 shrink-0">
                      <span>★ {Number(item.rating || 5.0).toFixed(1)}</span>
                      <span className="text-zinc-500">· {item.ratingLabel || "Satisfied"}</span>
                    </div>
                  </div>

                  {/* Double Storybook Quotations: Opening & Closing (Monochrome) */}
                  <div className="relative pl-4 pr-2 pt-0.5">
                    {/* Opening Storybook Quote */}
                    <span className="absolute -top-1.5 left-0 font-serif text-2xl text-zinc-500 select-none pointer-events-none leading-none">
                      “
                    </span>

                    <p className="font-editorial text-[13px] sm:text-[14px] text-zinc-200 leading-[1.55] font-normal inline line-clamp-3">
                      {item.content}
                    </p>

                    {/* Closing Storybook Quote */}
                    <span className="inline-block font-serif text-xl text-zinc-500 select-none pointer-events-none leading-none ml-1">
                      ”
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Project Reference & Year */}
                <div className="flex items-center justify-between text-[10px] font-mono pt-2 border-t border-zinc-800/80">
                  <span className="text-zinc-400 truncate max-w-[70%]">
                    {item.project || item.organization}
                  </span>
                  <span className="text-zinc-500 shrink-0">{item.year || 2026}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stack Navigation Controls & Swipe Indicator */}
        <div className="flex items-center justify-between pt-2.5 px-1 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
            <span className="text-[11px] text-zinc-400">
              {total > 1 ? "Swipe card or deal next" : "Client Recommendation"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={total <= 1}
              onClick={dealPrev}
              className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-zinc-800 disabled:hover:text-zinc-500"
              aria-label="Previous Testimonial Card"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1 px-1">
              {reviews.map((_, idx) => (
                <span
                  key={idx}
                  onClick={() => jumpTo(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    total > 1 ? "cursor-pointer" : "cursor-default"
                  } ${
                    idx === safeCurrentIndex
                      ? "bg-white w-3.5"
                      : "bg-zinc-700 hover:bg-zinc-500 w-1.5"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              disabled={total <= 1}
              onClick={dealNext}
              className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-zinc-800 disabled:hover:text-zinc-500"
              aria-label="Next Testimonial Card"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Monochromatic Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-xl border border-zinc-700 bg-zinc-950 text-xs font-mono text-white shadow-2xl transition-all duration-300 flex items-center gap-2.5 backdrop-blur">
          <div className="w-5 h-5 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-[10px]">
            <Check className="w-3 h-3 text-white" />
          </div>
          <div>
            <div className="font-semibold text-zinc-200">{toastMessage.title}</div>
            <div className="text-zinc-400 text-[10px]">{toastMessage.desc}</div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonials;
