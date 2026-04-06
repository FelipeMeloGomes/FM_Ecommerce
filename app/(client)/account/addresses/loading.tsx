import Container from "@/components/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container>
      <div className="py-8 lg:py-12">
        <div className="flex flex-col gap-2 mb-8">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>

        <div className="space-y-8">
          <Card className="border-border/60">
            <CardHeader className="bg-muted/20 border-b border-border/40">
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-4 w-20" />
              </div>

              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Skeleton className="h-9 w-36" />
          </div>

          <Card className="border-border/60">
            <CardHeader className="bg-muted/20 border-b border-border/40">
              <Skeleton className="h-6 w-48" />
            </CardHeader>

            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="grid gap-1 flex-1">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-56" />
                      <Skeleton className="h-4 w-24" />
                    </div>

                    <div className="flex flex-wrap gap-2 ml-4">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
