import { ProductGridSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="bg-shop-light-pink">
      <div className="h-96 bg-gray-200" />
      <div className="container mx-auto px-4 py-8">
        <ProductGridSkeleton />
      </div>
    </div>
  );
}
