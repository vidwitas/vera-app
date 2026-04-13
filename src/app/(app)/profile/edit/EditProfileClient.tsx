"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Profile, TravelStyle } from "@/types/database";
import { TRAVEL_STYLES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Props {
  profile: Profile | null;
}

const STYLE_COLORS: Record<TravelStyle, { selected: string; idle: string }> = {
  adventure: { selected: "border-rust bg-rust/10 text-rust-dark", idle: "border-sand-dark bg-sand text-muted" },
  culture:   { selected: "border-purple-300 bg-purple-100 text-purple-700", idle: "border-sand-dark bg-sand text-muted" },
  food:      { selected: "border-gold bg-gold-light text-gold-dark", idle: "border-sand-dark bg-sand text-muted" },
  nature:    { selected: "border-sage bg-sage/15 text-sage-dark", idle: "border-sand-dark bg-sand text-muted" },
  nightlife: { selected: "border-indigo-300 bg-indigo-100 text-indigo-700", idle: "border-sand-dark bg-sand text-muted" },
  wellness:  { selected: "border-teal-300 bg-teal-100 text-teal-700", idle: "border-sand-dark bg-sand text-muted" },
  art:       { selected: "border-pink-300 bg-pink-100 text-pink-700", idle: "border-sand-dark bg-sand text-muted" },
  history:   { selected: "border-amber-300 bg-amber-100 text-amber-800", idle: "border-sand-dark bg-sand text-muted" },
  beach:     { selected: "border-sky bg-sky-light text-sky-dark", idle: "border-sand-dark bg-sand text-muted" },
  city:      { selected: "border-slate-300 bg-slate-100 text-slate-600", idle: "border-sand-dark bg-sand text-muted" },
  remote:    { selected: "border-emerald-300 bg-emerald-100 text-emerald-700", idle: "border-sand-dark bg-sand text-muted" },
};

export default function EditProfileClient({ profile }: Props) {
  const router = useRouter();
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [cohort, setCohort] = useState(profile?.cohort ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [travelStyles, setTravelStyles] = useState<TravelStyle[]>(
    profile?.travel_styles ?? []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleStyle(style: TravelStyle) {
    setTravelStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase.from("profiles") as any)
      .update({
        full_name: fullName.trim() || null,
        cohort: cohort.trim() || null,
        bio: bio.trim() || null,
        travel_styles: travelStyles,
      })
      .eq("id", profile!.id);

    if (updateError) {
      setError("Failed to save changes. Please try again.");
      setSaving(false);
      return;
    }

    router.push("/profile");
    router.refresh();
  }

  return (
    <div className="min-h-dvh pb-28">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-cream/95 backdrop-blur-sm border-b border-sand-dark">
        <div className="flex items-center gap-3 px-4 py-4 pt-12">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-muted hover:text-ink transition-colors rounded-xl hover:bg-sand"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <h1 className="font-display text-2xl font-semibold text-ink">Edit Profile</h1>
        </div>
      </div>

      <div className="px-4 py-6 flex flex-col gap-6">
        {/* Avatar preview */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full gradient-brand flex items-center justify-center text-cream font-display text-3xl font-semibold shadow-md">
            {fullName
              ? fullName.trim().split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
              : "?"}
          </div>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4">
          <Input
            label="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            maxLength={80}
          />

          <Input
            label="Cohort"
            value={cohort}
            onChange={(e) => setCohort(e.target.value)}
            placeholder="e.g. MBA July 2025, EMBA 2024…"
            maxLength={60}
          />

          <Textarea
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell fellow travellers a bit about yourself…"
            maxLength={300}
            rows={4}
            hint={`${bio.length}/300`}
          />
        </div>

        {/* Travel styles */}
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-medium text-ink font-body">Travel styles</p>
            <p className="text-xs text-muted font-body mt-0.5">Pick the styles that match you best</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {TRAVEL_STYLES.map((style) => {
              const selected = travelStyles.includes(style.value);
              const colors = STYLE_COLORS[style.value];
              return (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => toggleStyle(style.value)}
                  className={cn(
                    "inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border font-body font-medium transition-all active:scale-[0.97]",
                    selected ? colors.selected : colors.idle
                  )}
                >
                  {style.emoji} {style.label}
                  {selected && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 font-body text-center">{error}</p>
        )}

        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={saving}
          onClick={handleSave}
          className="gradient-brand border-0 shadow-md"
        >
          Save changes
        </Button>
      </div>
    </div>
  );
}
