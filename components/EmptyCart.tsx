"use client";
import { ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { emptyCart } from "@/images";

export default function EmptyCart() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card border border-border rounded-2xl shadow-xl p-8 max-w-md w-full space-y-6 text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 3, -3, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut",
          }}
          className="relative w-40 h-40 mx-auto"
        >
          <Image
            src={emptyCart}
            alt="Empty shopping cart"
            fill
            className="object-contain drop-shadow-lg"
          />
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Seu carrinho está vazio
          </h2>
          <p className="text-muted-foreground">
            Que tal escolher alguns produtos agora?
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex w-full justify-center bg-shop_dark_green hover:bg-shop_btn_dark_green text-white py-3 rounded-lg text-sm font-semibold transition-colors"
        >
          Explorar produtos
        </Link>
      </motion.div>
    </div>
  );
}
