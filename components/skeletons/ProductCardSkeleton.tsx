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
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="p-4 flex flex-col gap-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-full mt-2" />
          </div>
        </div>
      ))}
    </>
  );
}
