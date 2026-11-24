"use client";

import { useState, type FormEvent } from "react";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { isEmail, cn } from "@/lib/utils";

type Status = "idle" | "pending" | "done" | "error";

/** Newsletter signup backed by /api/newsletter. */
export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!isEmail(value)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("pending");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      const payload: { already?: boolean; error?: string } = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Something went wrong. Please try again.");
      setStatus("done");
      setMessage(
        payload.already
          ? "You're already on the list — the next letter is on its way."
          : "Welcome to the circle. Your first letter is on its way.",
      );
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="animate-rise flex items-start gap-4 border border-gold-500/40 bg-ivory-50 p-5">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-500 text-ink-950">
          <CheckIcon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[15px] font-medium text-ink-900">You're subscribed.</p>
          <p className="mt-1 text-sm text-ink-600">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={className}>
      <label htmlFor="newsletter-email" className="field-label">
        Email address
      </label>
      <div className="mt-2 flex items-center gap-3 border-b border-ink-900/40 transition-colors duration-300 focus-within:border-ink-900">
        <input
          id="newsletter-email"
          type="email"
          name="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={status === "error"}
          aria-describedby="newsletter-hint"
          className="h-12 min-w-0 flex-1 bg-transparent text-[15px] text-ink-900 outline-none placeholder:text-ink-400"
        />
        <button
          type="submit"
          disabled={status === "pending"}
          className="inline-flex shrink-0 items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-900 transition-colors hover:text-gold-600 disabled:opacity-50"
        >
          {status === "pending" ? "Joining…" : "Subscribe"}
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
      <p
        id="newsletter-hint"
        role={status === "error" ? "alert" : undefined}
        className={cn("mt-3 text-xs", status === "error" ? "text-error" : "text-ink-500")}
      >
        {status === "error" ? message : "One letter, twice a month. Unsubscribe anytime."}
      </p>
    </form>
  );
}
