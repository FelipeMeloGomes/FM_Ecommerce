"use client";

import PriceFormatter from "@/components/PriceFormatter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface MobileOrderSummaryProps {
  subtotal: number;
  discount: number;
  total: number;
  loading?: boolean;
  onCheckout: () => void;
}

const MobileOrderSummary = ({
  subtotal,
  discount,
  total,
  loading = false,
  onCheckout,
}: MobileOrderSummaryProps) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white pt-2">
      <div className="bg-white p-4 rounded-lg border mx-4">
        <h2>Resumo do Pedido</h2>
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
    </div>
  );
};

export default MobileOrderSummary;
