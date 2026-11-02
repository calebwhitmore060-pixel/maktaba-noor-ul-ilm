"use client";
import Link from "next/link";
import Image from "next/image";
import { useStore, formatRs } from "../../lib/store";

export default function CartPage() {
  const { cart, setQty, removeFromCart } = useStore();
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  if (cart.length === 0) return <p>Your cart is empty. <Link href="/shop">Browse books</Link></p>;
  return (
    <>
      <h1>Shopping Cart</h1>
      {cart.map((i) => (
        <div key={i.product.slug} style={{ display: "flex", gap: 12, marginBottom: 12, borderBottom: "1px solid #eee", paddingBottom: 12 }}>
          <Image src={i.product.image_url} alt={i.product.name} width={80} height={107} />
          <div>
            <Link href={`/product/${i.product.slug}`}><strong>{i.product.name}</strong></Link>
            <p>{formatRs(i.product.price)} each</p>
            <label>Qty <input type="number" min={0} value={i.qty} onChange={(e) => setQty(i.product.slug, Number(e.target.value))} style={{ width: 70, padding: 6 }} /></label>
            <button onClick={() => removeFromCart(i.product.slug)}>Remove</button>
          </div>
        </div>
      ))}
      <p><strong>Subtotal: {formatRs(subtotal)}</strong></p>
      <p>Shipping: confirmed on WhatsApp — no delivery charge amount is stated here because none was supplied.</p>
      <Link className="btn" href="/checkout">Proceed to Checkout</Link> <Link href="/shop">Continue shopping</Link>
    </>
  );
}
