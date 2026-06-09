"use client";

import { format } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import type { MY_ORDERS_QUERYResult } from "@/sanity.types";
import OrderDetailDialog from "./OrderDetailDialog";
import PriceFormatter from "./PriceFormatter";
import { TableBody, TableCell } from "./ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const OrdersComponent = ({
  orders,
}: {
  orders: MY_ORDERS_QUERYResult["orders"];
}) => {
  const [localOrders, setLocalOrders] =
    useState<MY_ORDERS_QUERYResult["orders"]>(orders);
  const [selectedOrder, setSelectedOrder] = useState<
    MY_ORDERS_QUERYResult["orders"][number] | null
  >(null);

  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  const handleSelectOrder = useCallback(
    (order: MY_ORDERS_QUERYResult["orders"][number]) => {
      setSelectedOrder(order);
    },
    [],
  );

  const handleSelectOrderWrapper = useCallback(
    (order: MY_ORDERS_QUERYResult["orders"][number]) => () =>
      handleSelectOrder(order),
    [handleSelectOrder],
  );

  const handleCloseDialog = useCallback(() => {
    setSelectedOrder(null);
  }, []);

  return (
    <>
      <TableBody>
        <TooltipProvider>
          <AnimatePresence mode="popLayout">
            {localOrders.map(
              (order: MY_ORDERS_QUERYResult["orders"][number]) => (
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
                      className="cursor-pointer hover:bg-muted/50 border-b transition-colors"
                      onClick={handleSelectOrderWrapper(order)}
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
                          className="font-semibold text-foreground"
                        />
                      </TableCell>
                      <TableCell>
                        {order?.status && (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === "paid"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-yellow-100 text-yellow-700"
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
                    </motion.tr>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ver detalhes do pedido</p>
                  </TooltipContent>
                </Tooltip>
              ),
            )}
          </AnimatePresence>
        </TooltipProvider>
      </TableBody>

      <OrderDetailDialog
        order={
          selectedOrder as unknown as Parameters<
            typeof OrderDetailDialog
          >[0] extends { order: infer O }
            ? NonNullable<O>
            : never
        }
        isOpen={!!selectedOrder}
        onClose={handleCloseDialog}
      />
    </>
  );
};

export default OrdersComponent;
