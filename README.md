# Maktaba Noor-ul-Ilm — Next.js Bookstore (Vercel route)

Live InfinityFree sites are NOT touched by this project. This is a separate
Next.js app for deployment on Vercel with Supabase as the backend.

## 1. Supabase — create the tables (owner step, anon key cannot do this)

1. Open the Supabase project (https://fbxtihqzipbowsaudbcw.supabase.co) →
   Dashboard → SQL Editor → New query.
2. Paste the whole file `supabase/001_maktaba_schema_seed.sql` (also kept at
   `~/workspace/maktaba-supabase/001_maktaba_schema_seed.sql`) and click Run.
3. Expect: 8 categories, 50 products. Tables: categories, products, orders,
   order_items, with Row Level Security (public read on categories/products).

## 2. Create the admin user (owner step)

Supabase Dashboard → Authentication → Users → Add user, with the admin email
and a strong password. There is NO default admin account in this code, and
`/admin` refuses access without a Supabase login.

## 3. Vercel — deploy (owner step)

1. Push this folder to GitHub (or import it in Vercel) and import the project.
2. In Vercel → Project Settings → Environment Variables, set exactly:
   - `NEXT_PUBLIC_SUPABASE_URL` = your project URL (the one you already have)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Publishable key (the user holds
     this; it is NOT in this repo, in any .env file, or in any log)
   - `NEXT_PUBLIC_SITE_URL` = your Vercel domain, e.g. https://your-site.vercel.app
3. Deploy. The app renders a clear setup message (and a labelled preview of
   the supplied catalogue) when the Supabase vars are missing, instead of crashing.

## 4. Test checkout with a test order (after steps 1–3)

1. Open the Vercel site → /shop → add any book → /checkout.
2. Fill name, phone, city, address → Place Order (COD).
3. Check Supabase Dashboard → Table Editor → orders: the order must appear
   with status Pending, and order_items must list the book.
4. Log in at /admin with the admin user from step 2 → change that order to
   Confirmed, then Shipped, and confirm the status change persists on reload.
5. If Supabase is not configured, checkout instead opens a WhatsApp order
   (wa.me/923075722464) — that is the fallback, not a saved order.

## What is included

Homepage (announcement bar, header search, category mega-nav, hero slider
from featured covers, Shop by Category, Featured, Collections by category,
Why Shop With Us), /shop (category filter, search, price sort), product
pages (3:4 contain images, discount badge only when an original price was
supplied, quantity, Add to Cart, Buy Now, Wishlist, related products),
localStorage cart + counter, COD checkout, thank-you page, /admin login +
product/order lists + order status updates, SEO metadata, sitemap, robots.

## What is NOT included, and why

- No authors, publishers, ISBNs, SKUs, stock counts, page counts, languages
  or long descriptions: they were NOT supplied for most books, so those fields
  are blank/null in the UI and database, never invented.
- No delivery-charge amount: none was supplied. Checkout total = subtotal and
  shipping is shown as "confirmed on WhatsApp".
- No bestseller labels, no fake reviews, no blog posts, no newsletter
  backend: no sales data, reviews or articles were supplied.
- No online payment: the real business method is Cash on Delivery.
- No deployment claim: Vercel deployment and the SQL run need the owner's
  own Vercel account and Supabase Dashboard access, so they are steps above,
  not things this repo can do by itself.
- Product images still point at the live noorulilmfinal.42web.io covers
  (the original supplied photos). Moving them to Supabase Storage is a
  later, optional step and does not change any title or price.
