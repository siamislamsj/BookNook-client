"use client";
import { useEffect, useState } from "react";
import BookCard from "@/components/BookCard";
const categories = ["All", "Fiction", "Science", "History", "Kids", "Others"];
export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`).then(r => r.json()).then(setBooks).catch(() => setBooks([])).finally(() => setLoading(false)); }, []);
  const filtered = books.filter(b => (category === "All" || b.category === category) && `${b.title} ${b.author}`.toLowerCase().includes(search.toLowerCase()));
  return <main className="container section min-h-[65vh]">
    <p className="text-xs uppercase tracking-[.22em] text-[#9a6b55]">The collection</p><h1 className="serif mt-2 text-5xl">Explore all books</h1><p className="muted mt-3">Find the story you have been looking for.</p>
    <div className="mt-8 grid gap-3 md:grid-cols-[1fr_220px]"><input className="field" placeholder="Search by title or author..." value={search} onChange={e => setSearch(e.target.value)} /><select className="field" value={category} onChange={e => setCategory(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select></div>
    {loading ? <p className="py-16 text-center muted">Loading the shelves…</p> : filtered.length ? <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(book => <BookCard key={book._id} book={book} />)}</div> : <p className="card mt-8 p-10 text-center muted">No books match your search.</p>}
  </main>;
}
