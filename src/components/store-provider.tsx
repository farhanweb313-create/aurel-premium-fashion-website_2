"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type BagItem = {
  key: string;
  slug: string;
  name: string;
  price: number;
  size: string;
  color: string;
  image: string;
  qty: number;
};

export type AddableProduct = { slug: string; name: string; price: number; image: string };
export type StoredUser = { id: string; name: string; email: string; memberSince: string };

export type Toast = {
  id: number;
  title: string;
  description?: string;
  image?: string;
  tone?: "default" | "success" | "error";
  action?: "bag";
};

type Overlay = "bag" | "search" | "account" | "menu" | null;

type StoreValue = {
  items: BagItem[];
  count: number;
  subtotal: number;
  bump: boolean;
  addItem: (product: AddableProduct, size: string, color: string, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  clearBag: () => void;
  isBagOpen: boolean;
  isSearchOpen: boolean;
  isAccountOpen: boolean;
  isMenuOpen: boolean;
  openBag: () => void;
  openSearch: () => void;
  openAccount: () => void;
  openMenu: () => void;
  closeOverlay: () => void;
  toasts: Toast[];
  toast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: number) => void;
  user: StoredUser | null;
  setUser: (user: StoredUser | null) => void;
};

const STORAGE_KEY = "aurel.bag.v1";
const StoreContext = createContext<StoreValue | null>(null);

function isBagItem(value: unknown): value is BagItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return typeof item.key === "string" && typeof item.slug === "string" && typeof item.price === "number";
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BagItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [bump, setBump] = useState(false);
  const toastId = useRef(0);

  // Restore the bag from storage and check for an active session.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed.filter(isBagItem));
      }
    } catch {
      /* storage unavailable or corrupted — start with an empty bag */
    }
    setHydrated(true);

    const controller = new AbortController();
    fetch("/api/auth/me", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { user?: StoredUser } | null) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable */
    }
  }, [items, hydrated]);

  useEffect(() => {
    document.body.style.overflow = overlay ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [overlay]);

  const dismissToast = useCallback((id: number) => {
    setToasts((list) => list.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    (next: Omit<Toast, "id">) => {
      const id = ++toastId.current;
      setToasts((list) => [...list.slice(-2), { ...next, id }]);
      window.setTimeout(() => dismissToast(id), 4800);
    },
    [dismissToast],
  );

  const addItem = useCallback(
    (product: AddableProduct, size: string, color: string, qty = 1) => {
      const key = `${product.slug}|${size}|${color}`;
      setItems((list) => {
        const existing = list.find((item) => item.key === key);
        if (existing) {
          return list.map((item) => (item.key === key ? { ...item, qty: Math.min(9, item.qty + qty) } : item));
        }
        return [...list, { key, slug: product.slug, name: product.name, price: product.price, size, color, image: product.image, qty: Math.min(9, qty) }];
      });
      setBump(true);
      window.setTimeout(() => setBump(false), 520);
      toast({
        title: "Added to bag",
        description: `${product.name} · ${size} · ${color}`,
        image: product.image,
        tone: "success",
        action: "bag",
      });
    },
    [toast],
  );

  const setQty = useCallback((key: string, qty: number) => {
    setItems((list) =>
      qty <= 0 ? list.filter((item) => item.key !== key) : list.map((item) => (item.key === key ? { ...item, qty: Math.min(9, qty) } : item)),
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((list) => list.filter((item) => item.key !== key));
  }, []);

  const clearBag = useCallback(() => setItems([]), []);
  const closeOverlay = useCallback(() => setOverlay(null), []);
  const openBag = useCallback(() => setOverlay("bag"), []);
  const openSearch = useCallback(() => setOverlay("search"), []);
  const openAccount = useCallback(() => setOverlay("account"), []);
  const openMenu = useCallback(() => setOverlay("menu"), []);

  const count = useMemo(() => items.reduce((sum, item) => sum + item.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.qty * item.price, 0), [items]);

  const value = useMemo<StoreValue>(
    () => ({
      items,
      count,
      subtotal,
      bump,
      addItem,
      setQty,
      removeItem,
      clearBag,
      isBagOpen: overlay === "bag",
      isSearchOpen: overlay === "search",
      isAccountOpen: overlay === "account",
      isMenuOpen: overlay === "menu",
      openBag,
      openSearch,
      openAccount,
      openMenu,
      closeOverlay,
      toasts,
      toast,
      dismissToast,
      user,
      setUser,
    }),
    [
      items,
      count,
      subtotal,
      bump,
      addItem,
      setQty,
      removeItem,
      clearBag,
      overlay,
      openBag,
      openSearch,
      openAccount,
      openMenu,
      closeOverlay,
      toasts,
      toast,
      dismissToast,
      user,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside <StoreProvider>");
  return context;
}
