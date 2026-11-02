"use client";
import { useState } from "react";
import { getSupabase, isSupabaseConfigured, setupMessage } from "../../lib/supabase";

const STATUSES = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled", "Returned", "Refunded"];

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [msg, setMsg] = useState("");

  if (!isSupabaseConfigured) {
    return <><h1>Admin Dashboard</h1><div className="notice">{setupMessage()} No admin access is available until Supabase is configured and an admin user exists.</div></>;
  }
  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg("");
    const sb = getSupabase()!;
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) { setMsg(error.message); return; }
    setUser(data.user);
    const { data: prods } = await sb.from("products").select("id,name,price,category_id").order("name");
    const { data: ords } = await sb.from("orders").select("id,customer_name,phone,city,total,status,created_at").order("created_at", { ascending: false });
    setProducts(prods || []); setOrders(ords || []);
  };
  const updateStatus = async (id: string, status: string) => {
    const sb = getSupabase()!;
    const { error } = await sb.from("orders").update({ status }).eq("id", id);
    if (error) { setMsg(error.message); return; }
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };
  if (!user) {
    return (
      <><div className="shop-banner"><h1>Admin Login</h1><p>Sign in with the admin user created in Supabase.</p></div><div className="form-card"><p>Admin users are created by the site owner in Supabase Dashboard → Authentication → Users. No default admin account exists in this code.</p>
      <form onSubmit={login}>
        <div className="field"><label>Email<input value={email} onChange={(e) => setEmail(e.target.value)} /></label></div>
        <div className="field"><label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label></div>
        {msg && <p style={{ color: "#a00" }}>{msg}</p>}
        <button className="btn">Log in</button>
      </form></div></>
    );
  }
  return (
    <>
      <h1>Admin Dashboard</h1>
      <p>Signed in as {user.email}</p>
      {msg && <p style={{ color: "#a00" }}>{msg}</p>}
      <div className="table-card"><h2 style={{ marginTop: 0, color: "#123D32" }}>Products ({products.length})</h2>
      <ul>{products.map((p) => <li key={p.id}>{p.name} — Rs {p.price} ({p.category_id})</li>)}</ul>
      </div><div className="table-card"><h2 style={{ marginTop: 0, color: "#123D32" }}>Orders ({orders.length})</h2>
      {orders.map((o) => (
        <div key={o.id} style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}>
          <strong>{o.customer_name}</strong> · {o.phone} · {o.city} · Rs {o.total} ·
          <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} style={{ marginLeft: 8 }}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      ))}</div>
    </>
  );
}
