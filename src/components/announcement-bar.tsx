"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Complimentary shipping over $300",
  "Autumn / Winter 2026 — Collection 07 has arrived",
  "30-day considered returns on all full-price pieces",
];

/** Slim bar above the header that gently rotates store announcements. */
export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % MESSAGES.length), 5200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="bg-ink-900 text-ivory-100" role="region" aria-label="Announcements">
      <p className="container-x flex min-h-9 items-center justify-center overflow-hidden py-1.5 text-center text-[10px] font-medium uppercase tracking-[0.16em] sm:py-0 sm:text-[11px] sm:tracking-[0.2em]">
        <span key={index} className="animate-fade">
          {MESSAGES[index]}
        </span>
      </p>
    </div>
  );
}
