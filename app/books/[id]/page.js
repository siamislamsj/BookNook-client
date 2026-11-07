
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function BookDetails() {
  const { id } = useParams();
  const router = useRouter();

  const { data: session, isPending: sessionPending } =
    authClient.useSession();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [returnDate, setReturnDate] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadBook() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/books/${id}`,
      { cache: "no-store" }
    );

    if (res.ok) {
      setBook(await res.json());
    } else {
      setBook(null);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (id) loadBook();
  }, [id]);

  async function borrow() {
    if (sessionPending) return;

    if (!session) {
      const next = `/books/${id}`;
      router.push(`/login?next=${encodeURIComponent(next)}`);
      return;
    }

    if (!returnDate) {
      return toast.error("Please choose a return date");
    }

    setBusy(true);

    try {
      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;

      if (!token) {
        throw new Error(
          "Your session token is unavailable. Please sign in again."
        );
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/borrows`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            bookId: book._id,
            returnDate
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Borrow failed");
      }

      toast.success("Book borrowed successfully");
      await loadBook();
      router.refresh();
    } catch (e) {
      toast.error(e.message || "Borrow failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <main className="container section">Loading book…</main>;
  }

  if (!book) {
    return (
      <main className="container section">
        <h1 className="serif text-4xl">Book not found</h1>
        <Link href="/books" className="btn mt-5">
          Back to books
        </Link>
      </main>
    );
  }

  const minDate = new Date(Date.now() + 86400000)
    .toISOString()
    .slice(0, 10);

  return (
    <main className="container section min-h-[70vh]">
      <Link href="/books" className="text-sm text-[#713b43]">
        ← Back to collection
      </Link>

      <div className="mt-8 grid gap-10 md:grid-cols-[.8fr_1.2fr]">
        <div className="flex min-h-[420px] items-center justify-center bg-[#eee7dc] p-8">
          <img
            src={book.image}
            alt={book.title}
            className="max-h-[420px] max-w-full object-contain shadow-xl"
          />
        </div>

        <div className="py-3">
          <p className="text-xs uppercase tracking-[.2em] text-[#9a6b55]">
            {book.category}
          </p>

          <h1 className="serif mt-3 text-5xl leading-tight">
            {book.title}
          </h1>

          <p className="mt-3 text-lg text-[#756d65]">
            by {book.author}
          </p>

          <p className="mt-7 leading-8 text-[#625950]">
            {book.description}
          </p>

          <div className="mt-7 grid grid-cols-2 gap-4 border-y border-[#e6ded2] py-5">
            <div>
              <p className="text-xs muted">Total copies</p>
              <p className="mt-1 text-2xl">{book.totalCopies}</p>
            </div>

            <div>
              <p className="text-xs muted">Available now</p>
              <p className="mt-1 text-2xl">{book.availableCopies}</p>
            </div>
          </div>

          <label className="mt-7 block text-sm">
            Return date
            <input
              type="date"
              min={minDate}
              className="field mt-2 max-w-xs"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </label>

          <button
            disabled={
              busy ||
              sessionPending ||
              book.availableCopies < 1
            }
            onClick={borrow}
            className="btn mt-5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy
              ? "Processing…"
              : book.availableCopies < 1
                ? "Currently unavailable"
                : "Borrow this book"}
          </button>
        </div>
      </div>
    </main>
  );
}
