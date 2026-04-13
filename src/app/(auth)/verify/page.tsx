import Link from "next/link";

export default function VerifyPage() {
  return (
    <div className="py-12 text-center">
      <div className="mb-10">
        <h1 className="font-display text-5xl font-semibold text-cream tracking-tight">
          VeRa
        </h1>
      </div>

      <div className="bg-ink-light rounded-3xl p-8 border border-white/5">
        <div className="w-16 h-16 rounded-full gradient-ocean flex items-center justify-center mx-auto mb-6 text-cream">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.91 11a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.82 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 7.91a16 16 0 0 0 7 7l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </div>

        <h2 className="font-display text-2xl text-cream mb-3">
          Check your inbox
        </h2>
        <p className="text-sm text-muted font-body leading-relaxed mb-6">
          We&apos;ve sent a verification link to your INSEAD email. Click the link to
          activate your account and start finding travel companions.
        </p>

        <div className="bg-sage/10 rounded-2xl px-4 py-3 border border-sage/20">
          <p className="text-xs text-sage font-body">
            Only @insead.edu emails are accepted. Make sure to check your spam folder.
          </p>
        </div>

        <p className="mt-8 text-sm text-muted font-body">
          Already verified?{" "}
          <Link href="/login" className="text-rust hover:text-rust-light transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
