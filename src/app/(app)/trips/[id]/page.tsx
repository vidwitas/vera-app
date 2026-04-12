import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  return (
    <TripDetailClient
      trip={trip}
      travelers={travelers}
      currentUserId={user?.id ?? ""}
      initialInterest={userInterest ?? false}
      isOwner={trip.user_id === user?.id}
    />
  );
}
