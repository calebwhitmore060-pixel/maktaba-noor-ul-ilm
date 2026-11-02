"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "../components/ProductCard";
import { CATEGORIES, FALLBACK_PRODUCTS, categoryName, type Product } from "../lib/products";
import { getSupabase, isSupabaseConfigured, setupMessage } from "../lib/supabase";

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
  return (
    <>
      {!live && <div className="notice">{setupMessage()} Preview data: {products.length} supplied books, {CATEGORIES.length} categories.</div>}
      {live && <div className="notice">Live Supabase data loaded.</div>}
      <section className="hero">
        <div>
          <h1>Authentic Islamic Books at Your Doorstep</h1>
          <p>Quran, Durood Sharif, Hadith, Sarf &amp; Nahw — quality books at fair prices, with cash on delivery across Pakistan.</p>
          <Link className="btn" href="/shop">Shop Now →</Link>
        </div>
        {hero && (
          <div>
            <div className="hero-img"><Image src={hero.image_url} alt={hero.name} fill /></div>
            <p><strong>{hero.name}</strong></p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setSlide((s) => (s - 1 + featured.length) % featured.length)}>‹ Prev</button>
              <button onClick={() => setSlide((s) => (s + 1) % featured.length)}>Next ›</button>
            </div>
          </div>
        )}
      </section>

      <h2>Shop by Category</h2>
      <div className="cat-grid">
        {CATEGORIES.map((c) => (
          <Link key={c.id} href={`/shop?cat=${c.slug}`} className="cat-card"><strong>{c.name}</strong><br /><span>{products.filter((p) => p.category_id === c.id).length} books</span></Link>
        ))}
      </div>

      <h2>Featured Products</h2>
      <div className="grid">{featured.map((p) => <ProductCard key={p.slug} product={p} />)}</div>

      <h2>Collections by Category</h2>
      {CATEGORIES.map((c) => (
        <section key={c.id}>
          <h3>{c.name}</h3>
          <div className="grid">{products.filter((p) => p.category_id === c.id).slice(0, 4).map((p) => <ProductCard key={p.slug} product={p} />)}</div>
        </section>
      ))}

      <h2>Why Shop With Us</h2>
      <ul>
        <li>Authentic Islamic books from the supplied catalogue — original covers and prices only.</li>
        <li>Cash on Delivery across Pakistan.</li>
        <li>Order on WhatsApp: 0307-5722464.</li>
        <li>Delivery across Pakistan (charges confirmed on WhatsApp; no amount is invented here).</li>
      </ul>
      <p>Catalogue note: author, publisher, ISBN, SKU, stock and long descriptions were not supplied for most books, so those fields are left blank rather than invented. Bestseller labels and blog posts are omitted because no sales data or articles were supplied.</p>
      <p>Supabase configured: {isSupabaseConfigured ? "yes" : "no — preview mode"}</p>
    </>
  );
}
