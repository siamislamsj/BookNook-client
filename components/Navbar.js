"use client";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);
  async function logout() {
    await authClient.signOut();
    closeMenu();
    router.push("/");
    router.refresh();
  }
  const linkClass = "text-sm transition-colors duration-200 hover:text-[#713b43] focus-visible:text-[#713b43]";
  const links = [["Home", "/"], ["Explore Books", "/books"]];
  return <header className="relative z-30 border-b border-[#e6ded2] bg-[#f7f3eb]/95">
    <div className="container flex min-h-[76px] items-center justify-between gap-5">
      <Link href="/" onClick={closeMenu} className="serif text-3xl font-bold tracking-tight text-[#713b43]">BookNook<span className="text-[#c47b4e]">.</span></Link>
      <button className="md:hidden rounded-md px-3 py-2 text-2xl transition-colors hover:bg-[#eee7dc] hover:text-[#713b43]" onClick={() => setOpen(v => !v)} aria-label="Toggle menu" aria-expanded={open}>☰</button>
      <nav className={`${open ? "flex" : "hidden"} absolute left-0 right-0 top-full z-30 flex-col gap-5 border-b border-[#e6ded2] bg-[#f7f3eb] p-5 shadow-lg md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
        {links.map(([label, href]) => <Link key={href} href={href} onClick={closeMenu} className={linkClass}>{label}</Link>)}
        {session ? <>
          <Link href="/add-book" onClick={closeMenu} className={linkClass}>Add a Book</Link>
          <Link href="/my-books" onClick={closeMenu} className={linkClass}>My Books</Link>
          <Link href="/my-borrows" onClick={closeMenu} className={linkClass}>My Borrows</Link>
          <Link href="/profile" onClick={closeMenu} className={linkClass}>My Profile</Link>
          <button onClick={logout} className="btn text-sm">Sign out</button>
        </> : <>
          <Link href="/login" onClick={closeMenu} className={linkClass}>Sign in</Link>
          <Link href="/register" onClick={closeMenu} className="btn text-sm">Join BookNook</Link>
        </>}
      </nav>
    </div>
  </header>;
}
