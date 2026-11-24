"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { useStore } from "@/components/store-provider";
import { useEscape } from "@/lib/hooks";
import { BagIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  { label: "Women", href: "/collections/women" },
  { label: "Men", href: "/collections/men" },
  { label: "Collections", href: "/collections" },
];

const SECONDARY = [
  { label: "Accessories", href: "/collections/accessories" },
  { label: "Client Care", href: "/client-care" },
  { label: "Our Story", href: "/#story" },
];

export function Header() {
  const pathname = usePathname();
  const { count, bump, openSearch, openAccount, openBag, isMenuOpen, openMenu, closeOverlay, user } = useStore();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, [isMenuOpen]);

  useEffect(() => {
    closeOverlay();
    // Only react to route changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const activeHref = [...NAV]
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-ink-900/10 bg-ivory-100/85 backdrop-blur-md">
        <div className="container-x grid h-16 grid-cols-[1fr_auto_1fr] items-center lg:h-20">
          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex xl:gap-9">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={activeHref === item.href ? "page" : undefined}
                className={cn(
                  "nav-link py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-600 transition-colors duration-300 hover:text-ink-900",
                  activeHref === item.href && "text-ink-900",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={openMenu}
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            className="-ml-2 inline-flex h-10 w-10 items-center justify-center justify-self-start text-ink-900 transition-colors hover:text-gold-600 lg:hidden"
          >
            <MenuIcon className="h-5 w-5" />
          </button>

          <Link
            href="/"
            aria-label="AUREL — home"
            className="justify-self-center font-display text-[22px] font-semibold tracking-[0.32em] text-ink-900 [margin-right:-0.32em] lg:text-[26px]"
          >
            AUREL
          </Link>

          <div className="flex items-center justify-self-end">
            <IconButton label="Search" onClick={openSearch}>
              <SearchIcon className="h-5 w-5" />
            </IconButton>
            <span className="hidden sm:inline-flex">
              <IconButton label={user ? "Account" : "Sign in or create account"} onClick={openAccount}>
                <UserIcon className="h-[19px] w-[19px]" />
              </IconButton>
            </span>
            <IconButton label={`Shopping bag, ${count} ${count === 1 ? "item" : "items"}`} onClick={openBag}>
              <BagIcon className="h-5 w-5" />
              {count > 0 && (
                <span
                  key={count}
                  className={cn(
                    "tabular absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-ink-900 px-1 text-[10px] font-bold text-ivory-100",
                    bump && "animate-pop",
                  )}
                >
                  {count}
                </span>
              )}
            </IconButton>
          </div>
        </div>
      </header>

      {isMenuOpen && <MobileMenu onClose={closeOverlay} closeRef={closeRef} />}
    </>
  );
}

function IconButton({
  label,
  onClick,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center text-ink-900 transition-all duration-300 hover:text-gold-600 active:scale-95",
        className,
      )}
    >
      {children}
    </button>
  );
}

function MobileMenu({ onClose, closeRef }: { onClose: () => void; closeRef: React.RefObject<HTMLButtonElement | null> }) {
  useEscape(true, onClose);

  return (
    <div className="fixed inset-0 z-50 flex animate-fade flex-col bg-ivory-100 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="container-x flex h-16 items-center justify-between border-b border-ink-900/10">
        <span className="font-display text-[22px] font-semibold tracking-[0.32em] text-ink-900 [margin-right:-0.32em]">AUREL</span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="inline-flex h-10 w-10 items-center justify-center text-ink-900 transition-colors hover:text-gold-600"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>
      <nav aria-label="Mobile" className="container-x flex flex-1 flex-col justify-center py-8">
        {NAV.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="nav-link animate-rise self-start py-1.5 font-display text-[44px] leading-tight text-ink-900"
            style={{ animationDelay: `${80 + index * 60}ms` }}
          >
            {item.label}
          </Link>
        ))}
        <div
          className="animate-rise mt-10 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-ink-900/10 pt-6"
          style={{ animationDelay: "360ms" }}
        >
          {SECONDARY.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-600 transition-colors hover:text-ink-900"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/client-care"
            onClick={onClose}
            className="text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-600 transition-colors hover:text-ink-900"
          >
            Shipping & Returns
          </Link>
        </div>
      </nav>
      <div
        className="animate-rise container-x border-t border-ink-900/10 py-5 text-[11px] uppercase tracking-[0.18em] text-ink-500"
        style={{ animationDelay: "420ms" }}
      >
        Complimentary shipping over $300 · 30-day returns
      </div>
    </div>
  );
}
