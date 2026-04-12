import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

export function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  if (s.getFullYear() !== e.getFullYear()) {
    return `${s.toLocaleDateString("en-GB", { ...opts, year: "numeric" })} – ${e.toLocaleDateString("en-GB", { ...opts, year: "numeric" })}`;
  }
  if (s.getMonth() !== e.getMonth()) {
    return `${s.toLocaleDateString("en-GB", opts)} – ${e.toLocaleDateString("en-GB", opts)} ${e.getFullYear()}`;
  }
  return `${s.getDate()}–${e.toLocaleDateString("en-GB", opts)} ${e.getFullYear()}`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function tripDuration(start: string, end: string): number {
  const diff = new Date(end).getTime() - new Date(start).getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

export function isInseadEmail(email: string): boolean {
  return email.trim().toLowerCase().endsWith("@insead.edu");
}

export const BUDGET_LABELS: Record<string, string> = {
  budget: "Budget",
  mid: "Mid-range",
  luxury: "Luxury",
  ultra: "Ultra",
};

export const BUDGET_COLORS: Record<string, string> = {
  budget: "bg-sage/20 text-sage",
  mid: "bg-rust/20 text-rust",
  luxury: "bg-amber-100 text-amber-700",
  ultra: "bg-purple-100 text-purple-700",
};
