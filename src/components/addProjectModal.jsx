import React, { useState } from "react";
import { X, Send, CheckCircle2, Mail } from "lucide-react";

export const ContactModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate clean dispatch and mailto trigger
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);

      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      window.location.href = `mailto:patnamyaswanth79@gmail.com?subject=${subject}&body=${body}`;
    }, 600);
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setMessage("");
    setIsSent(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-6 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]"></span>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
              Get in Touch // Dispatch
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white font-mono text-xs p-1"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSent ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-medium text-white">Transmission Prepared</h4>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Opening your default mail client to dispatch your message directly to Yaswanth Babu.
            </p>
            <button
              onClick={handleReset}
              className="mt-4 px-5 py-2 rounded-full bg-white text-black font-mono text-xs font-semibold hover:bg-zinc-200 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                className="w-full px-3 py-2 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                Your Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ada@domain.com"
                className="w-full px-3 py-2 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                Your Message
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Discussing engineering opportunities, architectures, or collaborative projects..."
                className="w-full px-3 py-2 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded text-zinc-400 hover:text-white font-mono text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-full bg-white hover:bg-zinc-200 text-black font-mono text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Transmitting..." : "Send Message"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactModal;
