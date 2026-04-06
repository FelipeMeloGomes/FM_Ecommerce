import Container from "@/components/Container";
import { ProductGridSkeleton } from "@/components/skeletons/ProductGridSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <Container className="py-8">
        <div className="mb-8 space-y-2">
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-5 w-64 bg-muted/50 rounded animate-pulse" />
        </div>

        <ProductGridSkeleton
          count={10}
          columns="grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        />
      </Container>
    </div>
  );
}
