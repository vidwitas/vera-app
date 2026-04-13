import { cn, getInitials } from "@/lib/utils";

interface AvatarProps {
  name: string | null | undefined;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
  xl: "w-20 h-20 text-2xl",
};

export default function Avatar({ name, size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full gradient-horizon text-cream font-display font-semibold flex items-center justify-center flex-shrink-0",
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
