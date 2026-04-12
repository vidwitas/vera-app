import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileClient from "./ProfileClient";

export const revalidate = 0;

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: trips } = await supabase
    .from("trips")
    .select("*")
    .eq("user_id", user.id)
    .order("start_date", { ascending: false });

  const { data: interests } = await supabase
    .from("trip_interests")
    .select("trip_id, trips(*)")
    .eq("user_id", user.id);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const interestedTrips = interests?.map((i: any) => i.trips).filter(Boolean) ?? [];

  return (
    <ProfileClient
      profile={profile}
      trips={trips ?? []}
      interestedTrips={interestedTrips}
      email={user.email ?? ""}
    />
  );
}
