"use client";

import { useStore } from "@/components/store-provider";
import { CheckIcon, CloseIcon } from "@/components/icons";

/** Fixed-position stack of transient confirmations (added to bag, welcome, etc.). */
export function Toaster() {
  const { toasts, dismissToast, openBag } = useStore();

  return (
    <div
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[70] flex flex-col items-center gap-3 sm:inset-x-auto sm:bottom-6 sm:left-6 sm:items-start"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex w-full max-w-sm animate-toast items-center gap-4 bg-ink-900 p-4 text-ivory-100 shadow-lift"
          role="status"
        >
          {toast.image && (
            <div className="h-16 w-12 shrink-0 overflow-hidden bg-sand-300">
              <img src={toast.image} alt="" className="h-full w-full object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 text-[13px] font-semibold">
              {toast.tone === "success" && (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500 text-ink-950">
                  <CheckIcon className="h-3 w-3" />
                </span>
              )}
              {toast.title}
            </p>
            {toast.description && <p className="mt-1 truncate text-xs text-ivory-200/70">{toast.description}</p>}
          </div>
          {toast.action === "bag" && (
            <button
              type="button"
              onClick={() => {
                dismissToast(toast.id);
                openBag();
              }}
              className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-300 transition-colors hover:text-gold-400"
            >
              View bag
            </button>
          )}
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => dismissToast(toast.id)}
            className="-mr-1 flex h-7 w-7 shrink-0 items-center justify-center text-ivory-200/60 transition-colors hover:text-ivory-100"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
