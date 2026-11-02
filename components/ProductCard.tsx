"use client";
import Link from "next/link";
import Image from "next/image";
import { discountPct, type Product } from "../lib/products";
import { useStore, formatRs } from "../lib/store";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const disc = discountPct(product);
  const wished = wishlist.some((w) => w.slug === product.slug);
  return (
    <article className="card">
      <Link href={`/product/${product.slug}`} className="card-img">
        <Image src={product.image_url} alt={product.name} width={600} height={800} loading="lazy" />
        {disc > 0 && <span className="badge">{disc}% OFF</span>}
      </Link>
      <div className="card-body">
        <Link href={`/product/${product.slug}`}><h3>{product.name}</h3></Link>
        <p className="price">
          <strong>{formatRs(product.price)}</strong>
          {product.original_price && <del>{formatRs(product.original_price)}</del>}
        </p>
        <div className="card-actions">
          <button onClick={() => addToCart(product)}>Add to Cart</button>
          <button onClick={() => toggleWishlist(product)} aria-label="Wishlist">{wished ? "♥ Saved" : "♡ Wishlist"}</button>
          <Link href={`/product/${product.slug}`}>Quick View</Link>
        </div>
      </div>
    </article>
  );
}
