import { ButtonLink } from "@/components/primitives";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[65vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow text-gold-600">404</p>
      <h1 className="mt-4 font-display text-5xl leading-tight text-ink-900 sm:text-6xl">
        This page has <em className="italic">wandered</em> off.
      </h1>
      <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-600">
        The piece or page you were looking for is no longer here — or never was. Let's get you back to the collection.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-4">
        <ButtonLink href="/collections/new-arrivals">Shop new arrivals</ButtonLink>
        <ButtonLink href="/" variant="outline">
          Back to home
        </ButtonLink>
      </div>
    </section>
  );
}
