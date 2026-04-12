import type { TravelStyle, Region, BudgetTier } from "@/types/database";

export const INSEAD_DOMAIN = "insead.edu";

export const TRAVEL_STYLES: { value: TravelStyle; label: string; emoji: string }[] = [
  { value: "adventure", label: "Adventure", emoji: "🏔" },
  { value: "culture", label: "Culture", emoji: "🎭" },
  { value: "food", label: "Food & Drink", emoji: "🍜" },
  { value: "nature", label: "Nature", emoji: "🌿" },
  { value: "nightlife", label: "Nightlife", emoji: "🌃" },
  { value: "wellness", label: "Wellness", emoji: "🧘" },
  { value: "art", label: "Art", emoji: "🎨" },
  { value: "history", label: "History", emoji: "🏛" },
  { value: "beach", label: "Beach", emoji: "🏖" },
  { value: "city", label: "City Break", emoji: "🏙" },
  { value: "remote", label: "Off the Grid", emoji: "🗺" },
];

export const REGIONS: { value: Region; label: string }[] = [
  { value: "europe", label: "Europe" },
  { value: "asia", label: "Asia" },
  { value: "americas", label: "Americas" },
  { value: "africa", label: "Africa" },
  { value: "middle_east", label: "Middle East" },
  { value: "oceania", label: "Oceania" },
];

export const BUDGET_TIERS: { value: BudgetTier; label: string; description: string }[] = [
  { value: "budget", label: "Budget", description: "Under €1,000/wk" },
  { value: "mid", label: "Mid-range", description: "€1k–€3k/wk" },
  { value: "luxury", label: "Luxury", description: "€3k–€7k/wk" },
  { value: "ultra", label: "Ultra", description: "€7k+/wk" },
];
