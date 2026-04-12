export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-app">{children}</div>
    </div>
  );
}
