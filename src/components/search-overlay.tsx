"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/components/store-provider";
import { ArrowRightIcon, CloseIcon, SearchIcon } from "@/components/icons";
import { cn, formatPrice } from "@/lib/utils";
import { useFocusOnOpen } from "@/lib/hooks";

type SearchHit = { slug: string; name: string; price: number; image: string; category: string };
type Status = "idle" | "loading" | "done";

const POPULAR = ["Trench coat", "Cashmere", "Leather", "Overcoat", "Sunglasses"];

/** Full-width search panel with debounced live results from /api/search. */
export function SearchOverlay() {
  const { isSearchOpen, openSearch, closeOverlay } = useStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const requestSeq = useRef(0);
  const router = useRouter();
  const pathname = usePathname();

  useFocusOnOpen(isSearchOpen, inputRef);

  // Reset state when the panel opens, and close on Escape.
  useEffect(() => {
    if (!isSearchOpen) return;
    setQuery("");
    setResults([]);
    setStatus("idle");
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeOverlay();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSearchOpen, closeOverlay]);

  // Pressing "/" anywhere opens search (unless typing in a field).
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "/" || isSearchOpen) return;
      const target = event.target as HTMLElement | null;
      if (target && (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable)) return;
      event.preventDefault();
      openSearch();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSearchOpen, openSearch]);

  // Close after navigating.
  useEffect(() => {
    closeOverlay();
  }, [pathname, closeOverlay]);

  // Debounced live search.
  useEffect(() => {
    if (!isSearchOpen) return;
    const term = query.trim();
    if (term.length < 2) {
      setResults([]);
      setStatus("idle");
      return;
    }
    setStatus("loading");
    const seq = ++requestSeq.current;
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
        if (!response.ok) throw new Error("search failed");
        const data: { results?: SearchHit[] } = await response.json();
        if (seq !== requestSeq.current) return;
        setResults(data.results ?? []);
        setStatus("done");
      } catch {
        if (seq !== requestSeq.current) return;
        setResults([]);
        setStatus("done");
      }
    }, 220);
    return () => window.clearTimeout(timer);
  }, [query, isSearchOpen]);

  if (!isSearchOpen) return null;

  const term = query.trim();

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Search">
      <button
        type="button"
        aria-label="Close search"
        onClick={closeOverlay}
        className="absolute inset-0 animate-fade cursor-default bg-ink-950/40 backdrop-blur-sm"
      />
      <div className="relative max-h-[92vh] animate-slide-up overflow-y-auto bg-ivory-100 shadow-lift sm:animate-fade">
        <div className="container-x py-6 lg:py-9">
          <div className="flex items-center justify-between">
            <p className="eyebrow text-gold-600">Search AUREL</p>
            <button
              type="button"
              onClick={closeOverlay}
              aria-label="Close search"
              className="inline-flex h-10 w-10 items-center justify-center text-ink-900 transition-colors hover:text-gold-600"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <form
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              if (!term) return;
              closeOverlay();
              router.push(`/search?q=${encodeURIComponent(term)}`);
            }}
            className="mt-5 flex items-center gap-4 border-b border-ink-900 pb-3"
          >
            <SearchIcon className="h-5 w-5 shrink-0 text-ink-500" />
            <input
              ref={inputRef}
              type="search"
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search pieces, materials, collections…"
              aria-label="Search products"
              autoComplete="off"
              className="h-12 min-w-0 flex-1 bg-transparent font-display text-2xl text-ink-900 outline-none placeholder:text-ink-400 sm:text-3xl"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500 transition-colors hover:text-ink-900"
              >
                Clear
              </button>
            )}
            <kbd
              aria-hidden="true"
              className="hidden rounded-sm border border-ink-900/20 px-1.5 py-0.5 text-[10px] font-medium text-ink-500 sm:inline-block"
            >
              Esc
            </kbd>
            <button
              type="submit"
              aria-label="See all results"
              className="flex h-10 w-10 items-center justify-center text-ink-900 transition-colors hover:text-gold-600"
            >
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </form>

          {status === "idle" && (
            <div className="animate-fade py-7">
              <p className="eyebrow text-ink-500">Popular right now</p>
              <ul className="mt-4 flex flex-wrap gap-2" role="list">
                {POPULAR.map((suggestion) => (
                  <li key={suggestion}>
                    <button
                      type="button"
                      onClick={() => setQuery(suggestion)}
                      className="rounded-full border border-ink-900/15 px-4 py-2 text-[13px] text-ink-700 transition-colors duration-300 hover:border-ink-900 hover:text-ink-900"
                    >
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs text-ink-500">
                Tip: press <kbd className="rounded-sm border border-ink-900/20 px-1 text-[10px]">/</kbd> anywhere to search.
              </p>
            </div>
          )}

          {status === "loading" && (
            <p className="animate-fade py-8 text-sm text-ink-500" role="status">
              Searching…
            </p>
          )}

          {status === "done" && results.length > 0 && (
            <ul className="animate-fade divide-y divide-ink-900/10" role="list">
              {results.map((hit) => (
                <li key={hit.slug}>
                  <Link
                    href={`/products/${hit.slug}`}
                    onClick={closeOverlay}
                    className="group flex items-center gap-4 py-3"
                  >
                    <div className="h-16 w-12 shrink-0 overflow-hidden bg-sand-100">
                      <img src={hit.image} alt="" className="image-grade h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] text-ink-900 transition-colors group-hover:text-gold-600">{hit.name}</p>
                      <p className="text-[11px] uppercase tracking-[0.14em] text-ink-500">{hit.category}</p>
                    </div>
                    <span className="tabular text-sm text-ink-700">{formatPrice(hit.price)}</span>
                    <ArrowRightIcon className="h-4 w-4 text-ink-400 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {status === "done" && results.length === 0 && (
            <p className="animate-fade py-8 text-sm text-ink-500" role="status">
              Nothing matched “{term}”. Try “coat”, “wool” or “leather”.
            </p>
          )}

          {status === "done" && (
            <div className="mt-2 border-t border-ink-900/10 pt-4">
              <Link
                href={`/search?q=${encodeURIComponent(term)}`}
                onClick={closeOverlay}
                className={cn("nav-link text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-900", !term && "pointer-events-none opacity-0")}
              >
                View all results
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
