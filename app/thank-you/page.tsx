"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatRs } from "../../lib/store";

export default function ThankYou() {
  const [order, setOrder] = useState<any>(null);
  useEffect(() => { try { const v = localStorage.getItem("maktaba-last-order"); if (v) setOrder(JSON.parse(v)); } catch {} }, []);
  if (!order) return <p>No recent order found. <Link href="/shop">Browse books</Link></p>;
  return (
    <>
      <h1>Thank you — order received</h1>
      <p>Order reference: <strong>{order.id}</strong></p>
      {order.id === "WHATSAPP-FALLBACK" && <p>This order was sent via WhatsApp (Supabase was not configured), not saved in a database. Keep your WhatsApp chat as the confirmation.</p>}
      <p>Name: {order.name} · Phone: {order.phone} · City: {order.city}</p>
      <p>Address: {order.address}</p>
      <ul>{order.items.map((i: any) => <li key={i.product.slug}>{i.product.name} x {i.qty} — {formatRs(i.product.price * i.qty)}</li>)}</ul>
      <p><strong>Total: {formatRs(order.total)}</strong> · Payment: Cash on Delivery</p>
      <Link href="/shop">Continue shopping</Link>
    </>
  );
}
