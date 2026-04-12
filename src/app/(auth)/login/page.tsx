"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isInseadEmail } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!isInseadEmail(email)) {
      setError("Only @insead.edu email addresses are allowed.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/feed");
    router.refresh();
  }

  return (
    <div className="py-12">
      {/* Wordmark */}
      <div className="mb-10 text-center">
        <h1 className="font-display text-5xl font-semibold text-cream tracking-tight">
          VeRa
        </h1>
        <p className="mt-2 text-sm text-muted font-body">
          The INSEAD travel community
        </p>
      </div>

      <div className="bg-ink-light rounded-3xl p-6 border border-white/5">
        <h2 className="font-display text-xl text-cream mb-6">Welcome back</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-sand font-body">
              INSEAD email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.name@insead.edu"
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded-2xl bg-ink border border-white/10 text-cream placeholder:text-white/20 font-body text-sm focus:outline-none focus:ring-2 focus:ring-rust/40 focus:border-rust/40 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-sand font-body">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-2xl bg-ink border border-white/10 text-cream placeholder:text-white/20 font-body text-sm focus:outline-none focus:ring-2 focus:ring-rust/40 focus:border-rust/40 transition-all"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 font-body bg-red-500/10 px-4 py-2.5 rounded-xl">
              {error}
            </p>
          )}

          <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted font-body">
          No account?{" "}
          <Link href="/signup" className="text-rust hover:text-rust-light transition-colors">
            Join VeRa
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-muted/60 font-body">
        Exclusive to the INSEAD community
      </p>
    </div>
  );
}
