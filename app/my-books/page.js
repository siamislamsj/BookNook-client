"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
export default function MyBooksPage() {
  const { data: session, isPending } = authClient.useSession();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  async function load() {
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`);
      if (!r.ok) throw new Error("Could not load your books");
      const data = await r.json();
      setBooks(Array.isArray(data) ? data.filter(b => b.userId === session?.user?.id) : []);
    } catch (e) { toast.error(e.message); } finally { setLoading(false); }
  }
  useEffect(() => { if (session) load(); else if (!isPending) setLoading(false); }, [session, isPending]);
  async function remove(id) {
    const answer = await Swal.fire({ title: "Delete this book?", text: "This action cannot be undone.", icon: "warning", showCancelButton: true, confirmButtonText: "Yes, delete", cancelButtonText: "Keep book", confirmButtonColor: "#713b43" });
    if (!answer.isConfirmed) return;
    try {
      const t = await authClient.token();
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${t?.data?.token}` } });
      const d = await r.json(); if (!r.ok) throw new Error(d.message || "Delete failed");
      toast.success("Book deleted"); load();
    } catch (e) { toast.error(e.message); }
  }
  if (isPending) return <main className="container section">Checking your session…</main>;
  if (!session) return <main className="container section"><p>Please sign in to view your books.</p><Link className="btn mt-4" href="/login">Sign in</Link></main>;
  return <main className="container section min-h-[65vh]"><h1 className="serif text-5xl">My books</h1><p className="muted mt-3">Books you have contributed to the library.</p>
    {loading ? <p className="py-12 muted">Loading your books…</p> : <div className="mt-8 space-y-3">
      {books.map(b => <div key={b._id} className="card flex flex-wrap items-center gap-4 p-4"><img src={b.image} alt={b.title} className="h-20 w-14 object-contain" /><div className="min-w-0 flex-1"><h2 className="serif text-xl">{b.title}</h2><p className="muted text-sm">{b.author} · {b.availableCopies}/{b.totalCopies} available</p></div><Link href={`/my-books/edit/${b._id}`} className="btn btn-outline text-sm">Edit</Link><button onClick={() => remove(b._id)} className="btn text-sm">Delete</button></div>)}
      {!books.length && <p className="card p-8 text-center muted">You have not added any books yet.</p>}
    </div>}
  </main>;
}
