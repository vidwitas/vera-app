"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Profile, Trip } from "@/types/database";
import { TRAVEL_STYLES } from "@/lib/constants";
import { formatDateRange, tripDuration } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import Avatar from "@/components/ui/Avatar";

interface Props {
  profile: Profile | null;
  trips: Trip[];
  interestedTrips: Trip[];
  email: string;
}

export default function ProfileClient({ profile, trips, interestedTrips, email }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<"mytrips" | "interested">("mytrips");
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const travelStyles = TRAVEL_STYLES.filter((s) =>
    profile?.travel_styles?.includes(s.value)
  );

  const displayTrips = tab === "mytrips" ? trips : interestedTrips;

  return (
    <div className="min-h-dvh pb-28">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-cream/95 backdrop-blur-sm border-b border-sand-dark">
        <div className="flex items-center justify-between px-4 py-4 pt-12">
          <h1 className="font-display text-2xl font-semibold text-ink">Profile</h1>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="text-sm text-muted font-body hover:text-ink transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="px-4 py-6 flex flex-col gap-6">
        {/* Profile card */}
        <div className="bg-sand rounded-3xl p-6 border border-sand-dark">
          <div className="flex items-start gap-4 mb-4">
            <Avatar name={profile?.full_name} size="xl" />
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display text-xl font-semibold text-ink leading-tight">
                  {profile?.full_name ?? "INSEAD Traveller"}
                </h2>
                {profile?.email_verified && (
                  <span className="inline-flex items-center gap-1 text-xs text-sage bg-sage/10 px-2 py-0.5 rounded-full font-body font-medium">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Verified INSEAD
                  </span>
                )}
              </div>
              {profile?.cohort && (
                <p className="text-sm text-muted font-body mt-0.5">{profile.cohort}</p>
              )}
              <p className="text-xs text-muted/70 font-body mt-1">{email}</p>
            </div>
          </div>

          {profile?.bio && (
            <p className="text-sm text-ink/80 font-body leading-relaxed mb-4">
              {profile.bio}
            </p>
          )}

          {/* Travel style tags */}
          {travelStyles.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {travelStyles.map((style) => (
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

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-sand rounded-2xl p-3 border border-sand-dark text-center">
            <p className="font-display text-2xl font-semibold text-ink">{trips.length}</p>
            <p className="text-xs text-muted font-body mt-0.5">Trips posted</p>
          </div>
          <div className="bg-sand rounded-2xl p-3 border border-sand-dark text-center">
            <p className="font-display text-2xl font-semibold text-ink">{interestedTrips.length}</p>
            <p className="text-xs text-muted font-body mt-0.5">Interested in</p>
          </div>
          <div className="bg-sand rounded-2xl p-3 border border-sand-dark text-center">
            <p className="font-display text-2xl font-semibold text-rust">
              {travelStyles.length}
            </p>
            <p className="text-xs text-muted font-body mt-0.5">Styles</p>
          </div>
        </div>

        {/* Trips tabs */}
        <div>
          <div className="flex gap-1 bg-sand rounded-2xl p-1 border border-sand-dark mb-4">
            <button
              onClick={() => setTab("mytrips")}
              className={`flex-1 py-2 text-sm font-body font-medium rounded-xl transition-all ${
                tab === "mytrips"
                  ? "bg-cream text-ink shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
            >
              My trips ({trips.length})
            </button>
            <button
              onClick={() => setTab("interested")}
              className={`flex-1 py-2 text-sm font-body font-medium rounded-xl transition-all ${
                tab === "interested"
                  ? "bg-cream text-ink shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
            >
              Interested ({interestedTrips.length})
            </button>
          </div>

          {displayTrips.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-muted font-body mb-4">
                {tab === "mytrips"
                  ? "You haven't posted any trips yet."
                  : "You haven't expressed interest in any trips."}
              </p>
              {tab === "mytrips" && (
                <Link
                  href="/trips/new"
                  className="inline-flex items-center gap-2 bg-rust text-cream text-sm font-body font-medium px-5 py-2.5 rounded-2xl hover:bg-rust-dark transition-colors"
                >
                  Post your first trip
                </Link>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {displayTrips.map((trip) => (
                <ProfileTripRow key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileTripRow({ trip }: { trip: Trip }) {
  const duration = tripDuration(trip.start_date, trip.end_date);

  return (
    <Link href={`/trips/${trip.id}`}>
      <div className="bg-sand rounded-2xl p-4 border border-sand-dark hover:border-rust/30 transition-all active:scale-[0.99]">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-body font-semibold text-ink text-sm truncate">
              {trip.destination}
            </h4>
            <p className="text-xs text-muted font-body mt-0.5">
              {formatDateRange(trip.start_date, trip.end_date)}
              <span className="mx-1.5">·</span>
              {duration}d
            </p>
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8A7968"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0 mt-0.5"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
