import { Skeleton } from "@/components/ui/skeleton";

export function DealHeroSkeleton() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-shop_light_pink/50 via-background to-shop_light_pink/30 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800 rounded-2xl p-8 lg:p-12">
      <div className="relative z-10 flex items-center justify-between">
        <div className="space-y-4 max-w-lg">
          <Skeleton className="h-10 w-80 lg:h-12 lg:w-96" />
          <Skeleton className="h-12 w-36" />
        </div>
        <div className="hidden lg:block">
          <Skeleton className="w-[400px] h-[400px] rounded-lg" />
        </div>
      </div>
    </div>
  );
}
