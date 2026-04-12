"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TRAVEL_STYLES, REGIONS, BUDGET_TIERS } from "@/lib/constants";
import type { TravelStyle, Region, BudgetTier } from "@/types/database";
import Button from "@/components/ui/Button";

export default function NewTripPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [destination, setDestination] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState<Region | "">("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budgetTier, setBudgetTier] = useState<BudgetTier | "">("");
  const [styles, setStyles] = useState<TravelStyle[]>([]);
  const [groupSize, setGroupSize] = useState(4);
  const [description, setDescription] = useState("");

  function toggleStyle(style: TravelStyle) {
    setStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!region) { setError("Please select a region."); return; }
    if (!budgetTier) { setError("Please select a budget tier."); return; }
    if (startDate > endDate) { setError("End date must be after start date."); return; }

    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) { router.push("/login"); return; }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error: insertError } = await (supabase.from("trips") as any)
      .insert({
        user_id: user.id,
        destination,
        country,
        region: region as Region,
        start_date: startDate,
        end_date: endDate,
        budget_tier: budgetTier as BudgetTier,
        travel_styles: styles,
        group_size: groupSize,
        description,
        is_open: true,
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push(`/trips/${(data as any).id}`);
  }

  const inputCls =
    "w-full px-4 py-3 rounded-2xl bg-sand border border-sand-dark text-ink placeholder:text-muted font-body text-sm focus:outline-none focus:ring-2 focus:ring-rust/40 focus:border-rust/40 transition-all";
  const labelCls = "text-sm font-medium text-ink font-body";

  return (
    <div className="min-h-dvh pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-cream/95 backdrop-blur-sm border-b border-sand-dark">
        <div className="flex items-center gap-3 px-4 py-4 pt-12">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-sand flex items-center justify-center hover:bg-sand-dark transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="font-display text-lg font-semibold text-ink">
            Post a trip
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-6 flex flex-col gap-6">
        {/* Destination */}
        <section>
          <h2 className="font-display text-base font-semibold text-ink mb-4">
            Where are you going?
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Destination</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Kyoto, Patagonia, Amalfi Coast"
                required
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. Japan"
                required
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as Region)}
                required
                className={inputCls}
              >
                <option value="">Select region</option>
                {REGIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Dates */}
        <section>
          <h2 className="font-display text-base font-semibold text-ink mb-4">
            When?
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split("T")[0]}
                required
                className={inputCls}
              />
            </div>
          </div>
        </section>

        {/* Budget */}
        <section>
          <h2 className="font-display text-base font-semibold text-ink mb-4">
            Budget tier
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {BUDGET_TIERS.map(({ value, label, description: desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => setBudgetTier(value)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  budgetTier === value
                    ? "bg-ink border-ink text-cream"
                    : "bg-sand border-sand-dark text-ink hover:border-ink/30"
                }`}
              >
                <p className="font-body font-semibold text-sm">{label}</p>
                <p className={`text-xs mt-0.5 ${budgetTier === value ? "text-cream/60" : "text-muted"}`}>
                  {desc}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Travel style */}
        <section>
          <h2 className="font-display text-base font-semibold text-ink mb-1">
            Travel style
          </h2>
          <p className="text-xs text-muted font-body mb-3">Select all that apply</p>
          <div className="flex flex-wrap gap-2">
            {TRAVEL_STYLES.map(({ value, label, emoji }) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleStyle(value)}
                className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-body font-medium transition-all border ${
                  styles.includes(value)
                    ? "bg-rust text-cream border-rust"
                    : "bg-sand border-sand-dark text-muted hover:text-ink"
                }`}
              >
                {emoji} {label}
              </button>
            ))}
          </div>
        </section>

        {/* Group size */}
        <section>
          <h2 className="font-display text-base font-semibold text-ink mb-4">
            Max group size
          </h2>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
              className="w-10 h-10 rounded-full bg-sand border border-sand-dark flex items-center justify-center hover:bg-sand-dark transition-colors text-lg font-medium"
            >
              −
            </button>
            <span className="font-display text-3xl font-semibold text-ink min-w-[2rem] text-center">
              {groupSize}
            </span>
            <button
              type="button"
              onClick={() => setGroupSize(Math.min(20, groupSize + 1))}
              className="w-10 h-10 rounded-full bg-sand border border-sand-dark flex items-center justify-center hover:bg-sand-dark transition-colors text-lg font-medium"
            >
              +
            </button>
            <span className="text-sm text-muted font-body">
              {groupSize === 1 ? "person" : "people"} max
            </span>
          </div>
        </section>

        {/* Description */}
        <section>
          <h2 className="font-display text-base font-semibold text-ink mb-4">
            Tell us more
          </h2>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What are you planning? Who would be a great fit for this trip? Any specific activities?"
            required
            rows={5}
            className={inputCls + " resize-none"}
          />
        </section>

        {error && (
          <p className="text-sm text-red-500 font-body bg-red-50 px-4 py-2.5 rounded-2xl border border-red-100">
            {error}
          </p>
        )}

        <Button type="submit" loading={loading} fullWidth size="lg">
          Publish trip
        </Button>
      </form>
    </div>
  );
}
