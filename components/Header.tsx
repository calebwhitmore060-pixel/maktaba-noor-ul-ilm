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
  const [drawer, setDrawer] = useState(false);
  return (
    <header className="site-header">
      <div className="topbar">
        <div className="topbar-inner">
          <span>FOR ORDERS INFO CALL / WHATSAPP +92-307 5722464</span>
          <span>Cash on Delivery across Pakistan</span>
          <span className="topbar-social">
            <a href="https://www.facebook.com/onlinebooks8076">Facebook</a>
            {" · "}
            <a href="https://instagram.com/maktabanoorulilm">Instagram</a>
          </span>
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
        <form className="search" action="/shop" method="get">
          <input value={q} onChange={(e) => setQ(e.target.value)} name="q" placeholder="Search Products" aria-label="Search products" />
          <select name="cat" aria-label="All Categories" defaultValue="">
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <button type="submit" aria-label="Search">🔍</button>
        </form>
        <div className="mobile-icons">
          <button className="icon-btn drawer-btn" onClick={() => setDrawer(true)} aria-label="Open menu">☰</button>
          <Link className="icon-btn" href="/cart" aria-label={`Cart, ${cartCount} items`}>🛒<span className="pill-count"> {cartCount}</span></Link>
          <span className="icon-btn" title="Wishlist items" aria-label={`Wishlist, ${wishlist.length} items`}>♡<span className="pill-count">{wishlist.length}</span></span>
          <Link className="icon-btn" href="/admin" aria-label="Account">👤</Link>
        </div>
      </div>
      <nav className="catnav" aria-label="Categories">
        <div className="catnav-inner">
          <button className="menu-btn" onClick={() => setOpen(!open)} aria-expanded={open}>☰ Categories ▾</button>
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.id} href={`/shop?cat=${c.slug}`}>{c.name}</Link>
          ))}
          <Link href="/checkout">Checkout</Link>
          <Link href="/#contact">Contact</Link>
          <div className={`mega-panel ${open ? "open" : ""}`}>
            {CATEGORIES.map((c) => (
              <Link key={c.id} href={`/shop?cat=${c.slug}`} onClick={() => setOpen(false)}>{c.name} →</Link>
            ))}
          </div>
        </div>
      </nav>
      {drawer && (
        <>
          <div className="drawer-overlay" onClick={() => setDrawer(false)} aria-hidden="true" />
          <aside className="drawer" aria-label="Site menu">
            <div className="drawer-head">
              <span className="footer-brand">Maktaba <em>Noor-ul-Ilm</em></span>
              <button className="drawer-close" onClick={() => setDrawer(false)} aria-label="Close menu">✕</button>
            </div>
            <form className="drawer-search" action="/shop" method="get" onSubmit={(e) => { if (!q.trim()) e.preventDefault(); }}>
              <input value={q} onChange={(e) => setQ(e.target.value)} name="q" placeholder="Search books…" aria-label="Search books" />
              <button type="submit">Search</button>
            </form>
            <nav className="drawer-links">
              <Link href="/" onClick={() => setDrawer(false)}>Home</Link>
              <Link href="/shop" onClick={() => setDrawer(false)}>All Books</Link>
              <Link href="/cart" onClick={() => setDrawer(false)}>Cart ({cartCount})</Link>
              <Link href="/checkout" onClick={() => setDrawer(false)}>Checkout (COD)</Link>
              <Link href="/admin" onClick={() => setDrawer(false)}>Admin</Link>
            </nav>
            <p className="drawer-title">All Categories</p>
            <nav className="drawer-links">
              {CATEGORIES.map((c) => (
                <Link key={c.id} href={`/shop?cat=${c.slug}`} onClick={() => setDrawer(false)}>{c.name} →</Link>
              ))}
            </nav>
            <p className="drawer-foot">WhatsApp: <a href="https://wa.me/923075722464">0307-5722464</a><br />Cash on Delivery across Pakistan</p>
          </aside>
        </>
      )}
    </header>
  );
}
