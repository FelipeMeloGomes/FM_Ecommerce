import Container from "@/components/Container";
import { ProductGridSkeleton } from "@/components/skeletons/ProductGridSkeleton";

export default function Loading() {
  return (
    <div className="border-t border-border">
      <Container className="mt-6">
        <div className="sticky top-0 z-10 mb-6 bg-background pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-border">
            <div className="h-7 w-40 bg-muted rounded animate-pulse" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:sticky lg:top-24 lg:self-start lg:h-[calc(100vh-180px)] lg:overflow-y-auto lg:min-w-72 pb-6 lg:pr-4">
            <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
              <div className="space-y-3">
                <div className="h-5 w-24 bg-muted rounded animate-pulse" />
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-full bg-muted/50 rounded animate-pulse"
                    />
                  ))}
                </div>
              </div>
              <div className="my-4 border-t border-border" />
              <div className="space-y-3">
                <div className="h-5 w-20 bg-muted rounded animate-pulse" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-full bg-muted/50 rounded animate-pulse"
                    />
                  ))}
                </div>
              </div>
              <div className="my-4 border-t border-border" />
              <div className="space-y-3">
                <div className="h-5 w-20 bg-muted rounded animate-pulse" />
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-full bg-muted/50 rounded animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1 min-h-0">
            <div className="h-full overflow-y-auto pr-2 scrollbar-hide">
              <ProductGridSkeleton count={8} />
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
}
