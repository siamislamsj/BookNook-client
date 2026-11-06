export default function Loading() {
  return <main className="container section min-h-[55vh]" aria-live="polite"><div className="animate-pulse">
    <div className="h-3 w-29 bg-[#e6ded2]" /><div className="mt-4 h-10 w-64 bg-[#e6ded2]" />
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3,4,5,6].map(n => <div key={n} className="card h-72 bg-[#eee7dc]" />)}</div>
  </div></main>;
}
