"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "../../../components/ProductCard";
import { FALLBACK_PRODUCTS, categoryName, discountPct } from "../../../lib/products";
import { useStore, formatRs, WHATSAPP_URL } from "../../../lib/store";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [qty, setQty] = useState(1);
  const { addToCart, toggleWishlist } = useStore();
  const product = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
  if (!product) return <p>Book not found. <Link href="/shop">Back to shop</Link></p>;
  const disc = discountPct(product);
  const related = FALLBACK_PRODUCTS.filter((p) => p.category_id === product.category_id && p.slug !== product.slug).slice(0, 5);
  const waText = encodeURIComponent(`Assalam-o-Alaikum! I want to order: ${product.name} (${formatRs(product.price)}) x ${qty}`);
  return (
    <>
      <p className="breadcrumb"><Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / {categoryName(product.category_id)}</p>
      <div className="detail">
        <div className="detail-img">
          <Image src={product.image_url} alt={product.name} width={600} height={800} />
          {disc > 0 && <span className="badge" style={{ position: "absolute" }}>-{disc}%</span>}
        </div>
        <div>
          <span className="chip">{categoryName(product.category_id)}</span>
          <h1>{product.name}</h1>
          <p className="detail-price">{formatRs(product.price)}{product.original_price && <><del>{formatRs(product.original_price)}</del> <span style={{ color: "#B42318", fontSize: 17 }}>Save {disc}%</span></>}</p>
          <p style={{ color: "#6B7280" }}>Availability: in the supplied catalogue. Author, publisher, ISBN, SKU, stock, pages, language and binding are not shown because they were not supplied — they are not invented here.</p>
          <div style={{ display: "flex", gap: 12, alignItems: "center", margin: "16px 0", flexWrap: "wrap" }}>
            <span style={{ fontWeight: 700 }}>Quantity</span>
            <span className="qty">
              <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">−</button>
              <input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} aria-label="Quantity" />
              <button type="button" onClick={() => setQty(qty + 1)} aria-label="Increase quantity">+</button>
            </span>
          </div>
          <div className="detail-actions">
            <button className="btn" onClick={() => addToCart(product, qty)}>Add to Cart</button>
            <Link className="btn-gold" href="/checkout" onClick={() => addToCart(product, qty)}>Buy Now</Link>
            <button className="btn" style={{ background: "#fff", color: "#123D32", border: "2px solid #123D32" }} onClick={() => toggleWishlist(product)}>♡ Wishlist</button>
            <a className="btn" style={{ background: "#25D366" }} href={`${WHATSAPP_URL}?text=${waText}`} target="_blank" rel="noreferrer">Order on WhatsApp</a>
          </div>
          <div className="summary">
            <p style={{ margin: 0 }}><strong>Cash on Delivery</strong> · Shipping confirmed on WhatsApp — no delivery charge amount is stated here because none was supplied.</p>
          </div>
        </div>
      </div>
      <section className="section">
        <div className="section-head">
          <div><p className="eyebrow">You may also like</p><h2>Related products</h2></div>
          <Link className="view-all" href={`/shop?cat=${product.category_id}`}>View all in this category →</Link>
        </div>
        <div className="grid">{related.map((p) => <ProductCard key={p.slug} product={p} />)}</div>
      </section>
    </>
  );
}
