"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
const initial = { title: "", author: "", category: "Fiction", image: "", description: "", totalCopies: "1" };
export default function AddBookPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  async function submit(e) {
    e.preventDefault(); setBusy(true);
    try {
      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;
      if (!token) throw new Error("Please sign in again");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, totalCopies: Number(form.totalCopies) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not add book");
      toast.success("Book added to the library"); router.push("/my-books");
    } catch (e) { toast.error(e.message); }
    finally { setBusy(false); }
  }
  if (isPending) return <main className="container section">Checking your session…</main>;
  if (!session) return <main className="container section"><h1 className="serif text-4xl">Sign in to add a book</h1><button className="btn mt-5" onClick={() => router.push("/login")}>Sign in</button></main>;
  return <main className="container section max-w-3xl"><p className="text-xs uppercase tracking-[.2em] text-[#9a6b55]">Grow the collection</p><h1 className="serif mt-2 text-5xl">Add a book</h1><p className="muted mt-3">Share a good read with the BookNook community.</p>
    <form onSubmit={submit} className="card mt-8 grid gap-5 p-6 sm:grid-cols-2">
      <label className="text-sm">Book title<input name="title" required className="field mt-2" value={form.title} onChange={change} /></label>
      <label className="text-sm">Author<input name="author" required className="field mt-2" value={form.author} onChange={change} /></label>
      <label className="text-sm">Category<select name="category" className="field mt-2" value={form.category} onChange={change}>{["Fiction","Science","History","Kids","Others"].map(x => <option key={x}>{x}</option>)}</select></label>
      <label className="text-sm">Total copies<input name="totalCopies" type="number" min="1" required className="field mt-2" value={form.totalCopies} onChange={change} /></label>
      <label className="text-sm sm:col-span-2">Cover image URL<input name="image" type="url" required placeholder="https://…" className="field mt-2" value={form.image} onChange={change} /></label>
      <label className="text-sm sm:col-span-2">Description<textarea name="description" required rows="5" className="field mt-2" value={form.description} onChange={change} /></label>
      <div className="text-sm sm:col-span-2"><p className="muted">Added by</p><p className="mt-1">{session.user.name} · {session.user.email}</p></div>
      <button disabled={busy} className="btn sm:col-span-2">{busy ? "Adding book…" : "Add to library"}</button>
    </form>
  </main>;
}
