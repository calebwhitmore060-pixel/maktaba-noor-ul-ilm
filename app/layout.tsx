import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import { StoreProvider } from "../lib/store";

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
          <footer>
            <p><strong>Maktaba Noor Ul Ilm</strong> — Authentic Islamic Books, Lahore, Pakistan</p>
            <p>WhatsApp: <a href="https://wa.me/923075722464">0307-5722464</a> · Facebook: <a href="https://www.facebook.com/onlinebooks8076">onlinebooks8076</a> · Instagram: <a href="https://instagram.com/maktabanoorulilm">@maktabanoorulilm</a></p>
            <p>Payment: Cash on Delivery · Shipping: confirmed on WhatsApp (no delivery charge is stated on this site because none was supplied).</p>
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
