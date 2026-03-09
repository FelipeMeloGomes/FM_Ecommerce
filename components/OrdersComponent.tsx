"use client";

import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { confirmToast } from "@/helpers/confirmToast";
import { apiRequest } from "@/lib/api/apiRequest";
import type { MY_ORDERS_QUERY_RESULT } from "@/sanity.types";
import OrderDetailDialog from "./OrderDetailDialog";
import PriceFormatter from "./PriceFormatter";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { TableBody, TableCell, TableRow } from "./ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const OrdersComponent = ({
  orders,
  isAdmin,
}: {
  orders: MY_ORDERS_QUERY_RESULT;
  isAdmin: boolean;
}) => {
  const router = useRouter();
  const [localOrders, setLocalOrders] =
    useState<MY_ORDERS_QUERY_RESULT>(orders);
  const [selectedOrder, setSelectedOrder] = useState<
    MY_ORDERS_QUERY_RESULT[number] | null
  >(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  const toggleSelectAll = () => {
    if (selectedIds.size === localOrders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(localOrders.map((o) => o._id)));
    }
  };

  const handleDelete = async () => {
    if (selectedIds.size === 0) return;

    confirmToast({
      message:
        selectedIds.size === 1
          ? "Tem certeza que deseja deletar este pedido?"
          : `Tem certeza que deseja deletar ${selectedIds.size} pedidos?`,
      onConfirm: async () => {
        setDeleting(true);
        try {
          if (selectedIds.size === 1) {
            const [id] = Array.from(selectedIds);
            await apiRequest<{ success: boolean }>(`/api/admin/orders/${id}`, {
              method: "DELETE",
            });
          } else {
            await apiRequest<{ success: boolean }>(
              "/api/admin/orders/bulk-delete",
              {
                method: "DELETE",
                body: JSON.stringify({ ids: Array.from(selectedIds) }),
              },
            );
          }

          toast.success(
            selectedIds.size === 1
              ? "Pedido deletado com sucesso"
              : `${selectedIds.size} pedidos deletados com sucesso`,
          );

          setLocalOrders((prev) => prev.filter((o) => !selectedIds.has(o._id)));
          setSelectedIds(new Set());
          router.refresh();
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Erro ao deletar pedido(s)",
          );
        } finally {
          setDeleting(false);
        }
      },
    });
  };

  return (
    <>
      <TableBody>
        <TooltipProvider>
          <AnimatePresence mode="popLayout">
            {localOrders.map((order) => (
              <Tooltip key={order?._id}>
                <TooltipTrigger asChild>
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 1, x: 0 }}
                    exit={{
                      opacity: 0,
                      x: -20,
                      transition: { duration: 0.2 },
                    }}
                    layout
                    className={`cursor-pointer hover:bg-gray-100 h-12 border-b transition-colors ${
                      selectedIds.has(order._id) ? "bg-red-50" : ""
                    }`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <TableCell className="font-medium">
                      {order.orderNumber?.slice(-10) ?? "N/A"}...
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {order?.orderDate &&
                        format(new Date(order.orderDate), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {order.email}
                    </TableCell>
                    <TableCell>
                      <PriceFormatter
                        amount={order?.totalPrice}
                        className="text-black font-medium"
                      />
                    </TableCell>
                    <TableCell>
                      {order?.status && (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            order.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {order?.invoice && (
                        <p className="font-medium line-clamp-1">
                          {order?.invoice?.number ?? "----"}
                        </p>
                      )}
                    </TableCell>
                    {isAdmin && (
                      <TableCell
                        className="text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Checkbox
                            checked={selectedIds.has(order._id)}
                            onCheckedChange={() =>
                              setSelectedIds((prev) => {
                                const next = new Set(prev);
                                next.has(order._id)
                                  ? next.delete(order._id)
                                  : next.add(order._id);
                                return next;
                              })
                            }
                          />
                        </div>
                      </TableCell>
                    )}
                  </motion.tr>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ver detalhes do pedido</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </AnimatePresence>
        </TooltipProvider>
      </TableBody>

      {isAdmin && (
        <TableBody>
          <TableRow className="hover:bg-transparent border-t-2">
            <TableCell colSpan={8}>
              <div className="flex items-center justify-between px-1 py-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={
                      localOrders.length > 0 &&
                      selectedIds.size === localOrders.length
                    }
                    onCheckedChange={toggleSelectAll}
                    id="select-all"
                  />
                  <label
                    htmlFor="select-all"
                    className="text-xs text-muted-foreground cursor-pointer select-none"
                  >
                    {selectedIds.size > 0
                      ? `${selectedIds.size} selecionado(s)`
                      : "Selecionar todos"}
                  </label>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={selectedIds.size === 0 || deleting}
                  onClick={handleDelete}
                  className="flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  {deleting
                    ? "Deletando..."
                    : selectedIds.size > 1
                      ? `Deletar ${selectedIds.size} pedidos`
                      : "Deletar"}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      )}

      <OrderDetailDialog
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  );
};

export default OrdersComponent;
