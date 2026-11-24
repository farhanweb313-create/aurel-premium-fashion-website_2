"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useStore } from "@/components/store-provider";
import { useEscape, useFocusOnOpen } from "@/lib/hooks";
import { ArrowRightIcon, CloseIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

type Mode = "signin" | "register";

/** Account dialog: sign in / create account, or the signed-in member card. */
export function AccountPanel() {
  const { isAccountOpen, closeOverlay, user, setUser, toast } = useStore();
  const [mode, setMode] = useState<Mode>("signin");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEscape(isAccountOpen, closeOverlay);
  useFocusOnOpen(isAccountOpen, closeRef);

  useEffect(() => {
    if (isAccountOpen) {
      setError(null);
      setPending(false);
    }
  }, [isAccountOpen]);

  if (!isAccountOpen) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim().toLowerCase();
    const password = String(data.get("password") ?? "");
    const name = String(data.get("name") ?? "").trim();

    if (mode === "register" && name.length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (password.length < 8) {
      setError(mode === "register" ? "Choose a password of at least 8 characters." : "Passwords are at least 8 characters.");
      return;
    }

    setPending(true);
    setError(null);
    try {
      const response = await fetch(`/api/auth/${mode === "register" ? "register" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const payload: { user?: typeof user; error?: string } = await response.json().catch(() => ({}));
      if (!response.ok || !payload.user) {
        throw new Error(payload.error || "Something went wrong. Please try again.");
      }
      setUser(payload.user);
      const firstName = payload.user.name.split(" ")[0];
      toast({
        title: mode === "register" ? `Welcome to AUREL, ${firstName}` : `Welcome back, ${firstName}`,
        tone: "success",
      });
      closeOverlay();
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    setUser(null);
    toast({ title: "Signed out", description: "See you soon." });
    closeOverlay();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Account"
    >
      <button
        type="button"
        aria-label="Close account panel"
        onClick={closeOverlay}
        className="absolute inset-0 animate-fade cursor-default bg-ink-950/40 backdrop-blur-sm"
      />
      <div className="relative max-h-[92vh] w-full max-w-md animate-slide-up overflow-y-auto bg-ivory-100 p-6 shadow-lift sm:animate-rise sm:p-9">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-gold-600">Account</p>
          <button
            ref={closeRef}
            type="button"
            onClick={closeOverlay}
            aria-label="Close account panel"
            className="-mr-2 inline-flex h-10 w-10 items-center justify-center text-ink-900 transition-colors hover:text-gold-600"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {user ? (
          <div className="animate-fade">
            <h2 className="mt-5 font-display text-3xl text-ink-900">Hello, {user.name.split(" ")[0]}.</h2>
            <p className="mt-2 text-sm text-ink-600">{user.email}</p>
            <p className="mt-1 text-xs text-ink-500">
              Member since{" "}
              {new Date(user.memberSince).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
            <ul className="mt-7 divide-y divide-ink-900/10 border-y border-ink-900/10 text-sm">
              <li className="py-3 text-ink-500">Orders, saved pieces and private fittings are linked to this account.</li>
              <li>
                <Link href="/client-care#shipping" onClick={closeOverlay} className="nav-link py-3 text-ink-900">
                  Shipping & returns
                </Link>
              </li>
              <li>
                <Link href="/client-care#size-guide" onClick={closeOverlay} className="nav-link py-3 text-ink-900">
                  Size guide
                </Link>
              </li>
            </ul>
            <button
              type="button"
              onClick={signOut}
              className="mt-6 inline-flex h-12 w-full items-center justify-center border border-ink-900 text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-900 transition-colors duration-300 hover:bg-ink-900 hover:text-ivory-100"
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="animate-fade">
            <h2 className="mt-5 font-display text-3xl text-ink-900">{mode === "signin" ? "Sign in" : "Create an account"}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              {mode === "signin"
                ? "Access your orders, saved pieces and private fittings."
                : "Join the AUREL circle to track orders and get early access to limited pieces."}
            </p>

            <div className="mt-6 grid grid-cols-2 border-b border-ink-900/10" role="tablist" aria-label="Account mode">
              {(["signin", "register"] as Mode[]).map((value) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={mode === value}
                  onClick={() => {
                    setMode(value);
                    setError(null);
                  }}
                  className={cn(
                    "-mb-px py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors",
                    mode === value ? "border-b border-ink-900 text-ink-900" : "text-ink-500 hover:text-ink-900",
                  )}
                >
                  {value === "signin" ? "Sign in" : "Create account"}
                </button>
              ))}
            </div>

            <form key={mode} onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
              {mode === "register" && <Field label="Full name" name="name" autoComplete="name" placeholder="Camille Laurent" />}
              <Field label="Email address" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
              <Field label="Password" name="password" type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} placeholder="At least 8 characters" />

              {error && (
                <p role="alert" className="text-[13px] text-error">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="inline-flex h-12 w-full items-center justify-center gap-2 bg-ink-900 text-[12px] font-semibold uppercase tracking-[0.18em] text-ivory-100 transition-colors duration-300 hover:bg-ink-700 disabled:pointer-events-none disabled:opacity-60"
              >
                {pending ? "One moment…" : mode === "signin" ? "Sign in" : "Create account"}
                {!pending && <ArrowRightIcon className="h-4 w-4" />}
              </button>
              <p className="text-xs leading-relaxed text-ink-500">
                Demo storefront — accounts are stored locally and no payment details are ever requested.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input name={name} type={type} autoComplete={autoComplete} placeholder={placeholder} required className="field mt-1" />
    </label>
  );
}
