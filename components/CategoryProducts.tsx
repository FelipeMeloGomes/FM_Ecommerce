"use client";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { PRODUCTS_BY_CATEGORY_QUERY } from "@/sanity/queries/query";
import type { Category, Product } from "@/sanity.types";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";

interface Props {
  categories: Category[];
  slug: string;
}

const CategoryProducts = ({ categories, slug }: Props) => {
  const [currentSlug, setCurrentSlug] = useState(slug);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleCategoryChange = (newSlug: string) => {
    if (newSlug === currentSlug) return;
    setCurrentSlug(newSlug);
    router.push(`/category/${newSlug}`, { scroll: false });
  };

  const fetchProducts = useCallback(async (categorySlug: string) => {
    setLoading(true);
    try {
      const data = await client.fetch(PRODUCTS_BY_CATEGORY_QUERY, {
        categorySlug,
      });
      setProducts(data);
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

  return (
    <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
      <div className="w-full lg:w-56 shrink-0">
        <div className="bg-card rounded-xl border border-border/60 overflow-hidden">
          <div className="p-4 border-b border-border/40 bg-muted/20">
            <h3 className="font-semibold text-foreground">Categorias</h3>
          </div>
          <div className="flex flex-col">
            {categories?.map((item) => (
              <button
                type="button"
                onClick={() =>
                  handleCategoryChange(item?.slug?.current as string)
                }
                key={item?._id}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-all duration-200 border-b border-border/20 last:border-b-0 capitalize ${
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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 min-h-80 space-y-4 text-center bg-muted/30 rounded-xl w-full border border-dashed border-border">
            <div className="flex items-center gap-2 text-shop_orange">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Carregando produtos...</span>
            </div>
          </div>
        ) : products?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {products?.map((product: Product) => (
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

export default CategoryProducts;
