"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useStore } from "@/components/store-provider";
import { useEscape, useFocusOnOpen } from "@/lib/hooks";
import { BagIcon, CloseIcon } from "@/components/icons";
import { Button, ButtonLink } from "@/components/primitives";
import { QuantityStepper } from "@/components/quantity-stepper";
import { FREE_SHIPPING_CENTS, cn, formatPrice } from "@/lib/utils";

/** Slide-over shopping bag with quantity controls, shipping progress and checkout. */
export function BagDrawer() {
  const { isBagOpen, closeOverlay, items, setQty, removeItem, subtotal, count } = useStore();
  const closeRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEscape(isBagOpen, closeOverlay);
  useFocusOnOpen(isBagOpen, closeRef);

  if (!isBagOpen) return null;

  const remaining = Math.max(0, FREE_SHIPPING_CENTS - subtotal);
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_CENTS) * 100));

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <button
        type="button"
        aria-label="Close bag"
        onClick={closeOverlay}
        className="absolute inset-0 animate-fade cursor-default bg-ink-950/40 backdrop-blur-sm"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md animate-slide-right flex-col bg-ivory-100 shadow-lift">
        <header className="flex items-center justify-between border-b border-ink-900/10 px-6 py-5">
          <h2 className="font-display text-2xl text-ink-900">
            Your bag <span className="tabular text-lg text-ink-500">({count})</span>
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={closeOverlay}
            aria-label="Close bag"
            className="-mr-2 inline-flex h-10 w-10 items-center justify-center text-ink-900 transition-colors hover:text-gold-600"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <BagIcon className="h-10 w-10 text-ink-400" />
            <p className="mt-5 font-display text-2xl text-ink-900">Your bag is empty</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-500">
              Pieces you add will appear here. Start with the newest arrivals from Collection 07.
            </p>
            <ButtonLink href="/collections/new-arrivals" onClick={closeOverlay} className="mt-7">
              Shop new arrivals
            </ButtonLink>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              <div className="border-b border-ink-900/10 py-4">
                <p className="text-[12px] uppercase tracking-[0.16em] text-ink-600" aria-live="polite">
                  {remaining > 0 ? (
                    <>
                      You're <span className="tabular font-semibold text-ink-900">{formatPrice(remaining)}</span> away from
                      complimentary shipping
                    </>
                  ) : (
                    "Complimentary shipping unlocked"
                  )}
                </p>
                <div className="mt-3 h-0.5 w-full bg-ink-900/10" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label="Progress towards complimentary shipping">
                  <div className="h-full bg-gold-500 transition-all duration-700 ease-out-expo" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <ul className="divide-y divide-ink-900/10" role="list">
                {items.map((item) => (
                  <li key={item.key} className="flex gap-4 py-5">
                    <Link href={`/products/${item.slug}`} onClick={closeOverlay} className="block h-28 w-[84px] shrink-0 overflow-hidden bg-sand-100">
                      <img src={item.image} alt={item.name} className="image-grade h-full w-full object-cover object-top" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex justify-between gap-4">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeOverlay}
                          className="nav-link self-start text-[15px] font-medium text-ink-900"
                        >
                          {item.name}
                        </Link>
                        <span className="tabular shrink-0 text-[15px] text-ink-900">{formatPrice(item.price * item.qty)}</span>
                      </div>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-ink-500">
                        Size {item.size} · {item.color}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <QuantityStepper value={item.qty} onChange={(qty) => setQty(item.key, qty)} size="sm" label={`Quantity of ${item.name}`} />
                        <button
                          type="button"
                          onClick={() => removeItem(item.key)}
                          className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-500 transition-colors hover:text-error"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="border-t border-ink-900/10 bg-ivory-50 px-6 py-5">
              <div className="flex justify-between text-[15px] text-ink-900">
                <span>Subtotal</span>
                <span className="tabular font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-ink-500">Shipping and taxes are calculated at checkout.</p>
              <Button
                onClick={() => {
                  closeOverlay();
                  router.push("/checkout");
                }}
                className="mt-5 w-full"
              >
                Checkout
              </Button>
              <button
                type="button"
                onClick={closeOverlay}
                className={cn("mt-3 w-full text-center text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-600 transition-colors hover:text-ink-900")}
              >
                Continue shopping
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
