/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import MatchesClient from "./MatchesClient";

export const revalidate = 0;

export default async function MatchesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Get current user's trips
  const { data: myTrips } = await supabase
    .from("trips")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_open", true);

  // Get trips the user expressed interest in
  const { data: myInterests } = await supabase
    .from("trip_interests")
    .select("trip_id, trips(*)")
    .eq("user_id", user.id);

  const interestTrips = myInterests?.map((i: any) => i.trips).filter(Boolean) ?? [];
  const allMyTrips = [...(myTrips ?? []), ...interestTrips];

  if (allMyTrips.length === 0) {
    return <MatchesClient matches={[]} hasTrips={false} />;
  }

  // Find overlapping trips from other users
  const myDestinations = allMyTrips.map((t: any) => t.destination.toLowerCase());
  const myRegions = allMyTrips.map((t: any) => t.region);

  const { data: overlappingTrips } = await supabase
    .from("trips")
    .select("*, profile:profiles(*)")
    .neq("user_id", user.id)
    .eq("is_open", true)
    .or(
      myRegions.map((r: string) => `region.eq.${r}`).join(",")
    );

  // Build match map by user
  const matchMap: Record<string, {
    profile: any;
    sharedDestinations: string[];
    overlappingTrips: any[];
  }> = {};

  for (const trip of (overlappingTrips ?? []) as any[]) {
    if (!trip.profile) continue;
    const uid = trip.user_id;

    if (!matchMap[uid]) {
      matchMap[uid] = {
        profile: trip.profile,
        sharedDestinations: [],
        overlappingTrips: [],
      };
    }

    matchMap[uid].overlappingTrips.push(trip);

    if (myDestinations.includes(trip.destination.toLowerCase())) {
      if (!matchMap[uid].sharedDestinations.includes(trip.destination)) {
        matchMap[uid].sharedDestinations.push(trip.destination);
      }
    }
  }

  // Score and sort
  const matches = Object.values(matchMap)
    .map((m) => ({
      ...m,
      score: m.sharedDestinations.length * 3 + m.overlappingTrips.length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 30);

  return <MatchesClient matches={matches} hasTrips={true} />;
}
