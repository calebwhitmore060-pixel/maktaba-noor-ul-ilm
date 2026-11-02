"use client";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "../../components/ProductCard";
import { CATEGORIES, FALLBACK_PRODUCTS, categoryName } from "../../lib/products";

function ShopInner() {
  const params = useSearchParams();
  const initialCat = params.get("cat") || "";
  const initialQ = params.get("q") || "";
  const [cat, setCat] = useState(initialCat);
  const [q, setQ] = useState(initialQ);
  const [sort, setSort] = useState("featured");
  const list = useMemo(() => {
    let out = [...FALLBACK_PRODUCTS];
    if (cat) out = out.filter((p) => p.category_id === cat);
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      out = out.filter((p) => p.name.toLowerCase().includes(needle) || categoryName(p.category_id).toLowerCase().includes(needle));
    }
    if (sort === "price-asc") out.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") out.sort((a, b) => b.price - a.price);
    if (sort === "featured") out.sort((a, b) => Number(b.featured) - Number(a.featured));
    return out;
  }, [cat, q, sort]);
  return (
    <>
      <div className="shop-banner">
        <h1>All Books ({list.length})</h1>
        <p>Browse the full supplied catalogue — filter by category, search by title, or sort by price.</p>
      </div>
      <div className="toolbar">
        <div className="filters">
          <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category">
            <option value="">All categories</option>
            {CATEGORIES.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title or category" aria-label="Search" />
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
            <option value="featured">Sort: Featured first</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
      </div>
      <p style={{ color: "#6B7280", fontSize: 14 }}>“Newest” sorting is not offered as a separate claim: the catalogue has no supplied dates, so seed order is used for featured ordering.</p>
      {list.length === 0 ? <p>No books match your search. Try another title or category.</p> : <div className="grid">{list.map((p) => <ProductCard key={p.slug} product={p} />)}</div>}
    </>
  );
}
export default function Shop() {
  return <Suspense><ShopInner /></Suspense>;
}
