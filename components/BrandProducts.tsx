"use client";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { client } from "@/sanity/lib/client";
import { PRODUCTS_BY_BRAND_QUERY } from "@/sanity/queries/query";
import type { Brand } from "@/sanity.types";
import NoProductAvailable from "./NoProductAvailable";
import type { ProductWithRating } from "./ProductCard";
import ProductCard from "./ProductCard";

interface Props {
  brands: Brand[];
  slug: string;
}

const BrandProducts = ({ brands, slug }: Props) => {
  const [currentSlug, setCurrentSlug] = useState(slug);
  const [products, setProducts] = useState<ProductWithRating[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const fetchProducts = useCallback(async (brandSlug: string) => {
    setLoading(true);
    try {
      const data = await client.fetch<ProductWithRating[]>(
        PRODUCTS_BY_BRAND_QUERY,
        {
          brandSlug,
        },
      );
      setProducts(data ?? []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentSlug) {
      fetchProducts(currentSlug);
    }
  }, [currentSlug, fetchProducts]);

  const handleBrandChange = useCallback(
    (newSlug: string) => {
      if (newSlug === currentSlug) return;
      startTransition(() => {
        setCurrentSlug(newSlug);
        router.push(`/brand/${newSlug}`, { scroll: false });
      });
    },
    [currentSlug, router],
  );

  const handleBrandClick = useCallback(
    (slug: string) => () => handleBrandChange(slug),
    [handleBrandChange],
  );

  const isLoading = loading || isPending;

  return (
    <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
      <div className="w-full lg:w-56 shrink-0">
        <div className="bg-card rounded-xl border border-border/60 overflow-hidden">
          <div className="p-4 border-b border-border/40 bg-muted/20">
            <h3 className="font-semibold text-foreground">Marcas</h3>
          </div>
          <div className="flex flex-col">
            {brands?.map((item) => (
              <button
                type="button"
                onClick={handleBrandClick(item?.slug?.current as string)}
                key={item?._id}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-all duration-200 border-b border-border/20 last:border-b-0 ${
                  item?.slug?.current === currentSlug
                    ? "bg-shop_orange text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item?.title}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 min-h-80 space-y-4 text-center bg-muted/30 rounded-xl w-full border border-dashed border-border">
            <div className="flex items-center gap-2 text-shop_orange">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Carregando produtos...</span>
            </div>
          </div>
        ) : products?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {products?.map((product) => (
              <AnimatePresence key={product._id}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
        ) : (
          <NoProductAvailable
            selectedTab={currentSlug}
            className="mt-0 w-full"
          />
        )}
      </div>
    </div>
  );
};

export default BrandProducts;
