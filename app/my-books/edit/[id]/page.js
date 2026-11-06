"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
export default function EditBookPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (id) fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`).then(r => r.json()).then(b => setForm({ title:b.title, author:b.author, category:b.category, image:b.image, description:b.description, totalCopies:String(b.totalCopies) })); }, [id]);
  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  async function submit(e) {
    e.preventDefault(); setBusy(true);
    try {
      const t = await authClient.token();
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`, { method:"PATCH", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${t?.data?.token}` }, body:JSON.stringify({ ...form, totalCopies:Number(form.totalCopies) }) });
      const d = await r.json(); if (!r.ok) throw new Error(d.message || "Update failed");
      toast.success("Book updated"); router.push("/my-books");
    } catch(e) { toast.error(e.message); } finally { setBusy(false); }
  }
  if (isPending || !form) return <main className="container section">Loading book…</main>;
  if (!session) return <main className="container section">Please sign in first.</main>;
  return <main className="container section max-w-3xl"><h1 className="serif text-5xl">Edit book</h1><form onSubmit={submit} className="card mt-8 grid gap-4 p-6 sm:grid-cols-2">
    {["title","author","category","totalCopies","image"].map(k => <label key={k} className="text-sm capitalize">{k}<input className="field mt-2" name={k} required value={form[k]} onChange={change} /></label>)}
    <label className="text-sm sm:col-span-2">Description<textarea className="field mt-2" rows="5" name="description" required value={form.description} onChange={change} /></label>
    <button disabled={busy} className="btn sm:col-span-2">{busy ? "Saving…" : "Save changes"}</button>
  </form></main>;
}
