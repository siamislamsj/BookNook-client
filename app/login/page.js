
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

function getNextPath() {
  if (typeof window === "undefined") return "/";

  const next = new URLSearchParams(window.location.search).get("next");

  return next && next.startsWith("/") && !next.startsWith("//")
    ? next
    : "/";
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        throw new Error(result.error.message || "Could not sign in");
      }

      toast.success("Welcome back");
      window.location.assign(getNextPath());
    } catch (error) {
      toast.error(error.message || "Could not sign in");
    } finally {
      setBusy(false);
    }
  }

  async function googleSignIn() {
    setGoogleBusy(true);

    try {
      const callbackURL = `${window.location.origin}${getNextPath()}`;

      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });

      if (result?.error) {
        toast.error(
          result.error.message ||
            "Google sign-in could not start. Check OAuth settings."
        );
        setGoogleBusy(false);
      }
    } catch (error) {
      toast.error(
        error.message || "Google sign-in failed. Check OAuth configuration."
      );
      setGoogleBusy(false);
    }
  }

  return (
    <main className="container section flex min-h-[75vh] items-center justify-center">
      <form
        onSubmit={submit}
        className="card w-full max-w-md p-8"
      >
        <p className="text-xs uppercase tracking-[.2em] text-[#9a6b55]">
          Welcome back
        </p>

        <h1 className="serif mt-2 text-4xl">Sign in</h1>

        <label className="mt-7 block text-sm">
          Email
          <input
            className="field mt-2"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>

        <label className="mt-4 block text-sm">
          Password

          <div className="field mt-2 flex items-center !p-0 overflow-hidden">
            <input
              className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 outline-none focus:ring-0"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="shrink-0 px-4 text-[#713b43] hover:!text-[#713b43] focus:outline-none"
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>
        </label>

        <button
          disabled={busy}
          className="btn mt-6 w-full"
          type="submit"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <button
          type="button"
          onClick={googleSignIn}
          disabled={googleBusy}
          style={{
            color: "#713b43",
          }}
          className="btn btn-outline mt-3 w-full hover:!text-[#713b43] focus:!text-[#713b43] disabled:opacity-60"
        >
          {googleBusy ? "Connecting to Google…" : "Continue with Google"}
        </button>

        <p className="mt-5 text-center text-sm muted">
          New here?{" "}
          <Link className="text-[#c05e6c]" href="/register">
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
}
