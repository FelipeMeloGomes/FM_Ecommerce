import { Skeleton } from "@/components/ui/skeleton";

interface ProductCardSkeletonProps {
  count?: number;
}

export function ProductCardSkeleton({ count = 1 }: ProductCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-card border border-border/60 rounded-xl overflow-hidden"
        >
          <div className="relative aspect-square bg-muted/20 overflow-hidden">
            <Skeleton className="w-full h-full" />
            <Skeleton className="absolute top-3 right-3 h-8 w-8 rounded-full" />
            <Skeleton className="absolute top-3 left-3 h-6 w-6 rounded-full" />
          </div>
          <div className="p-4 flex flex-col gap-3">
            <Skeleton className="h-3 w-20" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Skeleton key={star} className="h-4 w-4 rounded" />
                ))}
              </div>
              <Skeleton className="h-3 w-6" />
            </div>
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </>
  );
}
