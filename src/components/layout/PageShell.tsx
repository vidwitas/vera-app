import { cn } from "@/lib/utils";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  padBottom?: boolean;
}

export default function PageShell({
  children,
  className,
  padBottom = true,
}: PageShellProps) {
  return (
    <div
      className={cn(
        "app-shell",
        padBottom && "pb-24",
        className
      )}
    >
      {children}
    </div>
  );
}
