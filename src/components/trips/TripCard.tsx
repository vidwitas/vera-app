import Link from "next/link";
import type { Trip, TravelStyle, Region } from "@/types/database";
import { formatDateRange, tripDuration, cn } from "@/lib/utils";
import { TRAVEL_STYLES, BUDGET_TIERS } from "@/lib/constants";
import Avatar from "@/components/ui/Avatar";

interface TripCardProps {
  trip: Trip;
}

const BUDGET_BADGE: Record<string, { bg: string; text: string }> = {
  budget: { bg: "bg-white/20 backdrop-blur-sm", text: "text-white" },
  mid:    { bg: "bg-white/20 backdrop-blur-sm", text: "text-white" },
  luxury: { bg: "bg-white/20 backdrop-blur-sm", text: "text-white" },
  ultra:  { bg: "bg-white/20 backdrop-blur-sm", text: "text-white" },
};

const BUDGET_BADGE_BODY: Record<string, { bg: string; text: string }> = {
  budget: { bg: "bg-sage/15",   text: "text-sage-dark" },
  mid:    { bg: "bg-rust/12",   text: "text-rust-dark" },
  luxury: { bg: "bg-gold-light",text: "text-gold-dark" },
  ultra:  { bg: "bg-sky-light", text: "text-sky-dark" },
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

const REGION_GRADIENTS: Record<Region, string> = {
  europe:     "linear-gradient(160deg, #C8A45A 0%, #E8572A 100%)",
  asia:       "linear-gradient(160deg, #0A5E6E 0%, #2E86AB 100%)",
  americas:   "linear-gradient(160deg, #E8572A 0%, #9B2335 100%)",
  africa:     "linear-gradient(160deg, #D4820A 0%, #8B4513 100%)",
  middle_east:"linear-gradient(160deg, #7B3F9E 0%, #D4820A 100%)",
  oceania:    "linear-gradient(160deg, #0A6E6E 0%, #1464B4 100%)",
};

const REGION_EMOJI: Record<Region, string> = {
  europe:     "🏰",
  asia:       "⛩️",
  americas:   "🌎",
  africa:     "🌍",
  middle_east:"🕌",
  oceania:    "🌊",
};

export default function TripCard({ trip }: TripCardProps) {
  const budget = BUDGET_TIERS.find((b) => b.value === trip.budget_tier);
  const badgeOnImage = BUDGET_BADGE[trip.budget_tier];
  const badgeBody = BUDGET_BADGE_BODY[trip.budget_tier];
  const duration = tripDuration(trip.start_date, trip.end_date);
  const styleItems = TRAVEL_STYLES.filter((s) => trip.travel_styles?.includes(s.value));

  return (
    <Link href={`/trips/${trip.id}`}>
      <article className="bg-sand rounded-3xl border border-sand-dark hover:border-rust/40 hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer overflow-hidden">

        {/* ── Destination visual header ──────────────────── */}
        <div
          className="relative h-32"
          style={{ background: REGION_GRADIENTS[trip.region] }}
        >
          {/* Subtle dark overlay for text */}
          <div className="absolute inset-0 bg-black/25" />

          {/* Budget badge top-right */}
          <div className="absolute top-3 right-3">
            <span className={cn(
              "text-xs font-body font-semibold px-2.5 py-1 rounded-full border border-white/20",
              badgeOnImage.bg, badgeOnImage.text
            )}>
              {budget?.label}
            </span>
          </div>

          {/* Destination name bottom-left */}
          <div className="absolute bottom-3 left-4 right-16">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-base leading-none">{REGION_EMOJI[trip.region]}</span>
              <h3 className="font-display text-xl font-semibold text-white drop-shadow-sm leading-tight truncate">
                {trip.destination}
              </h3>
            </div>
            <p className="text-white/70 text-xs font-body">
              {trip.country}
            </p>
          </div>
        </div>

        {/* ── Card body ──────────────────────────────────── */}
        <div className="p-4">
          {/* Date + duration */}
          <p className="text-xs text-muted font-body mb-3">
            {formatDateRange(trip.start_date, trip.end_date)}
            <span className="mx-1.5 text-sand-dark">·</span>
            {duration} {duration === 1 ? "day" : "days"}
            <span className="mx-1.5 text-sand-dark">·</span>
            <span className={cn("font-medium", badgeBody.text)}>{budget?.label}</span>
          </p>

          {/* Description */}
          {trip.description && (
            <p className="text-sm text-ink/70 font-body leading-relaxed mb-3 line-clamp-2">
              {trip.description}
            </p>
          )}

          {/* Style tags */}
          {styleItems.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {styleItems.slice(0, 4).map((style) => {
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
              {styleItems.length > 4 && (
                <span className="text-xs text-muted font-body self-center">
                  +{styleItems.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar name={trip.profile?.full_name} size="sm" />
              <div>
                <p className="text-xs font-body font-medium text-ink">
                  {trip.profile?.full_name ?? "INSEAD traveller"}
                </p>
                {trip.profile?.cohort && (
                  <p className="text-xs text-muted font-body">{trip.profile.cohort}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted font-body">
              {trip.interest_count !== undefined && trip.interest_count > 0 && (
                <span className="flex items-center gap-1 text-sage font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  {trip.interest_count}
                </span>
              )}
              <span className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
                {trip.group_size} max
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
