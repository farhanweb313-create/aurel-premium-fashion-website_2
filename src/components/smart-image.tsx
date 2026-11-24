"use client";

import { useState, type ImgHTMLAttributes } from "react";

const FALLBACK = "/images/placeholder.svg";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  src?: string;
  alt: string;
  /** Eager-load above-the-fold imagery. */
  priority?: boolean;
};

/**
 * Photograph with a graceful fallback: if the source is missing or fails to
 * load, a branded placeholder is shown instead of a broken image.
 */
export function SmartImage({ src, alt, priority, className, ...rest }: Props) {
  const [failed, setFailed] = useState(false);
  const source = !src || failed ? FALLBACK : src;

  return (
    <img
      {...rest}
      src={source}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
