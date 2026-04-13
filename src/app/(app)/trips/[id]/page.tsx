import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchDestinationImage } from "@/lib/unsplash";
import TripDetailClient from "./TripDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TripDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: tripData } = await supabase
    .from("trips")
    .select(
      `
      *,
      profile:profiles(*),
      trip_interests(*, profile:profiles(*))
    `
    )
    .eq("id", id)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trip = tripData as any;
  if (!trip) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userInterest = trip.trip_interests?.some((i: any) => i.user_id === user?.id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const travelers = trip.trip_interests?.map((i: any) => i.profile) ?? [];

  // Fetch destination photo (returns null if key not set — graceful fallback)
  const heroImage = await fetchDestinationImage(trip.destination, trip.country);

  return (
    <TripDetailClient
      trip={trip}
      travelers={travelers}
      currentUserId={user?.id ?? ""}
      initialInterest={userInterest ?? false}
      isOwner={trip.user_id === user?.id}
      heroImage={heroImage}
    />
  );
}
