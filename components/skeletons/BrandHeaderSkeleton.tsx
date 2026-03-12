import { Skeleton } from "@/components/ui/skeleton";

export function BrandHeaderSkeleton() {
  return (
    <div className="flex items-center gap-4 mb-8">
      <Skeleton className="h-24 w-24 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}
