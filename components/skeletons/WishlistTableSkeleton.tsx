import { Skeleton } from "@/components/ui/skeleton";

export function WishlistTableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between py-4 border-b border-border">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-24" />
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                  Produto
                </th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">
                  Categoria
                </th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">
                  Tipo
                </th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">
                  Status
                </th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                  Preço
                </th>
                <th className="p-4 text-center text-sm font-medium text-muted-foreground">
                  Ação
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-16 w-16 rounded-lg" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="p-4 capitalize hidden md:table-cell">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </td>
                  <td className="p-4">
                    <Skeleton className="h-5 w-20" />
                  </td>
                  <td className="p-4">
                    <Skeleton className="h-9 w-full" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
