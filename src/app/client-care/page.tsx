import type { Metadata } from "next";
import { ButtonLink, Container, Eyebrow } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Client Care",
  description: "Shipping, returns, size guides and answers to common questions at AUREL.",
};

const TOC = [
  { href: "#shipping", label: "Shipping & Returns" },
  { href: "#size-guide", label: "Size Guide" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
  { href: "#privacy", label: "Privacy" },
  { href: "#terms", label: "Terms" },
  { href: "#accessibility", label: "Accessibility" },
];

const FAQ = [
  {
    q: "When will my order arrive?",
    a: "Orders placed before 1pm CET ship the same business day. Standard delivery takes 2–4 business days within Europe and 3–6 days elsewhere. Express options are available at checkout.",
  },
  {
    q: "How do returns work?",
    a: "Unworn pieces with tags can be returned within 30 days for a full refund. Start a return from your order confirmation email, print the prepaid label and drop the parcel at any point of the carrier you chose.",
  },
  {
    q: "Are the pieces true to size?",
    a: "Most pieces run true to size. Each product page notes whether the fit is slim, regular or relaxed, and the size guide below gives garment measurements. If you're between sizes, our client advisors are happy to help.",
  },
  {
    q: "Do you offer repairs?",
    a: "Yes. Repairs are complimentary for the first two years on every AUREL piece — from a loose button to a re-stitched hem. Write to care@aurel.studio with a photo and we'll arrange it.",
  },
  {
    q: "Can I gift a piece?",
    a: "Every order ships without pricing paperwork and can include a handwritten note. Select “Gift” at checkout and add your message.",
  },
];

export default function ClientCarePage() {
  return (
    <>
      <section className="border-b border-ink-900/10 bg-ivory-50">
        <Container className="py-12 lg:py-20">
          <Eyebrow>Client care</Eyebrow>
          <h1 className="mt-3 font-display text-5xl leading-none text-ink-900 sm:text-6xl lg:text-7xl">
            How can we <em className="italic">help?</em>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-600">
            Everything you need to know about shipping, returns and caring for your AUREL pieces — and how to reach a
            human if you'd rather ask.
          </p>
        </Container>
      </section>

      <Container className="py-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <nav aria-label="On this page" className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow text-ink-500">On this page</p>
              <ul className="mt-4 space-y-2" role="list">
                {TOC.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="nav-link text-sm text-ink-700 transition-colors hover:text-ink-900">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <ButtonLink href="/collections/new-arrivals" variant="outline" size="sm" className="mt-8 hidden lg:inline-flex">
                Shop new arrivals
              </ButtonLink>
            </div>
          </nav>

          <div className="space-y-16 lg:col-span-9">
            <section id="shipping" className="scroll-mt-28">
              <h2 className="font-display text-3xl text-ink-900 sm:text-4xl">Shipping &amp; Returns</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div className="border border-ink-900/10 p-6">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-900">Shipping</p>
                  <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink-600" role="list">
                    <li>Complimentary standard shipping on orders over $300.</li>
                    <li>Standard delivery: $15 · 2–6 business days.</li>
                    <li>Express delivery: $35 · 1–3 business days.</li>
                    <li>All parcels are insured and fully traceable.</li>
                  </ul>
                </div>
                <div className="border border-ink-900/10 p-6">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-900">Returns</p>
                  <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink-600" role="list">
                    <li>Free returns within 30 days on unworn full-price pieces.</li>
                    <li>Refunds are processed within 5 business days of arrival.</li>
                    <li>Sale pieces can be exchanged or credited.</li>
                    <li>Repairs are complimentary for two years.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="size-guide" className="scroll-mt-28">
              <h2 className="font-display text-3xl text-ink-900 sm:text-4xl">Size Guide</h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-600">
                Measurements are body measurements in centimetres. If you're between sizes, take the larger size for
                outerwear and the smaller for knitwear.
              </p>
              <div className="mt-6 grid gap-8 md:grid-cols-2">
                <SizeTable caption="Women" columns={["Size", "Bust", "Waist", "Hip"]} rows={[["XS", "80", "62", "88"], ["S", "86", "68", "94"], ["M", "92", "74", "100"], ["L", "98", "80", "106"], ["XL", "104", "86", "112"]]} />
                <SizeTable caption="Men" columns={["Size", "Chest", "Waist", "Shoulder"]} rows={[["S", "92", "78", "44"], ["M", "98", "84", "46"], ["L", "104", "90", "48"], ["XL", "110", "96", "50"]]} />
              </div>
              <p className="mt-5 text-sm text-ink-500">
                Shoes and eyewear are listed in EU sizes. Accessories marked “One Size” are adjustable.
              </p>
            </section>

            <section id="faq" className="scroll-mt-28">
              <h2 className="font-display text-3xl text-ink-900 sm:text-4xl">Frequently asked</h2>
              <div className="mt-6 divide-y divide-ink-900/10 border-y border-ink-900/10">
                {FAQ.map((item) => (
                  <details key={item.q} className="group">
                    <summary className="flex list-none items-center justify-between gap-6 py-4 text-[15px] font-medium text-ink-900 [&::-webkit-details-marker]:hidden">
                      {item.q}
                      <span className="font-display text-2xl leading-none text-gold-600 transition-transform duration-300 group-open:rotate-45" aria-hidden="true">+</span>
                    </summary>
                    <p className="animate-fade pb-5 text-sm leading-relaxed text-ink-600">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>

            <section id="contact" className="scroll-mt-28">
              <h2 className="font-display text-3xl text-ink-900 sm:text-4xl">Contact</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                {[
                  ["Client advisors", "care@aurel.studio", "Mon–Sat, 9am–7pm CET"],
                  ["Atelier appointments", "atelier@aurel.studio", "12 Rue de Turenne, Paris 3e"],
                  ["Press & wholesale", "studio@aurel.studio", "By appointment"],
                ].map(([title, email, detail]) => (
                  <div key={title} className="border border-ink-900/10 p-6">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-900">{title}</p>
                    <a href={`mailto:${email}`} className="nav-link mt-3 inline-block text-sm text-ink-700">
                      {email}
                    </a>
                    <p className="mt-2 text-sm text-ink-500">{detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="privacy" className="scroll-mt-28">
              <h2 className="font-display text-3xl text-ink-900 sm:text-4xl">Privacy</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-600">
                We collect only what we need to fulfil your order and — if you opt in — to send our newsletter: your
                name, email, shipping address and order history. We never sell data, we don't run third-party advertising
                trackers, and you can request a copy or deletion of your data at any time by writing to{" "}
                <a href="mailto:privacy@aurel.studio" className="nav-link text-ink-900">privacy@aurel.studio</a>. Payment
                is handled by our payment partner; AUREL never stores card details.
              </p>
            </section>

            <section id="terms" className="scroll-mt-28">
              <h2 className="font-display text-3xl text-ink-900 sm:text-4xl">Terms</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-600">
                Prices are shown in US dollars and include applicable duties for the selected destination. Orders are
                confirmed once payment is authorised; made-to-measure pieces cannot be cancelled after cutting begins.
                This storefront is a demonstration — no orders are fulfilled and no payments are processed.
              </p>
            </section>

            <section id="accessibility" className="scroll-mt-28">
              <h2 className="font-display text-3xl text-ink-900 sm:text-4xl">Accessibility</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-600">
                We aim for WCAG 2.2 AA across the store: visible focus styles on every control, full keyboard navigation
                for the bag, search and account panels, reduced-motion support, and text contrast of at least 7:1 on body
                copy. If something gets in your way, tell us at{" "}
                <a href="mailto:access@aurel.studio" className="nav-link text-ink-900">access@aurel.studio</a> and we'll
                fix it.
              </p>
              <div className="mt-8">
                <ButtonLink href="/">Back to the store</ButtonLink>
              </div>
            </section>
          </div>
        </div>
      </Container>
    </>
  );
}

function SizeTable({ caption, columns, rows }: { caption: string; columns: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto border border-ink-900/10">
      <table className="w-full text-left text-sm">
        <caption className="border-b border-ink-900/10 px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-900">
          {caption}
        </caption>
        <thead>
          <tr className="bg-ivory-50 text-[11px] uppercase tracking-[0.14em] text-ink-500">
            {columns.map((column) => (
              <th key={column} scope="col" className="px-4 py-2.5 font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="tabular text-ink-700">
          {rows.map((row) => (
            <tr key={row[0]} className="border-t border-ink-900/10">
              {row.map((cell, index) => (
                <td key={index} className="px-4 py-2.5">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
