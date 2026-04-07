export default function AdminQuestionsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-56 rounded-lg bg-muted" />
          <div className="h-4 w-48 rounded bg-muted" />
        </div>
        <div className="h-6 w-24 rounded-full bg-muted" />
      </div>

      {/* Search */}
      <div className="h-11 w-full max-w-md rounded-lg bg-muted" />

      {/* Question cards */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="border border-border/40 rounded-lg overflow-hidden bg-card"
          >
            <div className="p-4 flex items-start gap-3">
              {/* Avatar */}
              <div className="h-8 w-8 rounded-full bg-muted shrink-0" />

              <div className="flex-1 space-y-2">
                {/* Name + badge */}
                <div className="flex items-center gap-2">
                  <div className="h-4 w-28 rounded bg-muted" />
                  <div className="h-4 w-16 rounded-full bg-muted" />
                </div>

                {/* Question text */}
                <div className="space-y-1.5">
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-3/4 rounded bg-muted" />
                </div>

                {/* Date + product */}
                <div className="flex items-center gap-3">
                  <div className="h-3 w-24 rounded bg-muted" />
                  <div className="h-3 w-32 rounded bg-muted" />
                </div>
              </div>

              {/* Chevron */}
              <div className="h-4 w-4 rounded bg-muted shrink-0" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <div className="h-9 w-9 rounded-md bg-muted" />
        <div className="h-9 w-9 rounded-md bg-muted" />
        <div className="h-9 w-9 rounded-md bg-muted" />
        <div className="h-9 w-9 rounded-md bg-muted" />
        <div className="h-9 w-9 rounded-md bg-muted" />
      </div>
    </div>
  );
}
