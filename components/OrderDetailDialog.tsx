import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import type { MY_ORDERS_QUERY_RESULT } from "@/sanity.types";
import PriceFormatter from "./PriceFormatter";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface OrderDetailsDialogProps {
  order: MY_ORDERS_QUERY_RESULT["orders"][number] | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl! max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Detalhes do Pedido — {order?.orderNumber}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Cliente:</span>
              <p className="font-medium">{order.customerName}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Email:</span>
              <p className="font-medium">{order.email}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Data:</span>
              <p className="font-medium">
                {order.orderDate &&
                  new Date(order.orderDate).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span>
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                  order.status === "paid"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Número do pedido:</span>
              <p className="font-medium">{order?.invoice?.number}</p>
            </div>
          </div>
          {order?.invoice && order?.invoice?.hosted_invoice_url && (
            <Button
              asChild
              className="w-full mt-2 bg-shop_dark_green hover:bg-shop_btn_dark_green"
            >
              <Link href={order?.invoice?.hosted_invoice_url} target="_blank">
                Baixar Nota Fiscal
              </Link>
            </Button>
          )}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Preço</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.products?.map((item) => (
              <TableRow key={item._key}>
                <TableCell className="flex items-center gap-3">
                  {item?.product?.images && (
                    <Image
                      src={urlFor(item?.product?.images[0]).url()}
                      alt="productImage"
                      width={50}
                      height={50}
                      className="rounded-md border object-cover"
                    />
                  )}
                  <span className="font-medium">{item?.product?.name}</span>
                </TableCell>
                <TableCell>{item?.quantity}</TableCell>
                <TableCell>
                  <PriceFormatter
                    amount={item?.product?.price}
                    className="font-semibold"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-end">
          <div className="w-48 space-y-2 text-sm">
            {order?.amountDiscount !== 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Desconto:</span>
                <PriceFormatter
                  amount={order?.amountDiscount}
                  className="font-medium text-destructive"
                />
              </div>
            )}
            {order?.shipping?.price && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Frete{" "}
                  {order?.shipping?.method && `(${order.shipping.method})`}:
                </span>
                <PriceFormatter
                  amount={order.shipping.price}
                  className="font-medium"
                />
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-border font-bold">
              <span>Total:</span>
              <PriceFormatter
                amount={order?.totalPrice}
                className="text-shop_dark_green"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
