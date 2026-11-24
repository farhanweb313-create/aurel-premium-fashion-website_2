import Link from "next/link";
import { InstagramIcon, PinterestIcon, YouTubeIcon } from "@/components/icons";

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Shop",
    links: [
      { label: "New Arrivals", href: "/collections/new-arrivals" },
      { label: "Women", href: "/collections/women" },
      { label: "Men", href: "/collections/men" },
      { label: "Accessories", href: "/collections/accessories" },
      { label: "All pieces", href: "/collections/all" },
    ],
  },
  {
    heading: "Collections",
    links: [
      { label: "Atelier Tailoring", href: "/collections/atelier-tailoring" },
      { label: "Soft Structure", href: "/collections/soft-structure" },
      { label: "Night Archive", href: "/collections/night-archive" },
      { label: "Our Story", href: "/#story" },
    ],
  },
  {
    heading: "Client Care",
    links: [
      { label: "Shipping & Returns", href: "/client-care#shipping" },
      { label: "Size Guide", href: "/client-care#size-guide" },
      { label: "FAQ", href: "/client-care#faq" },
      { label: "Contact", href: "/client-care#contact" },
      { label: "Privacy & Terms", href: "/client-care#privacy" },
    ],
  },
];

const SOCIAL = [
  { label: "AUREL on Instagram", href: "https://www.instagram.com/", Icon: InstagramIcon },
  { label: "AUREL on Pinterest", href: "https://www.pinterest.com/", Icon: PinterestIcon },
  { label: "AUREL on YouTube", href: "https://www.youtube.com/", Icon: YouTubeIcon },
];

export function Footer() {
  return (
    <footer className="grain bg-ink-900 text-ivory-100">
      <div className="container-x relative z-10 py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link href="/" aria-label="AUREL — home" className="font-display text-3xl font-semibold tracking-[0.32em] text-ivory-100 [margin-right:-0.32em]">
              AUREL
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory-200/70">
              Modern clothing for men and women, cut in Paris and made to outlast the season. Collection 07 —
              Autumn/Winter 2026 — is in the store now.
            </p>
            <ul className="mt-8 flex gap-3" role="list">
              {SOCIAL.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory-100/20 text-ivory-100 transition-colors duration-300 hover:border-ivory-100 hover:bg-ivory-100 hover:text-ink-900"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {COLUMNS.map((column, index) => (
            <nav key={column.heading} aria-label={column.heading} className={index === 0 ? "lg:col-span-3" : "lg:col-span-2"}>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-400">{column.heading}</h2>
              <ul className="mt-5 space-y-3" role="list">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="nav-link text-sm text-ivory-200/75 transition-colors hover:text-ivory-100">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-ivory-100/15 pt-6 text-[11px] uppercase tracking-[0.18em] text-ivory-200/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 AUREL Studio SAS · Designed in Paris · Made in Portugal &amp; Italy</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/client-care#privacy" className="transition-colors hover:text-ivory-100">
              Privacy
            </Link>
            <Link href="/client-care#terms" className="transition-colors hover:text-ivory-100">
              Terms
            </Link>
            <Link href="/client-care#accessibility" className="transition-colors hover:text-ivory-100">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
