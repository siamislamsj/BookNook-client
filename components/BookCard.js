import Link from "next/link";
export default function BookCard({ book }) {
  return <article className="card group overflow-hidden">
    <Link href={`/books/${book._id}`} className="block">
      <div className="flex h-[250px] items-center justify-center bg-[#eee7dc] p-5">
        <img src={book.image} alt={book.title} className="h-full max-w-full object-contain shadow-lg transition duration-300 group-hover:-translate-y-1" />
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-[.18em] text-[#9a6b55]">{book.category}</p>
        <h3 className="serif mt-2 text-xl">{book.title}</h3>
        <p className="muted mt-1 text-sm">{book.author}</p>
        <p className="mt-4 text-xs text-[#713b43]">{book.availableCopies > 0 ? `${book.availableCopies} copies available` : "Currently unavailable"} <span className="float-right">View details ↗</span></p>
      </div>
    </Link>
  </article>;
}
