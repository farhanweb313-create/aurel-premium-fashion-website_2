import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn, formatPrice } from "@/lib/utils";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("container-x", className)}>{children}</div>;
}

/* ----------------------------- Buttons ----------------------------- */

type Variant = "solid" | "outline" | "ivory" | "outline-ivory" | "gold";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  solid: "bg-ink-900 text-ivory-100 hover:bg-ink-700 active:bg-ink-800",
  outline: "border border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-ivory-100",
  ivory: "bg-ivory-100 text-ink-900 hover:bg-gold-300",
  "outline-ivory": "border border-ivory-100/60 text-ivory-100 hover:border-ivory-100 hover:bg-ivory-100 hover:text-ink-900",
  gold: "bg-gold-500 text-ink-950 hover:bg-gold-400",
};

const SIZES: Record<Size, string> = {
  sm: "h-10 px-5 text-[11px]",
  md: "h-12 px-7",
  lg: "h-14 px-9",
};

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-[12px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ease-out-expo disabled:pointer-events-none disabled:opacity-50";

type VariantProps = { variant?: Variant; size?: Size };

export function Button({
  variant = "solid",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps) {
  return <button type="button" className={cn(BUTTON_BASE, VARIANTS[variant], SIZES[size], className)} {...props} />;
}

export function ButtonLink({
  variant = "solid",
  size = "md",
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & VariantProps & { href: string }) {
  return <Link className={cn(BUTTON_BASE, VARIANTS[variant], SIZES[size], className)} {...props} />;
}

/* --------------------------- Typography ---------------------------- */

export function Eyebrow({ className, children }: { className?: string; children: ReactNode }) {
  return <p className={cn("eyebrow text-gold-600", className)}>{children}</p>;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  tone = "light",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: { href: string; label: string };
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow && <Eyebrow className={tone === "dark" ? "text-gold-400" : undefined}>{eyebrow}</Eyebrow>}
        <h2
          className={cn(
            "mt-3 font-display text-4xl leading-[1.02] tracking-[-0.01em] sm:text-5xl",
            tone === "dark" ? "text-ivory-100" : "text-ink-900",
          )}
        >
          {title}
        </h2>
        {description && (
          <p className={cn("mt-4 text-[15px] leading-relaxed sm:text-base", tone === "dark" ? "text-ivory-200/75" : "text-ink-600")}>
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className={cn(
            "nav-link shrink-0 self-start text-[12px] font-semibold uppercase tracking-[0.18em] md:self-auto",
            tone === "dark" ? "text-ivory-100" : "text-ink-900",
          )}
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function Price({ cents, className }: { cents: number; className?: string }) {
  return <span className={cn("tabular", className)}>{formatPrice(cents)}</span>;
}
