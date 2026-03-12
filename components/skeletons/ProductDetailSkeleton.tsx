import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-10">
      <div className="w-full md:w-1/2">
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
      <div className="w-full md:w-1/2 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-12 w-1/3 mt-8" />
        <Skeleton className="h-12 w-full mt-4" />
      </div>
    </div>
  );
}
