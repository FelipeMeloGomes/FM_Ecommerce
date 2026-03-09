import { auth, currentUser } from "@clerk/nextjs/server";
import { ChevronLeft, ChevronRight, FileX } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import Container from "@/components/Container";
import OrdersComponent from "@/components/OrdersComponent";
import OrdersRefresher from "@/components/OrdersRefresher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMyOrders } from "@/sanity/queries";

const OrdersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const user = await currentUser();
  const role = user?.publicMetadata?.role;
  const isAdmin = role === "admin";

  const params = await searchParams;
  const LIMIT = 10;
  const currentPage = Number(params?.page ?? "1");
  const start = (currentPage - 1) * LIMIT;
  const end = start + LIMIT;

  const { orders, total } = await getMyOrders(userId, isAdmin, start, end);
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div>
      <OrdersRefresher intervalSeconds={10} />
      <Container className="py-10">
        {orders?.length ? (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Lista de Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-25 md:w-auto">
                        Número do Pedido
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Data
                      </TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Email
                      </TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Número do Pedido
                      </TableHead>
                      <TableHead className="text-center">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <OrdersComponent orders={orders} isAdmin={isAdmin} />
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              {totalPages > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                  {currentPage > 1 ? (
                    <Button asChild className="flex items-center gap-1">
                      <Link href={`/orders?page=${currentPage - 1}`}>
                        <ChevronLeft size={16} /> Anterior
                      </Link>
                    </Button>
                  ) : (
                    <Button disabled className="flex items-center gap-1">
                      <ChevronLeft size={16} /> Anterior
                    </Button>
                  )}

                  <span className="flex items-center px-2">
                    {currentPage} / {totalPages}
                  </span>

                  {currentPage < totalPages ? (
                    <Button asChild className="flex items-center gap-1">
                      <Link href={`/orders?page=${currentPage + 1}`}>
                        Próximo <ChevronRight size={16} />
                      </Link>
                    </Button>
                  ) : (
                    <Button disabled className="flex items-center gap-1">
                      Próximo <ChevronRight size={16} />
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <FileX className="h-24 w-24 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Nenhum pedido encontrado
            </h2>
            <p className="mt-2 text-sm text-gray-600 text-center max-w-md">
              Parece que você ainda não fez nenhum pedido. Comece a comprar para
              ver seus pedidos aqui!
            </p>
            <Button asChild className="mt-6">
              <Link href="/">Navegar pelos produtos</Link>
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default OrdersPage;
