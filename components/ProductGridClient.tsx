"use client";

import { AnimatePresence, motion } from "motion/react";
import { productType } from "@/constants/data";
import type { Product } from "@/sanity.types";
import Container from "./Container";
import HomeTabBar from "./HomeTabBar";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";

interface ProductGridClientProps {
  initialProducts: Product[];
}

export function ProductGridClient({ initialProducts }: ProductGridClientProps) {
  const selectedTab = productType[0]?.title || "";

  return (
    <Container className="flex flex-col lg:px-0 my-10">
      <HomeTabBar selectedTab={selectedTab} onTabSelect={() => {}} />
      {initialProducts?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-10">
          {initialProducts.map((product) => (
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
