"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createCheckoutSession } from "@/actions/createCheckoutSession";
import { deleteAddress } from "@/actions/deleteAddress";
import Container from "@/components/Container";
import AddressSection from "@/components/cart/AddressSection";
import CartItemsList from "@/components/cart/CartItemsList";
import MobileOrderSummary from "@/components/cart/MobileOrderSummary";
import OrderSummary from "@/components/cart/OrderSummary";
import EmptyCart from "@/components/EmptyCart";
import NoAccess from "@/components/NoAccess";
import { ShippingCalculator } from "@/components/ShippingCalculator";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { confirmToast } from "@/helpers/confirmToast";
import type { Address } from "@/sanity.types";
import useStore from "@/store";
import { performCheckout } from "./checkoutLogic";

interface CartClientProps {
  addresses: Address[];
}

const CartClient = ({ addresses }: CartClientProps) => {
  const { getTotalPrice, getSubTotalPrice, resetCart } = useStore();
  const [loading, setLoading] = useState(false);
  const groupedItems = useStore((state) => state.getGroupedItems());
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const { shipping, setShipping } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (addresses.length > 0) {
      setSelectedAddress(addresses.find((a) => a.default) ?? addresses[0]);
    }
  }, [addresses]);

  useEffect(() => {
    router.refresh();
  }, [router]);

  const handleResetCart = () => {
    confirmToast({
      message: "Tem certeza que deseja limpar seu carrinho?",
      onConfirm: () => {
        resetCart();
        toast.success("Carrinho limpo com sucesso!");
      },
    });
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const checkoutUrl = await performCheckout(
        groupedItems,
        user,
        selectedAddress,
        shipping,
        { createCheckoutSession },
      );
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        console.error("Error creating checkout session:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen pb-52 md:pb-10">
      {isSignedIn ? (
        <Container>
          {groupedItems?.length ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3 py-5">
                <ShoppingBag className="w-6 h-6 text-foreground" />
                <Title className="text-2xl font-semibold">
                  Carrinho de compras
                </Title>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <CartItemsList items={groupedItems} />
                    <div className="p-4 border-t border-border flex justify-end">
                      <Button
                        onClick={handleResetCart}
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Limpar Carrinho
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <OrderSummary
                    subtotal={getSubTotalPrice()}
                    discount={getSubTotalPrice() - getTotalPrice()}
                    total={getTotalPrice()}
                    loading={loading}
                    selectedAddressId={selectedAddress?._id}
                    onCheckout={handleCheckout}
                  />

                  <AddressSection
                    addresses={addresses}
                    selectedAddressId={selectedAddress?._id}
                    onSelectAddress={(value) => {
                      const address = addresses.find(
                        (addr) => addr._id === value,
                      );
                      if (address) setSelectedAddress(address);
                    }}
                    onDeleteAddress={(id) => {
                      confirmToast({
                        message:
                          "Tem certeza que deseja excluir este endereço?",
                        onConfirm: async () => {
                          await deleteAddress(id);
                          router.refresh();
                          toast.success("Endereço removido com sucesso!");
                        },
                      });
                    }}
                  />

                  <Card className="bg-card border-border">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-medium">
                        Calcular Frete
                      </CardTitle>
                    </CardHeader>
                    <ShippingCalculator
                      cartItems={groupedItems}
                      selectedShipping={shipping}
                      onSelectShipping={setShipping}
                    />
                  </Card>
                </div>

                <MobileOrderSummary
                  subtotal={getSubTotalPrice()}
                  discount={getSubTotalPrice() - getTotalPrice()}
                  total={getTotalPrice()}
                  loading={loading}
                  onCheckout={handleCheckout}
                />
              </div>
            </div>
          ) : (
            <EmptyCart />
          )}
        </Container>
      ) : (
        <NoAccess />
      )}
    </div>
  );
};

export default CartClient;
