"use client";

import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import { TRAVEL_STYLES } from "@/lib/constants";

interface Match {
  profile: {
    id: string;
    full_name: string | null;
    cohort: string | null;
    travel_styles: string[];
    email_verified: boolean;
  };
  sharedDestinations: string[];
  overlappingTrips: Array<{
    id: string;
    destination: string;
    start_date: string;
    end_date: string;
    region: string;
  }>;
  score: number;
}

interface Props {
  matches: Match[];
  hasTrips: boolean;
}

export default function MatchesClient({ matches, hasTrips }: Props) {
  return (
    <div className="min-h-dvh">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-cream/95 backdrop-blur-sm border-b border-sand-dark">
        <div className="px-4 pt-12 pb-4">
          <h1 className="font-display text-2xl font-semibold text-ink">
            Your matches
          </h1>
          <p className="text-sm text-muted font-body mt-1">
            INSEAD travellers with overlapping destinations
          </p>
        </div>
      </div>

      <div className="px-4 py-4 pb-28">
        {!hasTrips ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-sand flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8A7968" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="font-display text-lg text-ink mb-2">No trips yet</h3>
            <p className="text-sm text-muted font-body mb-6 max-w-xs">
              Post a trip or express interest in one to see who you might travel with.
            </p>
            <Link
              href="/trips/new"
              className="inline-flex items-center gap-2 bg-rust text-cream text-sm font-body font-medium px-5 py-2.5 rounded-2xl hover:bg-rust-dark transition-colors"
            >
              Post a trip
            </Link>
          </div>
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-sand flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8A7968" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 15s1.5-2 4-2 4 2 4 2" />
                <line x1="9" x2="9.01" y1="9" y2="9" />
                <line x1="15" x2="15.01" y1="9" y2="9" />
              </svg>
            </div>
            <h3 className="font-display text-lg text-ink mb-2">No matches yet</h3>
            <p className="text-sm text-muted font-body max-w-xs">
              As more INSEAD members post trips, you&apos;ll see overlaps here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {matches.map((match) => (
              <MatchCard key={match.profile.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MatchCard({ match }: { match: Match }) {
  const { profile, sharedDestinations, overlappingTrips, score } = match;

  const travelStyles = TRAVEL_STYLES.filter((s) =>
    profile.travel_styles?.includes(s.value)
  );

  return (
    <div className="bg-sand rounded-3xl p-5 border border-sand-dark">
      <div className="flex items-start gap-3 mb-4">
        <Avatar name={profile.full_name} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-body font-semibold text-ink">
              {profile.full_name ?? "INSEAD member"}
            </h3>
            {profile.email_verified && (
              <span className="inline-flex items-center gap-0.5 text-xs text-sage bg-sage/10 px-1.5 py-0.5 rounded-full">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                INSEAD
              </span>
            )}
          </div>
          {profile.cohort && (
            <p className="text-xs text-muted font-body mt-0.5">{profile.cohort}</p>
          )}
          <div className="flex items-center gap-1 mt-1">
            <div className="w-2 h-2 rounded-full bg-rust/60" />
            <p className="text-xs text-rust font-body font-medium">
              {score} match point{score !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Shared destinations */}
      {sharedDestinations.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-muted font-body mb-1.5">Shared destinations</p>
          <div className="flex flex-wrap gap-1.5">
            {sharedDestinations.map((dest) => (
              <span
                key={dest}
                className="text-xs font-body font-medium px-2.5 py-1 rounded-full bg-rust/10 text-rust border border-rust/20"
              >
                {dest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Their trips in same region */}
      <div className="mb-3">
        <p className="text-xs text-muted font-body mb-1.5">
          {overlappingTrips.length} trip{overlappingTrips.length !== 1 ? "s" : ""} in your regions
        </p>
        <div className="flex flex-col gap-1.5">
          {overlappingTrips.slice(0, 3).map((trip) => (
            <Link
              key={trip.id}
              href={`/trips/${trip.id}`}
              className="flex items-center justify-between bg-cream rounded-xl px-3 py-2 border border-sand-dark hover:border-rust/30 transition-colors"
            >
              <span className="text-xs font-body font-medium text-ink truncate">
                {trip.destination}
              </span>
              <span className="text-xs text-muted font-body flex-shrink-0 ml-2">
                {new Date(trip.start_date).toLocaleDateString("en-GB", { month: "short", year: "2-digit" })}
              </span>
            </Link>
          ))}
          {overlappingTrips.length > 3 && (
            <p className="text-xs text-muted font-body px-1">
              +{overlappingTrips.length - 3} more
            </p>
          )}
        </div>
      </div>

      {/* Travel styles */}
      {travelStyles.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {travelStyles.slice(0, 4).map((style) => (
            <span
              key={style.value}
              className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-cream border border-sand-dark text-muted font-body"
            >
              {style.emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
