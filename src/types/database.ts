export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type BudgetTier = "budget" | "mid" | "luxury" | "ultra";
export type TravelStyle =
  | "adventure"
  | "culture"
  | "food"
  | "nature"
  | "nightlife"
  | "wellness"
  | "art"
  | "history"
  | "beach"
  | "city"
  | "remote";

export type Region =
  | "europe"
  | "asia"
  | "americas"
  | "africa"
  | "middle_east"
  | "oceania";

// ── Raw DB rows (no joins) ──────────────────────────────────

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  cohort: string | null;
  bio: string | null;
  travel_styles: TravelStyle[];
  avatar_url: string | null;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface TripRow {
  id: string;
  user_id: string;
  destination: string;
  country: string;
  region: Region;
  start_date: string;
  end_date: string;
  budget_tier: BudgetTier;
  travel_styles: TravelStyle[];
  group_size: number;
  description: string;
  is_open: boolean;
  created_at: string;
  updated_at: string;
}

export interface TripInterestRow {
  id: string;
  trip_id: string;
  user_id: string;
  created_at: string;
}

// ── App-level types (with optional joins) ──────────────────

export type Profile = ProfileRow;

export interface Trip extends TripRow {
  profile?: Profile;
  interest_count?: number;
  user_interest?: boolean;
}

export interface TripInterest extends TripInterestRow {
  profile?: Profile;
}

export interface Match {
  user: Profile;
  shared_destinations: string[];
  overlapping_trips: Trip[];
  match_score: number;
}

// ── Supabase Database generic ───────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Omit<ProfileRow, "created_at" | "updated_at">;
        Update: Partial<Omit<ProfileRow, "id" | "created_at">>;
      };
      trips: {
        Row: TripRow;
        Insert: Omit<TripRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<TripRow, "id" | "user_id" | "created_at">>;
      };
      trip_interests: {
        Row: TripInterestRow;
        Insert: Omit<TripInterestRow, "id" | "created_at">;
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      budget_tier: BudgetTier;
      travel_style: TravelStyle;
      region: Region;
    };
  };
}
