import { cn } from "@/lib/utils";

interface TagProps {
  label: string;
  emoji?: string;
  selected?: boolean;
  onClick?: () => void;
  variant?: "style" | "region" | "budget";
  size?: "sm" | "md";
}

export default function Tag({
  label,
  emoji,
  selected,
  onClick,
  variant = "style",
  size = "md",
}: TagProps) {
  const base =
    "inline-flex items-center gap-1 rounded-full font-body font-medium transition-all duration-150 select-none";

  const sizes = {
    sm: "text-xs px-2.5 py-1",
    md: "text-xs px-3 py-1.5",
  };

  const variants = {
    style: selected
      ? "bg-rust text-cream"
      : "bg-sand border border-sand-dark text-muted hover:border-rust/40 hover:text-ink",
    region: selected
      ? "bg-sage text-cream"
      : "bg-sand border border-sand-dark text-muted hover:border-sage/40 hover:text-ink",
    budget: selected
      ? "bg-ink text-cream"
      : "bg-sand border border-sand-dark text-muted hover:border-ink/30 hover:text-ink",
  };

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(base, sizes[size], variants[variant], "cursor-pointer")}
      >
        {emoji && <span>{emoji}</span>}
        {label}
      </button>
    );
  }

  return (
    <span className={cn(base, sizes[size], variants[variant])}>
      {emoji && <span>{emoji}</span>}
      {label}
    </span>
  );
}
