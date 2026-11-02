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
  const related = FALLBACK_PRODUCTS.filter((p) => p.category_id === product.category_id && p.slug !== product.slug).slice(0, 4);
  const waText = encodeURIComponent(`Assalam-o-Alaikum! I want to order: ${product.name} (${formatRs(product.price)}) x ${qty}`);
  return (
    <>
      <p><Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / {categoryName(product.category_id)}</p>
      <div className="detail">
        <div className="detail-img"><Image src={product.image_url} alt={product.name} width={600} height={800} /></div>
        <div>
          <h1>{product.name}</h1>
          <p>Category: {categoryName(product.category_id)}</p>
          <p className="price"><strong>{formatRs(product.price)}</strong>{product.original_price && <><del>{formatRs(product.original_price)}</del><span className="badge">{disc}% OFF</span></>}</p>
          <p>Availability: in the supplied catalogue. Author, publisher, ISBN, SKU, stock, pages, language and binding are not shown because they were not supplied — they are not invented here.</p>
          <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "12px 0" }}>
            <label>Quantity <input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} style={{ width: 70, padding: 8 }} /></label>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn" onClick={() => addToCart(product, qty)}>Add to Cart</button>
            <Link className="btn" href="/checkout" onClick={() => addToCart(product, qty)}>Buy Now</Link>
            <button className="btn" onClick={() => toggleWishlist(product)}>♡ Wishlist</button>
            <a className="btn" href={`${WHATSAPP_URL}?text=${waText}`} target="_blank" rel="noreferrer">Order on WhatsApp</a>
          </div>
        </div>
      </div>
      <h2>Related Products</h2>
      <div className="grid">{related.map((p) => <ProductCard key={p.slug} product={p} />)}</div>
    </>
  );
}
