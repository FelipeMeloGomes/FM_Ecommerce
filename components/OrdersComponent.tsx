"use client";

import { format } from "date-fns";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { confirmToast } from "@/helpers/confirmToast";
import { apiRequest } from "@/lib/api/apiRequest";
import type { MY_ORDERS_QUERY_RESULT } from "@/sanity.types";
import OrderDetailDialog from "./OrderDetailDialog";
import PriceFormatter from "./PriceFormatter";
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

  const handleDelete = async (orderId: string) => {
    confirmToast({
      message: "Tem certeza que deseja deletar este pedido?",
      onConfirm: async () => {
        try {
          await apiRequest<{ success: boolean }>(
            `/api/admin/orders/${orderId}`,
            {
              method: "DELETE",
            },
          );

          toast.success("Pedido deletado com sucesso");

          setLocalOrders((prev) =>
            prev.filter((order) => order._id !== orderId),
          );

          router.refresh();
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Erro ao deletar pedido",
          );
        }
      },
    });
  };

  return (
    <>
      <TableBody>
        <TooltipProvider>
          {localOrders.map((order) => (
            <Tooltip key={order?.orderNumber}>
              <TooltipTrigger asChild>
                <TableRow
                  className="cursor-pointer hover:bg-gray-100 h-12"
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
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                      >
                        {order?.status.charAt(0).toUpperCase() +
                          order?.status.slice(1)}
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="hidden sm:table-cell">
                    {order?.invoice && (
                      <p className="font-medium line-clamp-1">
                        {order?.invoice ? order?.invoice?.number : "----"}
                      </p>
                    )}
                  </TableCell>
                  {isAdmin && (
                    <TableCell
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(order._id);
                      }}
                      className="flex items-center justify-center group"
                    >
                      <X
                        size={20}
                        className="group-hover:text-shop_dark_green hoverEffect"
                      />
                    </TableCell>
                  )}
                </TableRow>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ver detalhes do pedido</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </TableBody>
      <OrderDetailDialog
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  );
};

export default OrdersComponent;
