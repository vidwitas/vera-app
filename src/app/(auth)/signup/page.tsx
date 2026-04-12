"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isInseadEmail } from "@/lib/utils";
import { TRAVEL_STYLES } from "@/lib/constants";
import type { TravelStyle } from "@/types/database";
import Button from "@/components/ui/Button";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [cohort, setCohort] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<TravelStyle[]>([]);

  function toggleStyle(style: TravelStyle) {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!isInseadEmail(email)) {
      setError("Only @insead.edu email addresses are allowed.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName,
          cohort,
          travel_styles: selectedStyles,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/verify");
  }

  const inputCls =
    "w-full px-4 py-3 rounded-2xl bg-ink border border-white/10 text-cream placeholder:text-white/20 font-body text-sm focus:outline-none focus:ring-2 focus:ring-rust/40 focus:border-rust/40 transition-all";
  const labelCls = "text-sm font-medium text-sand font-body";

  return (
    <div className="py-12">
      <div className="mb-10 text-center">
        <h1 className="font-display text-5xl font-semibold text-cream tracking-tight">
          VeRa
        </h1>
        <p className="mt-2 text-sm text-muted font-body">
          The INSEAD travel community
        </p>
      </div>

      <div className="bg-ink-light rounded-3xl p-6 border border-white/5">
        <div className="flex items-center gap-2 mb-6">
          <div className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-rust" : "bg-white/10"}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-rust" : "bg-white/10"}`} />
        </div>

        {step === 1 && (
          <>
            <h2 className="font-display text-xl text-cream mb-1">Create your account</h2>
            <p className="text-sm text-muted font-body mb-6">
              Requires an @insead.edu email
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!isInseadEmail(email)) {
                  setError("Only @insead.edu email addresses are allowed.");
                  return;
                }
                if (password.length < 8) {
                  setError("Password must be at least 8 characters.");
                  return;
                }
                setError("");
                setStep(2);
              }}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Full name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Amara Osei"
                  required
                  autoComplete="name"
                  className={inputCls}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>INSEAD email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.name@insead.edu"
                  required
                  autoComplete="email"
                  className={inputCls}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8+ characters"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className={inputCls}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>
                  Cohort{" "}
                  <span className="text-muted font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={cohort}
                  onChange={(e) => setCohort(e.target.value)}
                  placeholder="e.g. MBA Dec 2024, EMBA 26J"
                  className={inputCls}
                />
              </div>

              {error && (
                <p className="text-sm text-red-400 font-body bg-red-500/10 px-4 py-2.5 rounded-xl">
                  {error}
                </p>
              )}

              <Button type="submit" fullWidth size="lg" className="mt-2">
                Continue
              </Button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-display text-xl text-cream mb-1">Your travel style</h2>
            <p className="text-sm text-muted font-body mb-6">
              Pick all that apply — helps us find your matches
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {TRAVEL_STYLES.map(({ value, label, emoji }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleStyle(value)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all border ${
                    selectedStyles.includes(value)
                      ? "bg-rust border-rust text-cream"
                      : "bg-ink border-white/10 text-muted hover:border-white/30 hover:text-cream"
                  }`}
                >
                  {emoji} {label}
                </button>
              ))}
            </div>

            {error && (
              <p className="text-sm text-red-400 font-body bg-red-500/10 px-4 py-2.5 rounded-xl mb-4">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(1)}
                className="text-muted hover:text-cream"
              >
                Back
              </Button>
              <Button
                type="button"
                loading={loading}
                fullWidth
                size="lg"
                onClick={handleSignup}
              >
                Create account
              </Button>
            </div>
          </>
        )}

        <p className="mt-6 text-center text-sm text-muted font-body">
          Already have an account?{" "}
          <Link href="/login" className="text-rust hover:text-rust-light transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
