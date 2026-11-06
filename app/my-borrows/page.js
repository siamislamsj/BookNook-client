"use client";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import toast from "react-hot-toast";
export default function MyBorrowsPage() {
  const { data: session, isPending } = authClient.useSession();
  const [items, setItems] = useState([]);
  async function load() {
    const t = await authClient.token();
    const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/borrows`, { headers: { Authorization: `Bearer ${t?.data?.token}` } });
    if (r.ok) setItems(await r.json());
  }
  useEffect(() => { if (session) load(); }, [session]);
  async function giveBack(id) {
    const t = await authClient.token();
    const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/borrows/${id}`, { method:"DELETE", headers:{ Authorization:`Bearer ${t?.data?.token}` } });
    const d = await r.json(); if (!r.ok) return toast.error(d.message || "Return failed");
    toast.success("Book returned"); load();
  }
  if (isPending) return <main className="container section">Loading…</main>;
  if (!session) return <main className="container section">Please <Link className="text-[#713b43]" href="/login">sign in</Link> to see your borrows.</main>;
  return <main className="container section min-h-[65vh]"><h1 className="serif text-5xl">My borrows</h1><p className="muted mt-3">Your borrowed books and return dates.</p><div className="mt-8 space-y-4">{items.map(b => <div key={b._id} className="card flex flex-wrap items-center gap-4 p-4"><img src={b.bookImage} alt="" className="h-24 w-16 object-contain" /><div className="min-w-0 flex-1"><h2 className="serif text-xl">{b.bookTitle}</h2><p className="muted text-sm">Due: {new Date(b.returnDate).toLocaleDateString()} · {b.status}</p></div>{b.status === "borrowed" && <button className="btn text-sm" onClick={() => giveBack(b._id)}>Return book</button>}</div>)}{!items.length && <p className="card p-8 text-center muted">You have no borrow records yet.</p>}</div></main>;
}
