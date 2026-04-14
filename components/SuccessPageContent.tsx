"use client";

import { Check, Home, Package, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useStore from "@/store";

interface SuccessPageContentProps {
  initialOrderNumber?: string | null;
}

const REDIRECT_SECONDS = 5;

const SuccessPageContent = ({
  initialOrderNumber,
}: SuccessPageContentProps) => {
  const { resetCart } = useStore();
  const searchParams = useSearchParams();
  const orderNumber = searchParams?.get("orderNumber") ?? initialOrderNumber;
  const router = useRouter();
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    if (!orderNumber) return;
    resetCart();
  }, [orderNumber, resetCart]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      router.push("/orders");
    }
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-shop_light_pink/30 via-background to-shop_light_pink/20 flex items-center justify-center p-4 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="border-border/60 shadow-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-shop_dark_green p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-shop_dark_green to-shop_btn_dark_green opacity-90" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"
              >
                <Check className="text-shop_dark_green w-12 h-12" />
              </motion.div>
              <h1 className="relative text-3xl lg:text-4xl font-bold text-white mb-2">
                Pedido confirmado!
              </h1>
              <p className="text-white/80 text-lg">Obrigado pela sua compra</p>
            </div>

            <div className="p-6 lg:p-8 space-y-6">
              <div className="flex flex-col items-center gap-2">
                <p className="text-muted-foreground">
                  Redirecionando para seus pedidos em
                </p>
                <span className="text-4xl font-bold text-shop_dark_green">
                  {countdown}s
                </span>
                <div className="w-full bg-muted rounded-full h-2 mt-1 overflow-hidden">
                  <motion.div
                    className="bg-shop_orange h-full rounded-full"
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: REDIRECT_SECONDS, ease: "linear" }}
                  />
                </div>
              </div>

              <div className="bg-muted/30 rounded-xl p-4 space-y-3 border border-border/40">
                <p className="text-muted-foreground text-center">
                  Estamos processando seu pedido e ele será enviado em breve.
                </p>
                <div className="flex items-center justify-center gap-2 pt-2 border-t border-border/30">
                  <span className="text-muted-foreground">
                    Número do Pedido:
                  </span>
                  <span className="font-semibold text-foreground">
                    {orderNumber}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  asChild
                  className="bg-shop_dark_green hover:bg-shop_btn_dark_green"
                >
                  <Link href="/">
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-shop_orange text-shop_orange hover:bg-shop_orange hover:text-white"
                >
                  <Link href="/orders">
                    <Package className="w-4 h-4 mr-2" />
                    Pedidos
                  </Link>
                </Button>
                <Button
                  asChild
                  className="bg-shop_dark_green hover:bg-shop_btn_dark_green"
                >
                  <Link href="/">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Shop
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SuccessPageContent;
