"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createCheckoutSession,
  type Metadata,
} from "@/actions/createCheckoutSession";
import { deleteAddress } from "@/actions/deleteAddress";
import Container from "@/components/Container";
import CartItemsList from "@/components/cart/CartItemsList";
import EmptyCart from "@/components/EmptyCart";
import NoAccess from "@/components/NoAccess";
import PriceFormatter from "@/components/PriceFormatter";
import { ShippingCalculator } from "@/components/ShippingCalculator";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
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
  const router = useRouter();

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
                    <div className="hidden md:inline-block w-full bg-white p-6 rounded-lg border">
                      <h2 className="text-xl font-semibold mb-4">
                        Resumo do Pedido
                      </h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>SubTotal</span>
                          <PriceFormatter amount={getSubTotalPrice()} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Desconto</span>
                          <PriceFormatter
                            amount={getSubTotalPrice() - getTotalPrice()}
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between font-semibold text-lg">
                          <span>Total</span>
                          <PriceFormatter
                            amount={getTotalPrice()}
                            className="text-lg font-bold text-black"
                          />
                        </div>
                        <Button
                          className="w-full rounded-full font-semibold tracking-wide hoverEffect"
                          size="lg"
                          disabled={loading}
                          onClick={handleCheckout}
                        >
                          {loading
                            ? "Por favor, aguarde..."
                            : "Finalizar Compra"}
                        </Button>
                      </div>
                    </div>
                    {addresses.length > 0 ? (
                      <div className="bg-white rounded-md mt-5">
                        <Card>
                          <CardHeader>
                            <CardTitle>Endereço de Entrega</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <RadioGroup
                              value={selectedAddress?._id ?? ""}
                              onValueChange={(value) => {
                                const address = addresses.find(
                                  (addr) => addr._id === value,
                                );
                                if (address) setSelectedAddress(address);
                              }}
                            >
                              {addresses.map((address) => (
                                <div
                                  key={address._id}
                                  className="flex flex-col items-start justify-between mb-4"
                                >
                                  <div className="flex items-start space-x-2 flex-1">
                                    <RadioGroupItem
                                      value={address._id}
                                      id={`address-${address._id}`}
                                    />

                                    <Label
                                      htmlFor={`address-${address._id}`}
                                      className="grid gap-1.5 cursor-pointer"
                                    >
                                      <span className="font-semibold">
                                        {address.name}{" "}
                                        {address.default && "(Padrão)"}
                                      </span>

                                      <span className="text-sm text-black/60">
                                        {address.address}, {address.city},{" "}
                                        {address.state} {address.zip}
                                      </span>
                                    </Label>
                                  </div>

                                  <div className="flex flex-wrap gap-3  mt-4">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        router.push("/account/addresses")
                                      }
                                      className="px-3 py-1.5 text-sm border rounded-md bg-white hover:bg-gray-100 transition"
                                    >
                                      Novo endereço
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        router.push(
                                          `/account/addresses?edit=${address._id}`,
                                        )
                                      }
                                      className="px-3 py-1.5 text-sm border rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                                    >
                                      Editar endereço
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        confirmToast({
                                          message:
                                            "Tem certeza que deseja excluir este endereço?",
                                          onConfirm: async () => {
                                            await deleteAddress(address._id);

                                            toast.success(
                                              "Endereço removido com sucesso!",
                                            );
                                          },
                                        });
                                      }}
                                      className="px-3 py-1.5 text-sm border border-red-600 text-red-600 rounded-md hover:bg-red-600 hover:text-white transition"
                                    >
                                      Apagar endereço
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </RadioGroup>
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      <div className="bg-white rounded-md mt-5 p-6 border text-center">
                        <p className="text-gray-600 mb-4">
                          Você ainda não possui um endereço cadastrado.
                        </p>

                        <Link href="/account/addresses">
                          <Button className="rounded-full">
                            Cadastrar Endereço
                          </Button>
                        </Link>
                      </div>
                    )}
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
                {/* Order summary for mobile view */}
                <div className="md:hidden fixed bottom-0 left-0 w-full bg-white pt-2">
                  <div className="bg-white p-4 rounded-lg border mx-4">
                    <h2>Resumo do Pedido</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>SubTotal</span>
                        <PriceFormatter amount={getSubTotalPrice()} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Desconto</span>
                        <PriceFormatter
                          amount={getSubTotalPrice() - getTotalPrice()}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between font-semibold text-lg">
                        <span>Total</span>
                        <PriceFormatter
                          amount={getTotalPrice()}
                          className="text-lg font-bold text-black"
                        />
                      </div>
                      <Button
                        className="w-full rounded-full font-semibold tracking-wide hoverEffect"
                        size="lg"
                        disabled={loading}
                        onClick={handleCheckout}
                      >
                        {loading ? "Por favor, aguarde..." : "Finalizar Compra"}
                      </Button>
                    </div>
                  </div>
                </div>
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
