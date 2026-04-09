"use client";

import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useEffect, useState, useTransition } from "react";
import { productType } from "@/constants/data";
import { client } from "@/sanity/lib/client";
import { PRODUCTS_BY_VARIANT_QUERY } from "@/sanity/queries/query";
import type { Product } from "@/sanity.types";
import Container from "./Container";
import HomeTabBar from "./HomeTabBar";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  initialProducts: Product[];
}

export const ProductGrid = React.memo(
  ({ initialProducts }: ProductGridProps) => {
    const [selectedTab, setSelectedTab] = useState(productType[0]?.title || "");
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [loading, setLoading] = useState(false);
    const [isPending, startTransition] = useTransition();
    const defaultTab = productType[0]?.title || "";

    const fetchProducts = useCallback(async (variant: string) => {
      setLoading(true);
      try {
        const response = await client.fetch(PRODUCTS_BY_VARIANT_QUERY, {
          variant: variant.toLowerCase(),
          limit: 100,
        });
        setProducts(response);
      } catch (error) {
        console.error("Product fetching Error", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      if (selectedTab === defaultTab) return;

      const debounceTimer = setTimeout(() => {
        fetchProducts(selectedTab);
      }, 300);

      return () => clearTimeout(debounceTimer);
    }, [selectedTab, defaultTab, fetchProducts]);

    const handleTabSelect = useCallback((tab: string) => {
      startTransition(() => {
        setSelectedTab(tab);
      });
    }, []);

    const isLoading = loading || isPending;

    return (
      <Container className="flex flex-col lg:px-0 my-8 lg:my-12">
        <HomeTabBar selectedTab={selectedTab} onTabSelect={handleTabSelect} />
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 min-h-[400px] space-y-4 text-center bg-muted/30 rounded-xl w-full mt-8">
            <Loader2 className="w-8 h-8 animate-spin text-shop_orange" />
            <p className="text-muted-foreground">Carregando produtos...</p>
          </div>
        ) : products?.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-8">
            {products?.map((product) => (
              <AnimatePresence key={product._id}>
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard key={product._id} product={product} />
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
        ) : (
          <NoProductAvailable selectedTab={selectedTab} className="mt-8" />
        )}
      </Container>
    );
  },
);

ProductGrid.displayName = "ProductGrid";
