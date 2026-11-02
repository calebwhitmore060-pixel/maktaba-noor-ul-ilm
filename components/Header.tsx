"use client";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "../lib/store";
import { CATEGORIES } from "../lib/products";
import LogoMark from "./Logo";

export default function Header() {
  const { cartCount, wishlist } = useStore();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="topbar">
        <div className="topbar-inner">
          <span>Cash on Delivery across Pakistan</span>
          <span>Order on WhatsApp: <a href="https://wa.me/923075722464">0307-5722464</a></span>
          <span>Authentic books · Fair prices</span>
        </div>
      </div>
      <div className="header-main">
        <Link href="/" className="logo-link">
          <LogoMark />
          <span>
            <span className="brand-name">Maktaba <em>Noor-ul-Ilm</em></span>
            <span className="brand-tag">Islamic Bookstore · Lahore</span>
          </span>
        </Link>
        <form className="search" action="/shop" method="get" onSubmit={(e) => { if (!q.trim()) e.preventDefault(); }}>
          <input value={q} onChange={(e) => setQ(e.target.value)} name="q" placeholder="Search books — try durood, sarf, quran…" aria-label="Search books" />
          <button type="submit">Search</button>
        </form>
        <nav className="header-cta" aria-label="Account and cart">
          <Link className="pill" href="/shop">Shop</Link>
          <Link className="pill" href="/cart">🛒 Cart <span className="pill-count">{cartCount}</span></Link>
          <span className="pill" title="Wishlist items">♡ Wishlist <span className="pill-count">{wishlist.length}</span></span>
          <Link className="pill" href="/admin">Admin</Link>
        </nav>
      </div>
      <nav className="catnav" aria-label="Categories">
        <div className="catnav-inner">
          <button className="menu-btn" onClick={() => setOpen(!open)} aria-expanded={open}>☰ All Categories ▾</button>
          <Link href="/">Home</Link>
          <Link href="/shop">All Books</Link>
          {CATEGORIES.slice(0, 5).map((c) => (
            <Link key={c.id} href={`/shop?cat=${c.slug}`}>{c.name}</Link>
          ))}
          <Link href="/checkout">Checkout</Link>
          <div className={`mega-panel ${open ? "open" : ""}`}>
            {CATEGORIES.map((c) => (
              <Link key={c.id} href={`/shop?cat=${c.slug}`} onClick={() => setOpen(false)}>{c.name} →</Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
