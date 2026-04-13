"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Trip, Profile, TravelStyle, Region } from "@/types/database";
import { formatDateRange, tripDuration, cn } from "@/lib/utils";
import { TRAVEL_STYLES, BUDGET_TIERS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";

interface HeroImage {
  url: string;
  authorName?: string;
  authorLink?: string;
}

interface Props {
  trip: Trip;
  travelers: Profile[];
  currentUserId: string;
  initialInterest: boolean;
  isOwner: boolean;
  heroImage: HeroImage | null;
}

const BUDGET_BADGE: Record<string, { bg: string; text: string }> = {
  budget: { bg: "bg-sage/15", text: "text-sage-dark" },
  mid: { bg: "bg-rust/12", text: "text-rust-dark" },
  luxury: { bg: "bg-gold-light", text: "text-gold-dark" },
  ultra: { bg: "bg-sky-light", text: "text-sky-dark" },
};

const STYLE_COLORS: Record<TravelStyle, { bg: string; text: string }> = {
  adventure: { bg: "bg-rust/10",    text: "text-rust-dark" },
  culture:   { bg: "bg-purple-100", text: "text-purple-700" },
  food:      { bg: "bg-gold-light",  text: "text-gold-dark" },
  nature:    { bg: "bg-sage/15",    text: "text-sage-dark" },
  nightlife: { bg: "bg-indigo-100", text: "text-indigo-700" },
  wellness:  { bg: "bg-teal-100",   text: "text-teal-700" },
  art:       { bg: "bg-pink-100",   text: "text-pink-700" },
  history:   { bg: "bg-amber-100",  text: "text-amber-800" },
  beach:     { bg: "bg-sky-light",  text: "text-sky-dark" },
  city:      { bg: "bg-slate-100",  text: "text-slate-600" },
  remote:    { bg: "bg-emerald-100",text: "text-emerald-700" },
};

// Gradient fallback per region when no Unsplash key is set
const REGION_GRADIENTS: Record<Region, string> = {
  europe:     "linear-gradient(160deg, #C8A45A 0%, #E8572A 100%)",
  asia:       "linear-gradient(160deg, #0A6E6E 0%, #2E86AB 100%)",
  americas:   "linear-gradient(160deg, #E8572A 0%, #9B2335 100%)",
  africa:     "linear-gradient(160deg, #D4820A 0%, #8B4513 100%)",
  middle_east:"linear-gradient(160deg, #7B3F9E 0%, #D4820A 100%)",
  oceania:    "linear-gradient(160deg, #0A6E6E 0%, #1464B4 100%)",
};

export default function TripDetailClient({
  trip,
  travelers,
  currentUserId,
  initialInterest,
  isOwner,
  heroImage,
}: Props) {
  const router = useRouter();
  const [interested, setInterested] = useState(initialInterest);
  const [travelerList, setTravelerList] = useState(travelers);
  const [loading, setLoading] = useState(false);

  const budget = BUDGET_TIERS.find((b) => b.value === trip.budget_tier);
  const badge = BUDGET_BADGE[trip.budget_tier];
  const duration = tripDuration(trip.start_date, trip.end_date);
  const styleItems = TRAVEL_STYLES.filter((s) => trip.travel_styles?.includes(s.value));

  async function toggleInterest() {
    setLoading(true);
    const supabase = createClient();

    if (interested) {
      await supabase
        .from("trip_interests")
        .delete()
        .eq("trip_id", trip.id)
        .eq("user_id", currentUserId);
      setTravelerList((prev) => prev.filter((p) => p.id !== currentUserId));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("trip_interests") as any).insert({
        trip_id: trip.id,
        user_id: currentUserId,
      });
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUserId)
        .single();
      if (profile) setTravelerList((prev) => [...prev, profile]);
    }

    setInterested((prev) => !prev);
    setLoading(false);
  }

  return (
    <div className="min-h-dvh pb-28">
      {/* ── Hero image ──────────────────────────────────────── */}
      <div className="relative h-60 w-full">
        {heroImage ? (
          <Image
            src={heroImage.url}
            alt={`${trip.destination}, ${trip.country}`}
            fill
            className="object-cover"
            priority
            sizes="420px"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: REGION_GRADIENTS[trip.region] }}
          />
        )}

        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-12 left-4 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/50 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Destination text over image */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-semibold text-white leading-tight drop-shadow-md">
                {trip.destination}
              </h1>
              <p className="text-white/80 text-sm font-body mt-0.5 drop-shadow">
                {trip.country}
                <span className="mx-1.5">·</span>
                {formatDateRange(trip.start_date, trip.end_date)}
              </p>
            </div>
            <span className={cn(
              "text-xs font-body font-semibold px-2.5 py-1 rounded-full flex-shrink-0 backdrop-blur-sm",
              badge.bg, badge.text
            )}>
              {budget?.label}
            </span>
          </div>
        </div>

        {/* Unsplash credit */}
        {heroImage?.authorName && (
          <a
            href={`${heroImage.authorLink}?utm_source=vera_app&utm_medium=referral`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-1 right-2 text-[10px] text-white/50 font-body hover:text-white/80 transition-colors"
          >
            Photo: {heroImage.authorName} / Unsplash
          </a>
        )}
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="px-4 py-5 flex flex-col gap-5">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-sand rounded-2xl p-3 text-center border border-sand-dark">
            <p className="text-xs text-muted font-body">Travelers</p>
            <p className="font-display text-xl font-semibold text-ink mt-0.5">
              {travelerList.length}
              <span className="text-sm text-muted font-body font-normal">/{trip.group_size}</span>
            </p>
          </div>
          <div className="bg-sand rounded-2xl p-3 text-center border border-sand-dark">
            <p className="text-xs text-muted font-body">Duration</p>
            <p className="font-display text-xl font-semibold text-ink mt-0.5">
              {duration}
              <span className="text-sm text-muted font-body font-normal"> days</span>
            </p>
          </div>
          <div className="bg-sand rounded-2xl p-3 text-center border border-sand-dark">
            <p className="text-xs text-muted font-body">Budget</p>
            <p className={cn("font-display text-sm font-semibold mt-0.5", badge.text)}>
              {budget?.label}
            </p>
          </div>
        </div>

        {/* Travel styles */}
        {styleItems.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {styleItems.map((style) => {
              const colors = STYLE_COLORS[style.value];
              return (
                <span
                  key={style.value}
                  className={cn(
                    "inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-body font-medium",
                    colors.bg, colors.text
                  )}
                >
                  {style.emoji} {style.label}
                </span>
              );
            })}
          </div>
        )}

        {/* Description */}
        {trip.description && (
          <div className="bg-sand rounded-2xl p-4 border border-sand-dark">
            <h3 className="font-display text-base font-semibold text-ink mb-2">
              About this trip
            </h3>
            <p className="text-sm text-ink/80 font-body leading-relaxed">
              {trip.description}
            </p>
          </div>
        )}

        {/* Posted by */}
        {trip.profile && (
          <div>
            <h3 className="font-display text-base font-semibold text-ink mb-3">
              Posted by
            </h3>
            <div className="flex items-center gap-3 bg-sand rounded-2xl p-4 border border-sand-dark">
              <Avatar name={trip.profile.full_name} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-body font-semibold text-ink">{trip.profile.full_name}</p>
                  {trip.profile.email_verified && (
                    <span className="inline-flex items-center gap-0.5 text-xs text-sage bg-sage/10 px-1.5 py-0.5 rounded-full font-medium">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      INSEAD
                    </span>
                  )}
                </div>
                {trip.profile.cohort && (
                  <p className="text-xs text-muted font-body mt-0.5">{trip.profile.cohort}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Travelers going */}
        {travelerList.length > 0 && (
          <div>
            <h3 className="font-display text-base font-semibold text-ink mb-3">
              Going ({travelerList.length})
            </h3>
            <div className="flex flex-col gap-2">
              {travelerList.map((traveler) => (
                <div
                  key={traveler.id}
                  className="flex items-center gap-3 bg-sand rounded-2xl p-3 border border-sand-dark"
                >
                  <Avatar name={traveler.full_name} size="sm" />
                  <div>
                    <p className="text-sm font-body font-medium text-ink">{traveler.full_name}</p>
                    {traveler.cohort && (
                      <p className="text-xs text-muted font-body">{traveler.cohort}</p>
                    )}
                  </div>
                  {traveler.id === currentUserId && (
                    <span className="ml-auto text-xs text-rust-dark bg-rust/10 px-2 py-0.5 rounded-full font-body font-medium">
                      You
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      {!isOwner && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-app px-4 z-40">
          <Button
            onClick={toggleInterest}
            loading={loading}
            fullWidth
            size="lg"
            variant={interested ? "secondary" : "primary"}
            className={cn(
              interested
                ? "border-rust/30 text-rust-dark"
                : "gradient-brand border-0 shadow-lg"
            )}
          >
            {interested ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mr-2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                I&apos;m interested
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mr-2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Express interest
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
