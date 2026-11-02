"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore, formatRs, WHATSAPP_URL } from "../../lib/store";
import { getSupabase, isSupabaseConfigured, setupMessage } from "../../lib/supabase";

export default function Checkout() {
  const { cart, clearCart } = useStore();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);

  const whatsappFallback = () => {
    const lines = cart.map((i) => `${i.product.name} x ${i.qty} = ${formatRs(i.product.price * i.qty)}`).join("\n");
    const text = encodeURIComponent(`Assalam-o-Alaikum! New order (COD):\nName: ${name}\nPhone: ${phone}\nCity: ${city}\nAddress: ${address}\nNotes: ${notes}\n\n${lines}\nTotal: ${formatRs(subtotal)} (shipping confirmed on WhatsApp)`);
    window.open(`${WHATSAPP_URL}?text=${text}`, "_blank");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) { setError("Your cart is empty."); return; }
    if (!name.trim() || !phone.trim() || !city.trim() || !address.trim()) { setError("Please fill name, phone, city and address."); return; }
    setBusy(true); setError("");
    const sb = getSupabase();
    if (sb) {
      const { data: order, error: oErr } = await sb.from("orders").insert({ customer_name: name, phone, city, address, payment_method: "COD", status: "Pending", total: subtotal }).select("id").single();
      if (oErr) {
        setBusy(false);
        setError(`Supabase order save failed (${oErr.message}). Your order was NOT saved — use the WhatsApp fallback below instead.`);
        return;
      }
      const items = cart.map((i) => ({ order_id: order.id, product_id: i.product.id, quantity: i.qty, unit_price: i.product.price }));
      const { error: iErr } = await sb.from("order_items").insert(items);
      if (iErr) { setBusy(false); setError(`Order saved but items failed (${iErr.message}). Please also send the WhatsApp fallback.`); return; }
      try { localStorage.setItem("maktaba-last-order", JSON.stringify({ id: order.id, name, phone, city, address, notes, total: subtotal, items: cart })); } catch {}
      clearCart(); router.push("/thank-you"); return;
    }
    // No Supabase: WhatsApp fallback is the order route, not a fake saved order.
    try { localStorage.setItem("maktaba-last-order", JSON.stringify({ id: "WHATSAPP-FALLBACK", name, phone, city, address, notes, total: subtotal, items: cart })); } catch {}
    whatsappFallback(); clearCart(); router.push("/thank-you");
  };

  if (cart.length === 0) return <p>Your cart is empty. <Link href="/shop">Browse books</Link></p>;
  return (
    <>
      <h1>Checkout — Cash on Delivery</h1>
      {!isSupabaseConfigured && <div className="notice">{setupMessage()} Checkout will use the WhatsApp order fallback until Supabase is configured.</div>}
      <h2>Order summary</h2>
      <ul>{cart.map((i) => <li key={i.product.slug}>{i.product.name} x {i.qty} — {formatRs(i.product.price * i.qty)}</li>)}</ul>
      <p><strong>Total: {formatRs(subtotal)}</strong> (shipping confirmed on WhatsApp)</p>
      <form onSubmit={submit}>
        <div className="field"><label>Full Name *<input value={name} onChange={(e) => setName(e.target.value)} /></label></div>
        <div className="field"><label>Phone Number *<input value={phone} onChange={(e) => setPhone(e.target.value)} /></label></div>
        <div className="field"><label>City *<input value={city} onChange={(e) => setCity(e.target.value)} /></label></div>
        <div className="field"><label>Complete Address *<textarea value={address} onChange={(e) => setAddress(e.target.value)} /></label></div>
        <div className="field"><label>Order Notes<textarea value={notes} onChange={(e) => setNotes(e.target.value)} /></label></div>
        <p>Payment method: <strong>Cash on Delivery only</strong>. No online payment is offered, so no payment is marked successful here.</p>
        {error && <p style={{ color: "#a00" }}>{error}</p>}
        <button className="btn" disabled={busy}>{busy ? "Placing order…" : "Place Order (COD)"}</button>
      </form>
      <p><button onClick={whatsappFallback}>Send this order on WhatsApp instead</button></p>
    </>
  );
}
