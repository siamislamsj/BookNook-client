"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="container section flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-xs uppercase tracking-[.2em] text-[#9a6b55]">
        Something went wrong
      </p>

      <h1 className="serif mt-3 text-4xl">
        Let’s turn the page.
      </h1>

      <p className="muted mt-3">
        We could not load this page. Please try again.
      </p>

      <button className="btn mt-6" onClick={() => reset()}>
        Try again
      </button>
    </main>
  );
}
