"use client";

import { useEffect, type RefObject } from "react";

/** Closes an overlay when the user presses Escape. */
export function useEscape(active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onClose]);
}

/** Moves focus into an overlay once it opens. */
export function useFocusOnOpen(active: boolean, ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!active) return;
    const timer = window.setTimeout(() => ref.current?.focus(), 30);
    return () => window.clearTimeout(timer);
  }, [active, ref]);
}
