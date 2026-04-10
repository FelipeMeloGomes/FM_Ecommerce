import { Skeleton } from "@/components/ui/skeleton";

export function CategoryHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-2 mb-8">
      <Skeleton className="h-5 w-20 rounded" />
      <Skeleton className="h-10 w-72" />
      <Skeleton className="h-6 w-96" />
    </div>
  );
}
