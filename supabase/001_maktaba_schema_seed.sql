-- Maktaba Noor-ul-Ilm — Supabase migration 001
-- Project: fbxtihqzipbowsaudbcw | Run in Supabase Dashboard > SQL Editor > New query > Run
-- Source of truth: 50 priced books from noorulilmfinal site search-index (titles, prices, images, categories).
-- NOT invented: author, publisher, ISBN, SKU, stock, descriptions are NULL until friend supplies them.
-- Image URLs point to the live noorulilmfinal covers (original supplied photos); move to Supabase Storage later if wanted.

create table if not exists categories (
  id text primary key,
  name text not null,
  slug text not null unique
);

create table if not exists products (
  id text primary key,
  name text not null,
  slug text not null unique,
  price integer not null check (price > 0),
  original_price integer,
  image_url text not null,
  detail_url text,
  category_id text not null references categories(id),
  featured boolean not null default false,
  author text, publisher text, isbn text, sku text, stock_quantity integer,
  description text, short_description text, language text
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null, phone text not null, city text, address text,
  payment_method text not null default 'COD', status text not null default 'Pending',
  total integer not null, created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id text not null references products(id),
  quantity integer not null check (quantity > 0), unit_price integer not null
);

alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
create policy "public read categories" on categories for select using (true);
create policy "public read products" on products for select using (true);

insert into categories (id, name, slug) values ('quran', 'Quran & Tafseer', 'quran') on conflict (id) do nothing;
insert into categories (id, name, slug) values ('durood', 'Durood Sharif', 'durood') on conflict (id) do nothing;
insert into categories (id, name, slug) values ('sarf', 'Sarf & Nahw', 'sarf') on conflict (id) do nothing;
insert into categories (id, name, slug) values ('hadith', 'Hadith', 'hadith') on conflict (id) do nothing;
insert into categories (id, name, slug) values ('fiqh', 'Fiqh & Fatawa', 'fiqh') on conflict (id) do nothing;
insert into categories (id, name, slug) values ('seerat', 'Seerat & Biographies', 'seerat') on conflict (id) do nothing;
insert into categories (id, name, slug) values ('ramadan', 'Ramadan', 'ramadan') on conflict (id) do nothing;
insert into categories (id, name, slug) values ('general', 'General Islamic Books', 'general') on conflict (id) do nothing;

insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-01', 'Noor-ul-Ilm Tracing Quran Pak', 'tracing-quran', 2490, 2790, 'https://noorulilmfinal.42web.io/assets/books/tracing-quran-1.jpg', '/tracing-quran.html', 'quran', true) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-02', 'Durood Writing Diary', 'durood-diary', 950, NULL, 'https://noorulilmfinal.42web.io/assets/books/durood-diary-1.jpg', '/durood-diary.html', 'durood', true) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-03', 'Sarfi Research — 14,000 Quranic Words', 'sarfi-research', 2980, NULL, 'https://noorulilmfinal.42web.io/assets/books/sarfi-research-1.jpg', '/sarfi-research.html', 'sarf', true) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-04', 'Sihah Sittah — Maktaba Bushra (Complete Set)', 'sihah-sittah', 12500, NULL, 'https://noorulilmfinal.42web.io/assets/books/sihah-sittah-1.jpg', '/sihah-sittah.html', 'hadith', true) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-05', 'Sawa Lakh Durood Diary', 'sawa-lakh-durood', 1990, NULL, 'https://noorulilmfinal.42web.io/assets/books/sawa-lakh-durood-1.jpg', '/sawa-lakh-durood.html', 'durood', true) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-06', 'Tarakib-e-Quran', 'tarakib-quran', 3300, 3500, 'https://noorulilmfinal.42web.io/assets/books/tarakib-quran-1.jpg', '/tarakib-quran.html', 'sarf', true) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-07', 'Al-Sarf fi Sigh Al-Quran', 'alsarf-quran', 1900, 2200, 'https://noorulilmfinal.42web.io/assets/books/alsarf-quran-1.jpg', '/alsarf-quran.html', 'sarf', true) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-08', 'Encyclopedia — Answers to the Doubts of the Hadith-Deniers', 'book-01', 1850, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-01.jpg', '/book-01.html', 'hadith', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-09', 'Wah Ahle Sunnat — A Scholarly Encyclopedia', 'book-03', 1500, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-03.jpg', '/book-03.html', 'general', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-10', 'Pakistani Laws in the Light of Islam', 'book-04', 850, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-04.jpg', '/book-04.html', 'fiqh', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-11', 'Kanz-ut-Ta''rifat — Essential for Every Dars-e-Nizami Student', 'book-05', 650, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-05.jpg', '/book-05.html', 'general', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-12', 'Children''s Durood Diary', 'book-06', 1000, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-06.jpg', '/book-06.html', 'durood', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-13', 'The Best Book of Nahw', 'book-07', 850, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-07.jpg', '/book-07.html', 'sarf', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-14', 'Gardan Encyclopedia', 'book-09', 1490, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-09.jpg', '/book-09.html', 'sarf', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-15', 'Thirty Lessons of Quran & Hadith', 'book-10', 1150, 1600, 'https://noorulilmfinal.42web.io/assets/books/catalog-10.jpg', '/book-10.html', 'quran', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-16', 'Two Excellent Books (Set)', 'book-11', 600, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-11.jpg', '/book-11.html', 'general', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-17', 'Ilm-e-Sarf Made Practical', 'book-13', 250, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-13.jpg', '/book-13.html', 'sarf', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-18', 'Dars-e-Nizami and a Successful Life', 'book-14', 490, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-14.jpg', '/book-14.html', 'general', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-19', 'Aghraaz-e-Jalalain — First Three Parahs', 'book-15', 890, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-15.jpg', '/book-15.html', 'quran', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-20', 'Safar-e-Ishq — Durood Writing Diary', 'book-16', 950, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-16.jpg', '/book-16.html', 'durood', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-21', 'Mutalia: Kya, Kyun, Kaise — A Beneficial Book', 'book-17', 490, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-17.jpg', '/book-17.html', 'general', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-22', 'Sawa Lakh Durood Diary — Expanded Edition', 'book-18', 2250, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-18.jpg', '/book-18.html', 'durood', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-23', 'Dalail-e-Ahnaf — One Issue, One Hadith', 'book-22', 1500, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-22.jpg', '/book-22.html', 'hadith', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-24', 'Ramadan Encyclopedia', 'book-30', 1100, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-30.jpg', '/book-30.html', 'ramadan', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-25', 'Sharh of Al-Nahw al-Wazeh', 'book-39', 600, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-39.jpg', '/book-39.html', 'sarf', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-26', 'Ilm, Aalim, Mutaallim, Muallim — Fazail, Faraiz, Aadab', 'book-56', 990, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-56.jpg', '/book-56.html', 'general', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-27', 'Tajreed Kutub-e-Arba', 'book-57', 5000, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-57.jpg', '/book-57.html', 'hadith', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-28', 'Tarjuma Kaise + Tarkeeb Kaise', 'book-58', 1150, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-58.jpg', '/book-58.html', 'sarf', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-29', 'Tarjuma Kaise Karen — An Excellent Book', 'book-59', 750, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-59.jpg', '/book-59.html', 'sarf', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-30', 'Qasas-ul-Anbiya — With Takhreej', 'book-60', 1350, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-60.jpg', '/book-60.html', 'seerat', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-31', 'Four Best Books Set — Sarfi & Nahvi', 'book-61', 1200, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-61.jpg', '/book-61.html', 'sarf', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-32', 'Almost 15,000 Seeghay of the Complete Quran — 4 Volumes', 'book-62', 2800, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-62.jpg', '/book-62.html', 'sarf', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-33', 'Jab Nahw Aap ko Uljha De', 'book-63', 450, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-63.jpg', '/book-63.html', 'sarf', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-34', 'Sharh Miata Aamil ki Naqshon Wali Tarakib', 'book-64', 400, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-64.jpg', '/book-64.html', 'sarf', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-35', 'Wah Ahle Sunnat Encyclopedia', 'book-65', 900, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-65.jpg', '/book-65.html', 'general', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-36', 'Fatawa Razvia Sharif', 'book-66', 35500, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-66.jpg', '/book-66.html', 'fiqh', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-37', 'Fatawa Faiz-ur-Rasool — Beiruti Style', 'book-67', 3300, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-67.jpg', '/book-67.html', 'fiqh', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-38', 'Madarij-un-Nubuwwat — Library Set', 'book-68', 2880, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-68.jpg', '/book-68.html', 'seerat', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-39', 'Fatawa Qazi Khan', 'book-69', 8500, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-69.jpg', '/book-69.html', 'fiqh', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-40', 'Al-Mustanad — Peer Ghulam Rasool Qasmi', 'book-70', 1450, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-70.jpg', '/book-70.html', 'seerat', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-41', 'Fiqhi Qawaid ka Tehqeeqi Mutalia', 'book-71', 1300, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-71.jpg', '/book-71.html', 'fiqh', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-42', 'Ramadan-ul-Mubarak ke Tees Duroos', 'book-72', 800, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-72.jpg', '/book-72.html', 'ramadan', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-43', 'Khubsurat Quran Majeed', 'book-73', 3200, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-73.jpg', '/book-73.html', 'quran', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-44', 'Fatawa Razvia ki Tees Jildon ka Khulasa', 'book-74', 1380, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-74.jpg', '/book-74.html', 'fiqh', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-45', 'Duroos-ul-Balagha ki Sharh — With Tarakib', 'book-75', 480, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-75.jpg', '/book-75.html', 'sarf', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-46', 'Nahvi Lateefay', 'book-76', 350, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-76.jpg', '/book-76.html', 'sarf', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-47', 'Best Nahvi Gift Book — Ten Separate Topics', 'book-77', 500, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-77.jpg', '/book-77.html', 'sarf', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-48', 'Ahadith-e-Sahihain', 'book-78', 1300, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-78.jpg', '/book-78.html', 'hadith', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-49', 'Noor-ul-Mubeen — Urdu Sharh', 'book-79', 200, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-79.jpg', '/book-79.html', 'general', false) on conflict (id) do nothing;
insert into products (id, name, slug, price, original_price, image_url, detail_url, category_id, featured) values ('book-50', 'Jahan-e-Imam Ahmed Raza', 'book-81', 14500, NULL, 'https://noorulilmfinal.42web.io/assets/books/catalog-81.jpg', '/book-81.html', 'seerat', false) on conflict (id) do nothing;

-- Seed check: expect 8 categories, 50 products.
select (select count(*) from categories) as categories, (select count(*) from products) as products;

-- Checkout + admin policies (run with the migration above; safe to re-run)
-- Public checkout: anyone can insert an order + its items (COD, no login required).
-- Admin: only Supabase Auth authenticated users can update orders/products (create admin user in Supabase Dashboard > Authentication > Users).
drop policy if exists "public insert orders" on orders;
create policy "public insert orders" on orders for insert with check (true);
drop policy if exists "public insert order_items" on order_items;
create policy "public insert order_items" on order_items for insert with check (true);
drop policy if exists "public read orders" on orders;
create policy "public read orders" on orders for select using (true);
drop policy if exists "authenticated manage products" on products;
create policy "authenticated manage products" on products for all using (auth.role() = 'authenticated');
drop policy if exists "authenticated manage orders" on orders;
create policy "authenticated manage orders" on orders for all using (auth.role() = 'authenticated');
drop policy if exists "authenticated manage order_items" on order_items;
create policy "authenticated manage order_items" on order_items for all using (auth.role() = 'authenticated');
