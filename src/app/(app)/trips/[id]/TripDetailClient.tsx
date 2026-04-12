"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Trip, Profile } from "@/types/database";
import { formatDateRange, tripDuration, cn } from "@/lib/utils";
import { TRAVEL_STYLES, BUDGET_TIERS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";

interface Props {
  trip: Trip;
  travelers: Profile[];
  currentUserId: string;
  initialInterest: boolean;
  isOwner: boolean;
}

const BUDGET_BADGE: Record<string, { bg: string; text: string }> = {
  budget: { bg: "bg-sage/15", text: "text-sage" },
  mid: { bg: "bg-rust/15", text: "text-rust" },
  luxury: { bg: "bg-amber-100", text: "text-amber-700" },
  ultra: { bg: "bg-purple-100", text: "text-purple-700" },
};

export default function TripDetailClient({
  trip,
  travelers,
  currentUserId,
  initialInterest,
  isOwner,
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
      // Fetch the current user's profile to add to list
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
      {/* Top bar */}
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
          <h1 className="font-display text-lg font-semibold text-ink flex-1 truncate">
            {trip.destination}
          </h1>
        </div>
      </div>

      <div className="px-4 py-6 flex flex-col gap-6">
        {/* Hero card */}
        <div className="bg-sand rounded-3xl p-5 border border-sand-dark">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink leading-tight">
                {trip.destination}
              </h2>
              <p className="text-sm text-muted font-body mt-1">
                {formatDateRange(trip.start_date, trip.end_date)}
                <span className="mx-1.5">·</span>
                {duration} {duration === 1 ? "day" : "days"}
              </p>
            </div>
            <span className={cn("text-xs font-body font-medium px-2.5 py-1 rounded-full flex-shrink-0", badge.bg, badge.text)}>
              {budget?.label}
            </span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-cream rounded-2xl p-3 text-center">
              <p className="text-xs text-muted font-body">Travelers</p>
              <p className="font-display text-xl font-semibold text-ink mt-0.5">
                {travelerList.length}
                <span className="text-sm text-muted font-body font-normal">
                  /{trip.group_size}
                </span>
              </p>
            </div>
            <div className="bg-cream rounded-2xl p-3 text-center">
              <p className="text-xs text-muted font-body">Duration</p>
              <p className="font-display text-xl font-semibold text-ink mt-0.5">
                {duration}
                <span className="text-sm text-muted font-body font-normal"> days</span>
              </p>
            </div>
            <div className="bg-cream rounded-2xl p-3 text-center">
              <p className="text-xs text-muted font-body">Budget</p>
              <p className={cn("font-display text-sm font-semibold mt-0.5", badge.text)}>
                {budget?.label}
              </p>
            </div>
          </div>

          {/* Travel styles */}
          {styleItems.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {styleItems.map((style) => (
                <span
                  key={style.value}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-cream border border-sand-dark text-muted font-body"
                >
                  {style.emoji} {style.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        {trip.description && (
          <div>
            <h3 className="font-display text-base font-semibold text-ink mb-2">
              About this trip
            </h3>
            <p className="text-sm text-ink/80 font-body leading-relaxed">
              {trip.description}
            </p>
          </div>
        )}

        {/* Posted by */}
        <div>
          <h3 className="font-display text-base font-semibold text-ink mb-3">
            Posted by
          </h3>
          {trip.profile && (
            <div className="flex items-center gap-3 bg-sand rounded-2xl p-4 border border-sand-dark">
              <Avatar name={trip.profile.full_name} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-body font-semibold text-ink">
                    {trip.profile.full_name}
                  </p>
                  {trip.profile.email_verified && (
                    <span className="inline-flex items-center gap-0.5 text-xs text-sage bg-sage/10 px-1.5 py-0.5 rounded-full">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      INSEAD
                    </span>
                  )}
                </div>
                {trip.profile.cohort && (
                  <p className="text-xs text-muted font-body mt-0.5">
                    {trip.profile.cohort}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

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
                    <p className="text-sm font-body font-medium text-ink">
                      {traveler.full_name}
                    </p>
                    {traveler.cohort && (
                      <p className="text-xs text-muted font-body">{traveler.cohort}</p>
                    )}
                  </div>
                  {traveler.id === currentUserId && (
                    <span className="ml-auto text-xs text-rust bg-rust/10 px-2 py-0.5 rounded-full font-body">
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
            className={interested ? "border-rust/30 text-rust" : ""}
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
