"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useStore } from "@/components/store-provider";
import { CheckIcon } from "@/components/icons";
import { Button, ButtonLink } from "@/components/primitives";
import { FREE_SHIPPING_CENTS, STANDARD_SHIPPING_CENTS, cn, formatPrice, isEmail } from "@/lib/utils";

const COUNTRIES = ["United States", "United Kingdom", "France", "Germany", "Italy", "Spain", "Netherlands", "Japan", "United Arab Emirates", "Australia", "Canada"];

type Confirmation = { orderNumber: string; totalCents: number; email: string; name: string };

/** Demo checkout: contact, shipping and payment fields, live order summary, persisted order. */
export function CheckoutView() {
  const { items, subtotal, clearBag, user, toast } = useStore();
  const [status, setStatus] = useState<"idle" | "pending">("idle");
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [firstName, setFirstName] = useState(user?.name.split(" ")[0] ?? "");

  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_CENTS ? 0 : STANDARD_SHIPPING_CENTS;
  const total = subtotal + shipping;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [confirmation]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (items.length === 0) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const get = (key: string) => String(data.get(key) ?? "").trim();

    const email = get("email").toLowerCase();
    const first = get("firstName");
    const last = get("lastName");
    if (!isEmail(email)) return fail("Please enter a valid email address.");
    if (!first || !last || !get("line1") || !get("city") || !get("postalCode") || !get("country")) {
      return fail("Please complete your shipping address.");
    }
    if (cardNumber.replace(/\D/g, "").length < 15) return fail("Please enter a valid card number.");
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return fail("Expiry should be formatted MM/YY.");
    if (!/^\d{3,4}$/.test(get("cvc"))) return fail("Please enter the card's security code.");

    setStatus("pending");
    setError(null);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          fullName: `${first} ${last}`,
          address: {
            line1: get("line1"),
            line2: get("line2") || undefined,
            city: get("city"),
            postalCode: get("postalCode"),
            country: get("country"),
          },
          items: items.map((item) => ({ slug: item.slug, name: item.name, size: item.size, color: item.color, qty: item.qty })),
        }),
      });
      const payload: { orderNumber?: string; totalCents?: number; error?: string } = await response.json().catch(() => ({}));
      if (!response.ok || !payload.orderNumber) {
        throw new Error(payload.error || "We couldn't place your order. Please try again.");
      }
      setConfirmation({ orderNumber: payload.orderNumber, totalCents: payload.totalCents ?? total, email, name: first });
      toast({ title: "Order confirmed", description: payload.orderNumber, tone: "success" });
      clearBag();
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setStatus("idle");
    }
  }

  function fail(message: string) {
    setError(message);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (confirmation) {
    return (
      <section className="container-x flex min-h-[70vh] flex-col items-center justify-center py-20 text-center" aria-live="polite">
        <span className="flex h-16 w-16 animate-pop items-center justify-center rounded-full bg-gold-500 text-ink-950">
          <CheckIcon className="h-7 w-7" />
        </span>
        <p className="eyebrow mt-8 text-gold-600">Order confirmed</p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-ink-900 sm:text-5xl">
          Thank you, <em className="italic">{confirmation.name}</em>.
        </h1>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-600">
          Order <span className="font-semibold text-ink-900">{confirmation.orderNumber}</span> is confirmed. A summary and
          tracking details are on their way to <span className="text-ink-900">{confirmation.email}</span>. Total charged{" "}
          <span className="tabular font-semibold text-ink-900">{formatPrice(confirmation.totalCents)}</span>.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/collections/new-arrivals">Continue shopping</ButtonLink>
          <ButtonLink href="/" variant="outline">
            Back to home
          </ButtonLink>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="eyebrow text-gold-600">Checkout</p>
        <h1 className="mt-4 font-display text-4xl text-ink-900 sm:text-5xl">Your bag is empty.</h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-600">
          Add a few pieces before checking out — the newest arrivals from Collection 07 are a good place to start.
        </p>
        <ButtonLink href="/collections/new-arrivals" className="mt-8">
          Shop new arrivals
        </ButtonLink>
      </section>
    );
  }

  return (
    <div className="container-x py-10 lg:py-16">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-gold-600">Secure checkout</p>
          <h1 className="mt-3 font-display text-4xl text-ink-900 sm:text-5xl">Checkout</h1>
        </div>
        <p className="text-xs text-ink-500">Demo storefront — no payment is processed and card details are discarded.</p>
      </div>

      {error && (
        <p role="alert" className="mt-8 border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
          {error}
        </p>
      )}

      <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-14">
        <form onSubmit={handleSubmit} noValidate className="space-y-12 lg:col-span-7">
          <fieldset className="grid gap-5 sm:grid-cols-2">
            <legend className="mb-5 w-full font-display text-2xl text-ink-900 sm:col-span-2">Contact</legend>
            <Text label="Email address" name="email" type="email" autoComplete="email" defaultValue={user?.email ?? ""} placeholder="you@example.com" className="sm:col-span-2" />
          </fieldset>

          <fieldset className="grid gap-5 sm:grid-cols-2">
            <legend className="mb-5 w-full font-display text-2xl text-ink-900 sm:col-span-2">Shipping address</legend>
            <Text label="First name" name="firstName" autoComplete="given-name" defaultValue={firstName} required />
            <Text label="Last name" name="lastName" autoComplete="family-name" required />
            <Text label="Address" name="line1" autoComplete="address-line1" placeholder="Street and number" className="sm:col-span-2" required />
            <Text label="Apartment, suite, etc. (optional)" name="line2" autoComplete="address-line2" className="sm:col-span-2" />
            <Text label="City" name="city" autoComplete="address-level2" required />
            <Text label="Postal code" name="postalCode" autoComplete="postal-code" required />
            <label className="block sm:col-span-2">
              <span className="field-label">Country</span>
              <select name="country" autoComplete="country-name" defaultValue="United States" className="field mt-1 cursor-pointer appearance-none">
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </label>
          </fieldset>

          <fieldset className="grid gap-5 sm:grid-cols-2">
            <legend className="mb-5 w-full font-display text-2xl text-ink-900 sm:col-span-2">Payment</legend>
            <Text label="Name on card" name="cardName" autoComplete="cc-name" className="sm:col-span-2" required />
            <label className="block sm:col-span-2">
              <span className="field-label">Card number</span>
              <input
                name="cardNumber"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(event) => setCardNumber(event.target.value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 "))}
                className="field mt-1 tabular"
                required
              />
            </label>
            <label className="block">
              <span className="field-label">Expiry</span>
              <input
                name="expiry"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                value={expiry}
                onChange={(event) => setExpiry(event.target.value.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(?=\d)/, "$1/"))}
                className="field mt-1 tabular"
                required
              />
            </label>
            <Text label="Security code" name="cvc" inputMode="numeric" autoComplete="cc-csc" placeholder="CVC" required />
            <p className="text-xs leading-relaxed text-ink-500 sm:col-span-2">
              Any 15–16 digit number works in this demo. Nothing is charged and no card data is stored.
            </p>
          </fieldset>

          <Button type="submit" size="lg" disabled={status === "pending"} className="w-full sm:w-auto">
            {status === "pending" ? "Placing order…" : `Place order · ${formatPrice(total)}`}
          </Button>
        </form>

        <aside className="lg:col-span-5" aria-label="Order summary">
          <div className="border border-ink-900/10 bg-ivory-50 p-6 lg:sticky lg:top-28 lg:p-8">
            <h2 className="font-display text-2xl text-ink-900">Order summary</h2>
            <ul className="mt-6 divide-y divide-ink-900/10" role="list">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4 py-4">
                  <Link href={`/products/${item.slug}`} className="relative block h-24 w-[72px] shrink-0 overflow-hidden bg-sand-100">
                    <img src={item.image} alt={item.name} className="image-grade h-full w-full object-cover object-top" />
                    <span className="tabular absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center bg-ink-900 px-1 text-[10px] font-bold text-ivory-100">
                      {item.qty}
                    </span>
                  </Link>
                  <div className="flex min-w-0 flex-1 justify-between gap-3">
                    <div className="min-w-0">
                      <Link href={`/products/${item.slug}`} className="nav-link text-sm font-medium text-ink-900">
                        {item.name}
                      </Link>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-ink-500">
                        Size {item.size} · {item.color}
                      </p>
                    </div>
                    <span className="tabular shrink-0 text-sm text-ink-900">{formatPrice(item.price * item.qty)}</span>
                  </div>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-ink-900/10 pt-4 text-sm">
              <div className="flex justify-between text-ink-600">
                <dt>Subtotal</dt>
                <dd className="tabular">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-ink-600">
                <dt>Shipping</dt>
                <dd className="tabular">{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</dd>
              </div>
              <div className={cn("flex justify-between border-t border-ink-900/10 pt-3 text-[15px] font-semibold text-ink-900")}>
                <dt>Total</dt>
                <dd className="tabular">{formatPrice(total)}</dd>
              </div>
            </dl>
            <Link href="/collections/all" className="nav-link mt-5 inline-block text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-600 hover:text-ink-900">
              Add another piece
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Text({
  label,
  name,
  type = "text",
  autoComplete,
  placeholder,
  defaultValue,
  required,
  inputMode,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  inputMode?: "numeric" | "text";
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="field-label">{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        inputMode={inputMode}
        className="field mt-1"
      />
    </label>
  );
}
