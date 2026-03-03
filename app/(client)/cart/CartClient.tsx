"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createCheckoutSession,
  type Metadata,
} from "@/actions/createCheckoutSession";
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

  useEffect(() => {
    if (addresses.length > 0) {
      setSelectedAddress(addresses.find((a) => a.default) ?? addresses[0]);
    }
  }, [addresses]);

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
    if (!selectedAddress) {
      toast.error("Selecione um endereço de entrega");
      return;
    }

    if (!shipping) {
      toast.error("Selecione uma opção de frete");
      return;
    }
    setLoading(true);
    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? "Unknown",
        customerEmail: user?.emailAddresses[0]?.emailAddress ?? "Unknown",
        clerkUserId: user?.id,
        address: selectedAddress,
      };
      const checkoutUrl = await createCheckoutSession(groupedItems, metadata, {
        service: shipping.service,
        price: shipping.price,
      });
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 pb-52 md:pb-10">
      {isSignedIn ? (
        <Container>
          {groupedItems?.length ? (
            <>
              <div className="flex items-center gap-2 py-5">
                <ShoppingBag className="text-darkColor" />
                <Title>Carrinho de compras</Title>
              </div>
              <div className="grid lg:grid-cols-3 md:gap-8">
                <div className="lg:col-span-2 rounded-lg">
                  <div className="border bg-white rounded-md">
                    <CartItemsList items={groupedItems} />
                    <Button
                      onClick={handleResetCart}
                      className="m-5 font-semibold"
                      variant="destructive"
                    >
                      Limpar Carrinho
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="lg:col-span-1">
                    <div className="hidden md:inline-block">
                      <OrderSummary
                        subtotal={getSubTotalPrice()}
                        discount={getSubTotalPrice() - getTotalPrice()}
                        total={getTotalPrice()}
                        loading={loading}
                        onCheckout={handleCheckout}
                      />
                    </div>
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
                            toast.success("Endereço removido com sucesso!");
                          },
                        });
                      }}
                    />
                    <div className="bg-white rounded-md mt-5">
                      <Card>
                        <CardHeader>
                          <CardTitle>Calcular Frete</CardTitle>
                        </CardHeader>
                        <ShippingCalculator
                          cartItems={groupedItems}
                          selectedShipping={shipping}
                          onSelectShipping={setShipping}
                        />
                      </Card>
                    </div>
                  </div>
                </div>
                <MobileOrderSummary
                  subtotal={getSubTotalPrice()}
                  discount={getSubTotalPrice() - getTotalPrice()}
                  total={getTotalPrice()}
                  loading={loading}
                  onCheckout={handleCheckout}
                />
              </div>
            </>
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
