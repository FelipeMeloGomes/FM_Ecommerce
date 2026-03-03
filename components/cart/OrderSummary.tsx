"use client";

import PriceFormatter from "@/components/PriceFormatter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
  subtotal: number;
  discount: number;
  total: number;
  loading?: boolean;
  onCheckout: () => void;
}

const OrderSummary = ({
  subtotal,
  discount,
  total,
  loading = false,
  onCheckout,
}: OrderSummaryProps) => {
  return (
    <div className="w-full bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>SubTotal</span>
          <PriceFormatter amount={subtotal} />
        </div>
        <div className="flex items-center justify-between">
          <span>Desconto</span>
          <PriceFormatter amount={discount} />
        </div>
        <Separator />
        <div className="flex items-center justify-between font-semibold text-lg">
          <span>Total</span>
          <PriceFormatter
            amount={total}
            className="text-lg font-bold text-black"
          />
        </div>
        <Button
          className="w-full rounded-full font-semibold tracking-wide hoverEffect"
          size="lg"
          disabled={loading}
          onClick={onCheckout}
        >
          {loading ? "Por favor, aguarde..." : "Finalizar Compra"}
        </Button>
      </div>
    </div>
  );
};

export default OrderSummary;
