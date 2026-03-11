"use client";

import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
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

export function ProductGrid({ initialProducts }: ProductGridProps) {
  const [selectedTab, setSelectedTab] = useState(productType[0]?.title || "");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedTab === productType[0]?.title) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(PRODUCTS_BY_VARIANT_QUERY, {
          variant: selectedTab.toLowerCase(),
        });
        setProducts(response);
      } catch (error) {
        console.log("Product fetching Error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTab]);

  return (
    <Container className="flex flex-col lg:px-0 my-10">
      <HomeTabBar selectedTab={selectedTab} onTabSelect={setSelectedTab} />
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full mt-10">
          <motion.div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Carregando produto...</span>
          </motion.div>
        </div>
      ) : products?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-10">
          {products?.map((product) => (
            <AnimatePresence key={product._id}>
              <motion.div
                layout
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ProductCard key={product._id} product={product} />
              </motion.div>
            </AnimatePresence>
          ))}
        </div>
      ) : (
        <NoProductAvailable selectedTab={selectedTab} />
      )}
    </Container>
  );
}
