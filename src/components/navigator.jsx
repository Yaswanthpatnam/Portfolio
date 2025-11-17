import React from "react";

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/yaswanth-patnam-2aa28b340/", initials: "in" },
  { label: "GitHub", href: "https://github.com/Yaswanthpatnam", initials: "gh" },
  { label: "Email", href: "mailto:patnamyaswanth79.com", initials: "✉️" },
];

const Navigator = () => {
  return (
    <div className="sticky bottom-4 z-30 flex justify-center">
      <section className="panel w-full max-w-md px-4 py-5 text-center sm:px-6">
        <p className="font-sansation text-xl tracking-[0.1em] text-[color:var(--text-muted)]">
          CONNECT
        </p>
        <div className="mt-4 flex items-center justify-center gap-4">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--panel-border)] bg-[var(--pill-bg)] text-base uppercase tracking-widest transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              aria-label={social.label}
            >
              {social.initials}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Navigator;
