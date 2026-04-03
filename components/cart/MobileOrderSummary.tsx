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
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-background border-t border-border pt-2 pb-2 z-40">
      <div className="bg-card p-4 rounded-t-xl border mx-4 border-b-0">
        <h2 className="font-semibold mb-3">Resumo do Pedido</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">SubTotal</span>
            <PriceFormatter amount={subtotal} className="font-medium" />
          </div>
          {discount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Desconto</span>
              <PriceFormatter
                amount={discount}
                className="text-destructive font-medium"
              />
            </div>
          )}
          <Separator />
          <div className="flex items-center justify-between font-semibold">
            <span>Total</span>
            <PriceFormatter
              amount={total}
              className="font-bold text-shop_dark_green"
            />
          </div>
          <Button
            className="w-full mt-3 bg-shop_dark_green hover:bg-shop_btn_dark_green font-semibold"
            size="lg"
            disabled={loading}
            onClick={onCheckout}
          >
            {loading ? "Aguarde..." : "Finalizar Compra"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileOrderSummary;
