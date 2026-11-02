"use client";
import Link from "next/link";
import Image from "next/image";
import { useStore, formatRs } from "../../lib/store";

export default function CartPage() {
  const { cart, setQty, removeFromCart } = useStore();
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  if (cart.length === 0) return <div className="form-card"><h1>Your cart is empty</h1><p>No books added yet.</p><Link className="btn" href="/shop">Browse books</Link></div>;
  return (
    <>
      <div className="shop-banner"><h1>Shopping Cart</h1><p>{cart.length} item(s) in your cart.</p></div>
      <div className="two-col">
        <div>
          {cart.map((i) => (
            <div key={i.product.slug} className="cart-row">
              <Image src={i.product.image_url} alt={i.product.name} width={80} height={107} />
              <div style={{ flex: 1 }}>
                <Link href={`/product/${i.product.slug}`}><strong>{i.product.name}</strong></Link>
                <p style={{ margin: "6px 0" }}>{formatRs(i.product.price)} each</p>
                <span className="qty">
                  <button type="button" onClick={() => setQty(i.product.slug, i.qty - 1)} aria-label="Decrease quantity">−</button>
                  <input type="number" min={0} value={i.qty} onChange={(e) => setQty(i.product.slug, Number(e.target.value))} aria-label="Quantity" />
                  <button type="button" onClick={() => setQty(i.product.slug, i.qty + 1)} aria-label="Increase quantity">+</button>
                </span>
                <div style={{ marginTop: 10 }}><button className="btn" style={{ background: "#fff", color: "#B42318", border: "1.5px solid #B42318", padding: "7px 14px" }} onClick={() => removeFromCart(i.product.slug)}>Remove</button></div>
              </div>
              <strong>{formatRs(i.product.price * i.qty)}</strong>
            </div>
          ))}
        </div>
        <div className="summary">
          <h2 style={{ marginTop: 0, color: "#123D32" }}>Order summary</h2>
          <p><strong>Subtotal: {formatRs(subtotal)}</strong></p>
          <p style={{ color: "#6B7280" }}>Shipping: confirmed on WhatsApp — no delivery charge amount is stated here because none was supplied.</p>
          <p><strong>Total (before shipping): {formatRs(subtotal)}</strong></p>
          <Link className="btn" href="/checkout" style={{ width: "100%" }}>Proceed to Checkout →</Link>
          <p style={{ textAlign: "center" }}><Link href="/shop">Continue shopping</Link></p>
        </div>
      </div>
    </>
  );
}
