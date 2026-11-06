import Link from "next/link";
export default function NotFound() {
  return <main className="container section flex min-h-[65vh] flex-col items-center justify-center text-center">
    <p className="text-xs uppercase tracking-[.2em] text-[#9a6b55]">404 · Page not found</p>
    <h1 className="serif mt-4 text-6xl">Lost between pages?</h1>
    <p className="muted mt-4">The page you are looking for may have moved.</p>
    <Link href="/" className="btn mt-7">Return home</Link>
  </main>;
}
