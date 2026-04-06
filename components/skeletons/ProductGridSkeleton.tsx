import { ProductCardSkeleton } from "./ProductCardSkeleton";

interface ProductGridSkeletonProps {
  count?: number;
  columns?: string;
}

export function ProductGridSkeleton({
  count = 8,
  columns = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
}: ProductGridSkeletonProps) {
  return (
    <div className={`grid ${columns} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
