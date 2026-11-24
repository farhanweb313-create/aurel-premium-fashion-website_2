/** Joins class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** Formats a price in cents, e.g. 69000 -> "$690". */
export function formatPrice(cents: number): string {
  return usd.format(cents / 100);
}

export const FREE_SHIPPING_CENTS = 30000;
export const STANDARD_SHIPPING_CENTS = 1500;

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
