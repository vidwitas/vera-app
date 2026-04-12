"use client";

import { useState, useMemo } from "react";
import type { Trip, Region, TravelStyle } from "@/types/database";
import { REGIONS, TRAVEL_STYLES } from "@/lib/constants";
import TripCard from "@/components/trips/TripCard";
import Link from "next/link";

interface FeedClientProps {
  initialTrips: Trip[];
}

export default function FeedClient({ initialTrips }: FeedClientProps) {
  const [regionFilter, setRegionFilter] = useState<Region | null>(null);
  const [styleFilter, setStyleFilter] = useState<TravelStyle | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return initialTrips.filter((trip) => {
      if (regionFilter && trip.region !== regionFilter) return false;
      if (styleFilter && !trip.travel_styles?.includes(styleFilter)) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !trip.destination.toLowerCase().includes(q) &&
          !trip.description?.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [initialTrips, regionFilter, styleFilter, search]);

  return (
    <div className="flex flex-col min-h-dvh">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-sm border-b border-sand-dark">
        <div className="px-4 pt-12 pb-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-display text-2xl font-semibold text-ink">
              Explore trips
            </h1>
            <Link
              href="/trips/new"
              className="flex items-center gap-1.5 text-sm font-body font-medium text-rust hover:text-rust-dark transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Post trip
            </Link>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search destinations..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-sand border border-sand-dark text-ink placeholder:text-muted font-body text-sm focus:outline-none focus:ring-2 focus:ring-rust/30 focus:border-rust/40 transition-all"
            />
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide no-scrollbar">
            <button
              onClick={() => setRegionFilter(null)}
              className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-body font-medium transition-all border ${
                regionFilter === null && styleFilter === null
                  ? "bg-ink text-cream border-ink"
                  : "bg-sand border-sand-dark text-muted hover:text-ink"
              }`}
            >
              All
            </button>
            {REGIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() =>
                  setRegionFilter(regionFilter === value ? null : value)
                }
                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-body font-medium transition-all border ${
                  regionFilter === value
                    ? "bg-sage text-cream border-sage"
                    : "bg-sand border-sand-dark text-muted hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Style chips */}
          <div className="flex gap-2 overflow-x-auto pt-2 pb-1 no-scrollbar">
            {TRAVEL_STYLES.map(({ value, label, emoji }) => (
              <button
                key={value}
                onClick={() =>
                  setStyleFilter(styleFilter === value ? null : value)
                }
                className={`flex-shrink-0 inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-body font-medium transition-all border ${
                  styleFilter === value
                    ? "bg-rust text-cream border-rust"
                    : "bg-sand border-sand-dark text-muted hover:text-ink"
                }`}
              >
                {emoji} {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Trip list */}
      <main className="flex-1 px-4 py-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-sand flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8A7968" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 15s1.5-2 4-2 4 2 4 2" />
                <line x1="9" x2="9.01" y1="9" y2="9" />
                <line x1="15" x2="15.01" y1="9" y2="9" />
              </svg>
            </div>
            <h3 className="font-display text-lg text-ink mb-1">No trips found</h3>
            <p className="text-sm text-muted font-body mb-6">
              {search || regionFilter || styleFilter
                ? "Try adjusting your filters"
                : "Be the first to post a trip!"}
            </p>
            <Link
              href="/trips/new"
              className="inline-flex items-center gap-2 bg-rust text-cream text-sm font-body font-medium px-5 py-2.5 rounded-2xl hover:bg-rust-dark transition-colors"
            >
              Post a trip
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
