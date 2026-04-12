import { createClient } from "@/lib/supabase/server";
import FeedClient from "./FeedClient";

export const revalidate = 0;

export default async function FeedPage() {
  const supabase = await createClient();

  const { data: trips } = await supabase
    .from("trips")
    .select(
      `
      *,
      profile:profiles(*),
      interest_count:trip_interests(count)
    `
    )
    .eq("is_open", true)
    .gte("end_date", new Date().toISOString().split("T")[0])
    .order("created_at", { ascending: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normalised = (trips ?? []).map((t: any) => ({
    ...t,
    interest_count: t.interest_count?.[0]?.count ?? 0,
  }));

  return <FeedClient initialTrips={normalised} />;
}
