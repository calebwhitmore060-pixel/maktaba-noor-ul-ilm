"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "./products";

export type CartItem = { product: Product; qty: number };
type Store = {
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (p: Product, qty?: number) => void;
  removeFromCart: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (p: Product) => void;
  cartCount: number;
};

const Ctx = createContext<Store | null>(null);
export const useStore = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("store not ready");
  return v;
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  useEffect(() => {
    try {
      const c = localStorage.getItem("maktaba-cart");
      const w = localStorage.getItem("maktaba-wishlist");
      if (c) setCart(JSON.parse(c));
      if (w) setWishlist(JSON.parse(w));
    } catch { /* ignore corrupt local storage */ }
  }, []);
  useEffect(() => { try { localStorage.setItem("maktaba-cart", JSON.stringify(cart)); } catch {} }, [cart]);
  useEffect(() => { try { localStorage.setItem("maktaba-wishlist", JSON.stringify(wishlist)); } catch {} }, [wishlist]);

  const addToCart = (p: Product, qty = 1) =>
    setCart((prev) => {
      const found = prev.find((i) => i.product.slug === p.slug);
      if (found) return prev.map((i) => (i.product.slug === p.slug ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { product: p, qty }];
    });
  const removeFromCart = (slug: string) => setCart((prev) => prev.filter((i) => i.product.slug !== slug));
  const setQty = (slug: string, qty: number) =>
    setCart((prev) => qty <= 0 ? prev.filter((i) => i.product.slug !== slug) : prev.map((i) => (i.product.slug === slug ? { ...i, qty } : i)));
  const clearCart = () => setCart([]);
  const toggleWishlist = (p: Product) =>
    setWishlist((prev) => (prev.some((x) => x.slug === p.slug) ? prev.filter((x) => x.slug !== p.slug) : [...prev, p]));

  return (
    <Ctx.Provider value={{ cart, wishlist, addToCart, removeFromCart, setQty, clearCart, toggleWishlist, cartCount: cart.reduce((s, i) => s + i.qty, 0) }}>
      {children}
    </Ctx.Provider>
  );
}
export const WHATSAPP_URL = "https://wa.me/923075722464";
export const formatRs = (n: number) => `PKR ${n.toLocaleString("en-PK")}/-`;
