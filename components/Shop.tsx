"use client";

import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { client } from "@/sanity/lib/client";
import { SHOP_PRODUCTS_QUERY } from "@/sanity/queries/query";
import type { BRANDS_QUERYResult, Category, Product } from "@/sanity.types";
import Container from "./Container";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";
import BrandList from "./shop/BrandList";
import CategoryList from "./shop/CategoryList";
import PriceList from "./shop/PriceList";
import Title from "./Title";

interface Props {
  categories: Category[];
  brands: BRANDS_QUERYResult;
  initialBrand?: string | null;
  initialCategory?: string | null;
}

const Shop = ({ categories, brands, initialBrand, initialCategory }: Props) => {
  const searchParams = useSearchParams();
  const brandParams = searchParams?.get("brand") ?? initialBrand;
  const categoryParams = searchParams?.get("category") ?? initialCategory;
  const [isPending, startTransition] = useTransition();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParams || null,
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    brandParams || null,
  );
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let minPrice = 0;
      let maxPrice = 10000;
      if (selectedPrice) {
        const [min, max] = selectedPrice.split("-").map(Number);
        minPrice = min;
        maxPrice = max;
      }

      const data = await client.fetch(
        SHOP_PRODUCTS_QUERY,
        { selectedCategory, selectedBrand, minPrice, maxPrice },
        { next: { revalidate: 0 } },
      );
      setProducts(data);
    } catch (error) {
      console.error("Shop product fetching Error", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedBrand, selectedPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleClearFilters = useCallback(() => {
    startTransition(() => {
      setSelectedCategory(null);
      setSelectedBrand(null);
      setSelectedPrice(null);
    });
  }, []);

  const handleCategoryChange = useCallback((category: string | null) => {
    startTransition(() => {
      setSelectedCategory(category);
    });
  }, []);

  const handleBrandChange = useCallback((brand: string | null) => {
    startTransition(() => {
      setSelectedBrand(brand);
    });
  }, []);

  const handlePriceChange = useCallback((price: string | null) => {
    startTransition(() => {
      setSelectedPrice(price);
    });
  }, []);

  const hasFilters =
    selectedCategory !== null ||
    selectedBrand !== null ||
    selectedPrice !== null;

  const isLoading = loading || isPending;

  return (
    <div className="border-t border-border">
      <Container className="mt-6">
        <div className="sticky top-0 z-10 mb-6 bg-background pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-border">
            <Title className="text-xl font-semibold tracking-tight">
              Escolha seus produtos
            </Title>
            {hasFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-sm text-muted-foreground hover:text-foreground underline transition-colors"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:sticky lg:top-24 lg:self-start lg:h-[calc(100vh-180px)] lg:overflow-y-auto lg:min-w-72 pb-6 lg:pr-4">
            <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
              <CategoryList
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={handleCategoryChange}
              />
              <div className="my-4 border-t border-border" />
              <BrandList
                brands={brands}
                setSelectedBrand={handleBrandChange}
                selectedBrand={selectedBrand}
              />
              <div className="my-4 border-t border-border" />
              <PriceList
                setSelectedPrice={handlePriceChange}
                selectedPrice={selectedPrice}
              />
            </div>
          </aside>

          <main className="flex-1 min-h-0">
            <div className="h-full overflow-y-auto pr-2 scrollbar-hide">
              {isLoading ? (
                <div className="flex flex-col gap-3 items-center justify-center py-20 bg-card rounded-xl border border-border">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="font-medium text-muted-foreground">
                    Carregando produtos...
                  </p>
                </div>
              ) : products?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products?.map((product) => (
                    <ProductCard key={product?._id} product={product} />
                  ))}
                </div>
              ) : (
                <NoProductAvailable className="bg-card mt-0 rounded-xl border border-border" />
              )}
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
};

export default Shop;
