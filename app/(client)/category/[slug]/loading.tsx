import Container from "@/components/Container";
import { ProductCardSkeleton } from "@/components/skeletons/ProductCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="py-8 lg:py-12">
      <Container>
        <div className="flex flex-col gap-2 mb-8">
          <Skeleton className="h-5 w-20 rounded" />
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
          <div className="w-full lg:w-56 shrink-0">
            <div className="bg-card rounded-xl border border-border/60 overflow-hidden">
              <div className="p-4 border-b border-border/40 bg-muted/20">
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="flex flex-col">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full text-left px-4 py-3 border-b border-border/20 last:border-b-0"
                  >
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-[400px]">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              <ProductCardSkeleton count={8} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
