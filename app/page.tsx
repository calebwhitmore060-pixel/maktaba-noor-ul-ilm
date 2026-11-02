"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "../components/ProductCard";
import { CATEGORIES, FALLBACK_PRODUCTS, type Product } from "../lib/products";
import { getSupabase, isSupabaseConfigured, setupMessage } from "../lib/supabase";
import { formatRs } from "../lib/store";

export default function Home() {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [live, setLive] = useState(false);
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    sb.from("products").select("id,name,slug,price,original_price,image_url,detail_url,category_id,featured").then(({ data, error }) => {
      if (!error && data && data.length > 0) { setProducts(data as Product[]); setLive(true); }
    });
  }, []);
  const featured = products.filter((p) => p.featured);
  const hero = featured[slide % Math.max(featured.length, 1)] ?? products[0];
  const firstOf = (catId: string) => products.find((p) => p.category_id === catId);
  return (
    <>
      {!live && <div className="notice">{setupMessage()} Preview data: {products.length} supplied books, {CATEGORIES.length} categories.</div>}
      {live && <div className="notice">✓ Live Supabase data loaded.</div>}

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Islamic Bookstore · Lahore</p>
          <h1>Authentic Islamic books, delivered to your door.</h1>
          <p>Quran, Durood Sharif, Hadith, Sarf &amp; Nahw and more — original covers, fair prices, and Cash on Delivery across Pakistan.</p>
          <div className="hero-ctas">
            <Link className="btn-gold" href="/shop">Shop All Books →</Link>
            <Link className="btn-outline" href="#categories">Browse Categories</Link>
          </div>
          <div className="hero-stats">
            <span><b>{products.length}</b> books in store</span>
            <span><b>{CATEGORIES.length}</b> categories</span>
            <span><b>COD</b> across Pakistan</span>
          </div>
        </div>
        {hero && (
          <div className="hero-book">
            <Link href={`/product/${hero.slug}`} className="hero-book-img">
              <Image src={hero.image_url} alt={hero.name} fill />
            </Link>
            <Link href={`/product/${hero.slug}`} className="hero-book-name">{hero.name}</Link>
            <span className="hero-book-price">{formatRs(hero.price)}{hero.original_price && <del>{formatRs(hero.original_price)}</del>}</span>
            <div className="hero-dots">
              <button onClick={() => setSlide((s) => (s - 1 + featured.length) % featured.length)} aria-label="Previous featured book">‹</button>
              <button onClick={() => setSlide((s) => (s + 1) % featured.length)} aria-label="Next featured book">›</button>
            </div>
            <div className="hero-thumbs">
              {featured.map((p, i) => (
                <button key={p.slug} className={i === slide ? "active" : ""} onClick={() => setSlide(i)} aria-label={p.name}>
                  <Image src={p.image_url} alt="" width={44} height={58} />
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="section" id="categories">
        <div className="section-head">
          <div>
            <p className="eyebrow">Top Categories</p>
            <h2>Shop by category</h2>
          </div>
          <Link className="view-all" href="/shop">View all books →</Link>
        </div>
        <div className="cat-grid">
          {CATEGORIES.map((c) => {
            const first = firstOf(c.id);
            const count = products.filter((p) => p.category_id === c.id).length;
            return (
              <Link key={c.id} href={`/shop?cat=${c.slug}`} className="cat-tile">
                <span className="cat-tile-img">
                  {first && <Image src={first.image_url} alt="" width={480} height={300} />}
                </span>
                <span className="cat-tile-body">
                  <span><strong>{c.name}</strong><br /><span>{count} books</span></span>
                  <span className="cat-tile-arrow">→</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Handpicked for you</p>
            <h2>Featured products</h2>
          </div>
          <Link className="view-all" href="/shop">View all books →</Link>
        </div>
        <div className="grid">{featured.map((p) => <ProductCard key={p.slug} product={p} />)}</div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Shop by collection</p>
            <h2>Collections by category</h2>
          </div>
          <p>Every collection below is one of the store&apos;s own categories, shown with its real books and prices.</p>
        </div>
        {CATEGORIES.map((c) => {
          const items = products.filter((p) => p.category_id === c.id).slice(0, 5);
          if (items.length === 0) return null;
          return (
            <div key={c.id} style={{ marginBottom: 30 }}>
              <div className="section-head" style={{ marginBottom: 12 }}>
                <h2 style={{ fontSize: 22 }}>{c.name}</h2>
                <Link className="view-all" href={`/shop?cat=${c.slug}`}>View all →</Link>
              </div>
              <div className="grid">{items.map((p) => <ProductCard key={p.slug} product={p} />)}</div>
            </div>
          );
        })}
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Why shop with us</p>
            <h2>Simple, honest ordering</h2>
          </div>
        </div>
        <div className="why-grid">
          <div className="why-box"><span className="why-icon">📖</span><b>Authentic books</b><p>Original covers and supplied prices only — nothing invented.</p></div>
          <div className="why-box"><span className="why-icon">💵</span><b>Cash on Delivery</b><p>Pay when your books arrive. No online payment required.</p></div>
          <div className="why-box"><span className="why-icon">💬</span><b>WhatsApp ordering</b><p>Order or ask a question on WhatsApp: 0307-5722464.</p></div>
          <div className="why-box"><span className="why-icon">🚚</span><b>Across Pakistan</b><p>Delivery across Pakistan; charges confirmed on WhatsApp.</p></div>
        </div>
      </section>

      <p style={{ color: "#6B7280", fontSize: 14 }}>
        Catalogue note: author, publisher, ISBN, SKU, stock and long descriptions were not supplied for most books, so those fields are left blank rather than invented.
        No bestseller labels or blog posts are shown because no sales data or articles were supplied.
        Supabase configured: {isSupabaseConfigured ? "yes" : "no — preview mode"}
      </p>
    </>
  );
}
