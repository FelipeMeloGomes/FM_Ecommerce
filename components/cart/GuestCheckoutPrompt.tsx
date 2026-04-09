"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import PriceFormatter from "@/components/PriceFormatter";
import { ShippingCalculator } from "@/components/ShippingCalculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ShippingQuote } from "@/core/shipping/ShippingQuote";
import type { CartItem } from "@/store";

interface GuestCheckoutPromptProps {
  subtotal: number;
  discount: number;
  total: number;
  cartItems: CartItem[];
  selectedShipping: ShippingQuote | null;
  onSelectShipping: (shipping: ShippingQuote | null) => void;
}

export function GuestCheckoutPrompt({
  subtotal,
  discount,
  total,
  cartItems,
  selectedShipping,
  onSelectShipping,
}: GuestCheckoutPromptProps) {
  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">
            Resumo do Pedido
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
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
          <p className="text-xs text-muted-foreground pt-2">
            * Frete calculado ao informar CEP
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">
            Calcular Frete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ShippingCalculator
            cartItems={cartItems}
            selectedShipping={selectedShipping}
            onSelectShipping={onSelectShipping}
          />
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="space-y-4 pt-6">
          <p className="text-sm text-center text-muted-foreground">
            Faça login para finalizar sua compra
          </p>
          <SignInButton mode="modal">
            <Button
              className="w-full bg-shop_dark_green hover:bg-shop_btn_dark_green"
              size="lg"
            >
              Entrar
            </Button>
          </SignInButton>
          <div className="text-sm text-center text-muted-foreground">
            Não tem uma conta?
          </div>
          <SignUpButton mode="modal">
            <Button variant="outline" className="w-full" size="lg">
              Criar Conta
            </Button>
          </SignUpButton>
          <p className="text-xs text-center text-muted-foreground">
            Seus itens estão salvos e serão mantidos ao fazer login
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
