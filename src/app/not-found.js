import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center rounded-3xl glass p-10 border border-border">
        <h1 className="text-7xl font-bold text-neon">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-neon px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:glow-neon"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

