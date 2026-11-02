import type { MetadataRoute } from "next";
import { FALLBACK_PRODUCTS, CATEGORIES } from "../lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "";
  if (!base) return [];
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/shop`, lastModified: new Date() },
    ...CATEGORIES.map((c) => ({ url: `${base}/shop?cat=${c.slug}`, lastModified: new Date() })),
    ...FALLBACK_PRODUCTS.map((p) => ({ url: `${base}/product/${p.slug}`, lastModified: new Date() })),
  ];
}
