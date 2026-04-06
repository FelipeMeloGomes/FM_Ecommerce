import { DealHeroSkeleton, ProductGridSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="bg-shop-light-pink dark:bg-zinc-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 lg:pb-12">
        <section className="pb-8 lg:pb-12">
          <DealHeroSkeleton />
        </section>
        <section className="pb-8 lg:pb-12">
          <ProductGridSkeleton />
        </section>
      </div>
    </div>
  );
}
