"use client";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "../lib/store";
import { CATEGORIES } from "../lib/products";

export default function Header() {
  const { cartCount, wishlist } = useStore();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  return (
    <header>
      <div className="topbar">Cash on Delivery across Pakistan &nbsp;·&nbsp; Order on WhatsApp: 0307-5722464</div>
      <div className="header-main">
        <Link href="/" className="brand">Maktaba <span>Noor Ul Ilm</span><small>Authentic Islamic Books — Lahore</small></Link>
        <form className="search" action="/shop" method="get" onSubmit={(e) => { if (!q.trim()) e.preventDefault(); }}>
          <input value={q} onChange={(e) => setQ(e.target.value)} name="q" placeholder="Search books, e.g. durood, sarf, quran" aria-label="Search books" />
          <button type="submit">Search</button>
        </form>
        <nav className="header-cta">
          <Link href="/shop">Shop</Link>
          <Link href="/cart">Cart ({cartCount})</Link>
          <span title="Wishlist items">Wishlist ({wishlist.length})</span>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
      <nav className="mega">
        <button className="menu-btn" onClick={() => setOpen(!open)} aria-expanded={open}>Categories ▾</button>
        <Link href="/">Home</Link>
        <Link href="/shop">All Books</Link>
        <div className={`mega-panel ${open ? "open" : ""}`}>
          {CATEGORIES.map((c) => (
            <Link key={c.id} href={`/shop?cat=${c.slug}`}>{c.name}</Link>
          ))}
        </div>
        <Link href="/shop?cat=quran">Quran</Link>
        <Link href="/shop?cat=hadith">Hadith</Link>
        <Link href="/checkout">Checkout</Link>
      </nav>
    </header>
  );
}
