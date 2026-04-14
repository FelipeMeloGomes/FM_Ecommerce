"use client";

import PriceFormatter from "@/components/PriceFormatter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { ShippingQuote } from "@/core/shipping/ShippingQuote";

interface OrderSummaryProps {
  subtotal: number;
  discount: number;
  total: number;
  shipping?: ShippingQuote | null;
  loading?: boolean;
  selectedAddressId?: string;
  onCheckout: () => void;
}

const OrderSummary = ({
  subtotal,
  discount,
  total,
  shipping,
  loading = false,
  selectedAddressId: _selectedAddressId,
  onCheckout,
}: OrderSummaryProps) => {
  return (
    <div className="w-full bg-card border border-border/60 p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">SubTotal</span>
          <PriceFormatter amount={subtotal} className="font-medium" />
        </div>
        {shipping && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Frete ({shipping.service})
            </span>
            <PriceFormatter amount={shipping.price} className="font-medium" />
          </div>
        )}
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
        <div className="flex items-center justify-between font-semibold text-lg">
          <span>Total</span>
          <PriceFormatter
            amount={total}
            className="text-xl font-bold text-shop_dark_green"
          />
        </div>
        <Button
          className="w-full mt-4 bg-shop_dark_green hover:bg-shop_btn_dark_green font-semibold"
          size="lg"
          disabled={loading}
          onClick={onCheckout}
        >
          {loading ? "Aguarde..." : "Finalizar Compra"}
        </Button>
      </div>
    </div>
  );
};

export default OrderSummary;
