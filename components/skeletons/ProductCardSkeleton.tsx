import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="text-sm border rounded-md border-border dark:border-border bg-card dark:bg-card">
      <div className="relative group overflow-hidden bg-muted dark:bg-muted">
        <Skeleton className="w-full h-64 object-contain" />
      </div>
      <div className="p-3 flex flex-col gap-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-12 w-36 rounded-full" />
      </div>
    </div>
  );
}
