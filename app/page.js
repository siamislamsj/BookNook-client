"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import BookCard from "@/components/BookCard";

const slides = [
  { eyebrow: "A library for the curious", title: "Every great journey begins with a page.", copy: "Find a quiet moment. Discover a new perspective. Let your next favourite story find you.", image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1000" },
  { eyebrow: "Stories worth sharing", title: "Pass a good story along.", copy: "Borrow thoughtfully, read slowly, and return a little inspiration to the shelf.", image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=1000" },
  { eyebrow: "Your next chapter", title: "A world of ideas, close at hand.", copy: "From timeless fiction to curious science, your next discovery is waiting.", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1000" }
];

export default function Home() {
  const [books, setBooks] = useState([]);
  useEffect(() => { fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`).then(r => r.json()).then(setBooks).catch(() => setBooks([])); }, []);
  return <>
    <main>
      <section className="container py-8">
        <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 4500 }} pagination={{ clickable: true }} loop className="overflow-hidden">
          {slides.map((s, i) => <SwiperSlide key={s.title}>
            <div className="relative flex min-h-[480px] items-center overflow-hidden bg-[#332c29]">
              <img src={s.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
              <div className="relative max-w-2xl px-7 py-16 text-white sm:px-14">
                <p className="text-xs uppercase tracking-[.25em] text-[#e5b58e]">{s.eyebrow}</p>
                <h1 className="serif mt-5 text-5xl leading-[1.08] sm:text-6xl">{s.title}</h1>
                <p className="mt-5 max-w-lg leading-7 text-white/80">{s.copy}</p>
                <Link href="/books" className="btn mt-8 border-[#e5b58e] bg-[#e5b58e] text-[#292522]">Explore the shelves ↗</Link>
              </div>
            </div>
          </SwiperSlide>)}
        </Swiper>
      </section>

      <section className="section container">
        <div className="mb-9 flex items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[.22em] text-[#9a6b55]">Fresh from the shelves</p><h2 className="serif mt-2 text-4xl">Latest arrivals</h2></div><Link href="/books" className="text-sm text-[#713b43]">View all books ↗</Link></div>
        {books.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{books.slice(0, 6).map(book => <BookCard key={book._id} book={book} />)}</div> : <p className="card p-8 text-center muted">The shelves are being arranged. Check back soon.</p>}
      </section>

      <section className="bg-[#eae1d5] py-20"><div className="container grid gap-10 md:grid-cols-2 md:items-center">
        <div><p className="text-xs uppercase tracking-[.22em] text-[#9a6b55]">A slower kind of discovery</p><h2 className="serif mt-3 text-4xl leading-tight">Read beyond the familiar.</h2></div>
        <p className="max-w-xl leading-8 text-[#625950]">A good library is more than a collection of books. It is a meeting place for ideas, imagination and people. Browse the shelves, borrow what speaks to you, and share your own discoveries with the community.</p>
      </div></section>

      <section className="section container grid gap-8 md:grid-cols-3">
        {[["01", "Discover", "Explore stories and ideas across fiction, science, history and more."], ["02", "Borrow", "Take a book home and make time for a new perspective."], ["03", "Share", "Add books to the community shelf and help stories travel."]].map(x => <div key={x[0]} className="border-t border-[#d8cec1] pt-5"><p className="text-sm text-[#b47a58]">{x[0]}</p><h3 className="serif mt-3 text-2xl">{x[1]}</h3><p className="muted mt-2 leading-7">{x[2]}</p></div>)}
      </section>
    </main>
  </>;
}
