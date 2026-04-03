export const dynamic = "force-dynamic";
export const revalidate = 0;

import { auth, currentUser } from "@clerk/nextjs/server";
import { ChevronLeft, ChevronRight, FileX } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Container from "@/components/Container";
import OrdersComponent from "@/components/OrdersComponent";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMyOrders } from "@/sanity/queries";

function OrdersTableSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="space-y-3">
        {["row-1", "row-2", "row-3", "row-4", "row-5"].map((key) => (
          <Skeleton key={key} className="h-12 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}

async function OrdersList({
  userId,
  isAdmin,
  currentPage,
}: {
  userId: string;
  isAdmin: boolean;
  currentPage: number;
}) {
  const LIMIT = 10;
  const start = (currentPage - 1) * LIMIT;
  const end = start + LIMIT;

  const orderData = await getMyOrders(userId, isAdmin, start, end);
  const totalPages = Math.ceil(orderData.total / LIMIT);

  if (!orderData.orders?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <FileX className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight">
          Nenhum pedido encontrado
        </h2>
        <p className="mt-2 text-sm text-muted-foreground text-center max-w-md">
          Parece que você ainda não fez nenhum pedido. Comece a comprar para ver
          seus pedidos aqui!
        </p>
        <Button asChild className="mt-6">
          <Link href="/shop">Navegar pelos produtos</Link>
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-full border-border shadow-sm">
      <CardHeader className="border-b border-border pb-4">
        <Title className="text-xl">Lista de Pedidos</Title>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-25 md:w-auto font-medium">
                  Número do Pedido
                </TableHead>
                <TableHead className="hidden md:table-cell font-medium">
                  Data
                </TableHead>
                <TableHead className="font-medium">Cliente</TableHead>
                <TableHead className="hidden sm:table-cell font-medium">
                  Email
                </TableHead>
                <TableHead className="font-medium">Total</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="hidden sm:table-cell font-medium">
                  ID Stripe
                </TableHead>
                {isAdmin && (
                  <TableHead className="text-center font-medium">
                    Ação
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <OrdersComponent orders={orderData.orders} isAdmin={isAdmin} />
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4 border-t border-border">
            {currentPage > 1 ? (
              <Button asChild variant="outline" size="sm">
                <Link href={`/orders?page=${currentPage - 1}`}>
                  <ChevronLeft size={16} />
                  <span className="ml-1">Anterior</span>
                </Link>
              </Button>
            ) : (
              <Button disabled variant="outline" size="sm">
                <ChevronLeft size={16} />
                <span className="ml-1">Anterior</span>
              </Button>
            )}
            <span className="text-sm text-muted-foreground px-3">
              {currentPage} de {totalPages}
            </span>
            {currentPage < totalPages ? (
              <Button asChild variant="outline" size="sm">
                <Link href={`/orders?page=${currentPage + 1}`}>
                  <span className="mr-1">Próxima</span>
                  <ChevronRight size={16} />
                </Link>
              </Button>
            ) : (
              <Button disabled variant="outline" size="sm">
                <span className="mr-1">Próxima</span>
                <ChevronRight size={16} />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const OrdersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const [{ userId }, user] = await Promise.all([auth(), currentUser()]);
  if (!userId) return redirect("/");

  const isAdmin = user?.publicMetadata?.role === "admin";

  const params = await searchParams;
  const currentPage = Number(params?.page ?? "1");

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-8">
        <Title className="text-2xl mb-6">Meus Pedidos</Title>
        <Suspense fallback={<OrdersTableSkeleton />}>
          <OrdersList
            userId={userId}
            isAdmin={isAdmin}
            currentPage={currentPage}
          />
        </Suspense>
      </Container>
    </div>
  );
};

export default OrdersPage;
