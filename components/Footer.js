export default function Footer() {
  return <footer className="mt-16 bg-[#292522] py-12 text-[#f7f3eb]">
    <div className="container flex flex-col justify-between gap-8 sm:flex-row">
      <div><p className="serif text-3xl">BookNook.</p><p className="mt-2 max-w-sm text-sm text-[#c7bdb1]">A little space for big stories. Find a book, share a book, pass a story along.</p></div>
      <div className="text-sm text-[#c7bdb1]"><p>Explore · Borrow · Read · Return</p><p className="mt-3">© {new Date().getFullYear()} BookNook Library</p></div>
    </div>
  </footer>;
}
