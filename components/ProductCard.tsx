"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { categoryName, discountPct, type Product } from "../lib/products";
import { useStore, formatRs } from "../lib/store";

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const disc = discountPct(product);
  const wished = wishlist.some((w) => w.slug === product.slug);
  return (
    <article className="card">
      <Link href={`/product/${product.slug}`} className="card-img" aria-label={product.name}>
        <Image src={product.image_url} alt={product.name} width={600} height={800} loading="lazy" />
        {disc > 0 && <span className="badge">-{disc}%</span>}
        <span className="card-tools">
          <button
            className={`tool-btn ${wished ? "active" : ""}`}
            onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          >
            {wished ? "♥" : "♡"}
          </button>
          <button className="tool-btn" onClick={(e) => { e.preventDefault(); router.push(`/product/${product.slug}`); }} aria-label={`Quick view ${product.name}`}>👁</button>
        </span>
      </Link>
      <div className="card-body">
        <span className="card-cat">{categoryName(product.category_id)}</span>
        <h3><Link href={`/product/${product.slug}`}>{product.name}</Link></h3>
        <p className="price">
          <strong>{formatRs(product.price)}</strong>
          {product.original_price && (
            <>
              <del>{formatRs(product.original_price)}</del>
              <span className="pct">-{disc}%</span>
            </>
          )}
        </p>
        <div className="card-actions">
          <button className="btn" onClick={() => addToCart(product)}>Add to Cart</button>
          <Link className="quick-link" href={`/product/${product.slug}`}>View Details →</Link>
        </div>
      </div>
    </article>
  );
}
