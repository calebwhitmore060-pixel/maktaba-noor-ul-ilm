"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "../components/ProductCard";
import { CATEGORIES, FALLBACK_PRODUCTS, type Product } from "../lib/products";
import { getSupabase } from "../lib/supabase";

export default function Home() {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    sb.from("products").select("id,name,slug,price,original_price,image_url,detail_url,category_id,featured").then(({ data, error }) => {
      if (!error && data && data.length > 0) { setProducts(data as Product[]); }
    });
  }, []);
  const featured = products.filter((p) => p.featured);
  const BANNERS = [
    { src: "/banners/hero-1.jpg", alt: "Featured Islamic Books — Shop Now" },
    { src: "/banners/hero-2.jpg", alt: "Cash on Delivery across Pakistan — Shop Now" },
    { src: "/banners/hero-3.jpg", alt: "Quran, Durood and Sarf books — Shop Now" },
  ];
  const hero = BANNERS[slide % BANNERS.length];
  const firstOf = (catId: string) => products.find((p) => p.category_id === catId);
  return (
    <div className="home-flow">
      <section className="hero-slider order-hero" aria-label="Featured books">
        <Link href="/shop" className="hero-slide" aria-label={hero.alt}>
          <Image src={hero.src} alt={hero.alt} fill priority />
        </Link>
        <button className="hero-arrow hero-prev" onClick={() => setSlide((s) => (s - 1 + BANNERS.length) % BANNERS.length)} aria-label="Previous banner">‹</button>
        <button className="hero-arrow hero-next" onClick={() => setSlide((s) => (s + 1) % BANNERS.length)} aria-label="Next banner">›</button>
        <div className="hero-slider-dots">
          {BANNERS.map((b, i) => (
            <button key={b.src} className={i === slide ? "active" : ""} onClick={() => setSlide(i)} aria-label={`Show ${b.alt}`} />
          ))}
        </div>
      </section>

      <section className="section order-cat" id="categories">
        <div className="section-head cat-section-head">
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
                <span className="cat-tile-overlay"><strong>{c.name}</strong><span>{count} books</span></span>
                <span className="cat-tile-body">
                  <span><strong>{c.name}</strong><br /><span>{count} books</span></span>
                  <span className="cat-tile-arrow">→</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section order-featured">
        <div className="section-head section-bar">
          <div>
            <p className="eyebrow">Handpicked for you</p>
            <h2>Featured products</h2>
          </div>
          <Link className="view-all" href="/shop">View all →</Link>
        </div>
        <div className="grid">{featured.map((p) => <ProductCard key={p.slug} product={p} />)}</div>
      </section>

      <section className="section order-collections">
        <div className="section-head">
          <div>
            <p className="eyebrow">Shop by collection</p>
            <h2>Collections by category</h2>
          </div>
          <p>Every collection below is one of the store&apos;s own categories, shown with its real books and prices.</p>
        </div>
        {CATEGORIES.map((c) => {
          const items = products.filter((p) => p.category_id === c.id).slice(0, 4);
          if (items.length === 0) return null;
          return (
            <div key={c.id} style={{ marginBottom: 30 }}>
              <div className="section-head section-bar" style={{ marginBottom: 12 }}>
                <h2>{c.name}</h2>
                <Link className="view-all" href={`/shop?cat=${c.slug}`}>View all →</Link>
              </div>
              <div className="grid">{items.map((p) => <ProductCard key={p.slug} product={p} />)}</div>
            </div>
          );
        })}
      </section>

      <section className="section order-why">
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
    </div>
  );
}
