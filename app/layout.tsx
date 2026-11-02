import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Header from "../components/Header";
import LogoMark from "../components/Logo";
import { StoreProvider } from "../lib/store";
import { CATEGORIES } from "../lib/products";

export const metadata: Metadata = {
  title: "Maktaba Noor Ul Ilm | Buy Islamic Books Online in Pakistan",
  description: "Authentic Islamic books at fair prices, with cash on delivery across Pakistan and WhatsApp ordering.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Header />
          <main>{children}</main>
          <footer className="site-footer">
            <div className="footer-inner">
              <div>
                <p style={{ display: "flex", alignItems: "center", gap: 12, margin: 0 }}>
                  <LogoMark size={46} />
                  <span className="footer-brand">Maktaba <em>Noor-ul-Ilm</em></span>
                </p>
                <p>Authentic Islamic books from Lahore, delivered across Pakistan on Cash on Delivery. Original covers and supplied prices only.</p>
                <p>WhatsApp: <a href="https://wa.me/923075722464">0307-5722464</a></p>
              </div>
              <div>
                <h4>Shop</h4>
                <ul>
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/shop">All Books</Link></li>
                  <li><Link href="/cart">Cart</Link></li>
                  <li><Link href="/checkout">Checkout (COD)</Link></li>
                  <li><Link href="/admin">Admin</Link></li>
                </ul>
              </div>
              <div>
                <h4>Categories</h4>
                <ul>
                  {CATEGORIES.map((c) => (
                    <li key={c.id}><Link href={`/shop?cat=${c.slug}`}>{c.name}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>Contact</h4>
                <ul>
                  <li>WhatsApp: <a href="https://wa.me/923075722464">0307-5722464</a></li>
                  <li>Facebook: <a href="https://www.facebook.com/onlinebooks8076">onlinebooks8076</a></li>
                  <li>Instagram: <a href="https://instagram.com/maktabanoorulilm">@maktabanoorulilm</a></li>
                  <li>Payment: Cash on Delivery</li>
                  <li>Shipping: confirmed on WhatsApp</li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">© Maktaba Noor-ul-Ilm, Lahore. Cash on Delivery across Pakistan. Delivery charges are confirmed on WhatsApp — no amount is stated here because none was supplied.</div>
          </footer>
          <a className="wa-float" href="https://wa.me/923075722464" target="_blank" rel="noreferrer">💬 Chat on WhatsApp</a>
        </StoreProvider>
      </body>
    </html>
  );
}
