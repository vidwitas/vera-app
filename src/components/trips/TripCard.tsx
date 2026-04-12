import Link from "next/link";
import type { Trip } from "@/types/database";
import { formatDateRange, tripDuration, cn } from "@/lib/utils";
import { TRAVEL_STYLES, BUDGET_TIERS } from "@/lib/constants";
import Avatar from "@/components/ui/Avatar";

interface TripCardProps {
  trip: Trip;
}

const BUDGET_BADGE: Record<string, { bg: string; text: string }> = {
  budget: { bg: "bg-sage/15", text: "text-sage" },
  mid: { bg: "bg-rust/15", text: "text-rust" },
  luxury: { bg: "bg-amber-100", text: "text-amber-700" },
  ultra: { bg: "bg-purple-100", text: "text-purple-700" },
};

export default function TripCard({ trip }: TripCardProps) {
  const budget = BUDGET_TIERS.find((b) => b.value === trip.budget_tier);
  const badge = BUDGET_BADGE[trip.budget_tier];
  const duration = tripDuration(trip.start_date, trip.end_date);
  const styleItems = TRAVEL_STYLES.filter((s) => trip.travel_styles?.includes(s.value));

  return (
    <Link href={`/trips/${trip.id}`}>
      <article className="bg-sand rounded-3xl p-5 border border-sand-dark hover:border-rust/30 transition-all active:scale-[0.99] cursor-pointer">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-semibold text-ink leading-tight truncate">
              {trip.destination}
            </h3>
            <p className="text-xs text-muted font-body mt-0.5">
              {formatDateRange(trip.start_date, trip.end_date)}
              <span className="mx-1.5 text-sand-dark">·</span>
              {duration} {duration === 1 ? "day" : "days"}
            </p>
          </div>

          <span
            className={cn(
              "inline-flex text-xs font-body font-medium px-2.5 py-1 rounded-full flex-shrink-0",
              badge.bg,
              badge.text
            )}
          >
            {budget?.label}
          </span>
        </div>

        {/* Description */}
        {trip.description && (
          <p className="text-sm text-ink/70 font-body leading-relaxed mb-3 line-clamp-2">
            {trip.description}
          </p>
        )}

        {/* Style tags */}
        {styleItems.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {styleItems.slice(0, 4).map((style) => (
              <span
                key={style.value}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-cream border border-sand-dark text-muted font-body"
              >
                {style.emoji} {style.label}
              </span>
            ))}
            {styleItems.length > 4 && (
              <span className="text-xs text-muted font-body px-1">
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
              <span className="flex items-center gap-1">
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
      </article>
    </Link>
  );
}
