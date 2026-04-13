"use client";

import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  memo,
  useCallback,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

import { client } from "@/sanity/lib/client";
import { SHOP_PRODUCTS_QUERY } from "@/sanity/queries/query";
import type { BRANDS_QUERYResult, Category, Product } from "@/sanity.types";

import Container from "./Container";
import { FilterRadioGroup } from "./FilterRadioGroup";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";
import Title from "./Title";

const PAGE_SIZE = 24;

const priceArray = [
  { value: "0-100", label: "Até R$ 100" },
  { value: "100-200", label: "R$ 100 - R$ 200" },
  { value: "200-300", label: "R$ 200 - R$ 300" },
  { value: "300-500", label: "R$ 300 - R$ 500" },
  { value: "500-10000", label: "Acima de R$ 500" },
];

interface Props {
  categories: Category[];
  brands: BRANDS_QUERYResult;
  initialBrand?: string | null;
  initialCategory?: string | null;
}

interface ProductWithReviews extends Product {
  rating: number;
  reviewCount: number;
}

const Shop = memo(
  ({ categories, brands, initialBrand, initialCategory }: Props) => {
    const searchParams = useSearchParams();
    const brandParams = searchParams?.get("brand") ?? initialBrand;
    const categoryParams = searchParams?.get("category") ?? initialCategory;
    const [isPending, startTransition] = useTransition();
    const [products, setProducts] = useState<ProductWithReviews[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
      categoryParams || null,
    );
    const [selectedBrand, setSelectedBrand] = useState<string | null>(
      brandParams || null,
    );
    const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
    const [start, setStart] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const loadingRef = useRef(false);
    const hasMoreRef = useRef(true);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const deferredCategory = useDeferredValue(selectedCategory);
    const deferredBrand = useDeferredValue(selectedBrand);
    const deferredPrice = useDeferredValue(selectedPrice);

    const fetchProducts = useCallback(
      async (
        category: string | null,
        brand: string | null,
        price: string | null,
        startIndex: number = 0,
        isLoadMore: boolean = false,
      ) => {
        if (isLoadMore) {
          setLoading(true);
        } else {
          setLoading(true);
        }
        try {
          let minPrice = 0;
          let maxPrice = 10000;
          if (price) {
            const [min, max] = price.split("-").map(Number);
            minPrice = min;
            maxPrice = max;
          }

          const data = await client.fetch(
            SHOP_PRODUCTS_QUERY,
            {
              selectedCategory: category,
              selectedBrand: brand,
              minPrice,
              maxPrice,
              start: startIndex,
              limit: PAGE_SIZE,
            },
            { next: { revalidate: 60 } },
          );

          const productsWithRating = (data || []).map(
            (p: ProductWithReviews) => ({
              ...p,
              rating: p.rating ?? 0,
              reviewCount: p.reviewCount ?? 0,
            }),
          );

          if (isLoadMore) {
            setProducts((prev) => [...prev, ...productsWithRating]);
            setLoadingMore(false);
            hasMoreRef.current = productsWithRating.length === PAGE_SIZE;
            setHasMore(hasMoreRef.current);
          } else {
            setProducts(productsWithRating);
            setLoading(false);
            hasMoreRef.current = productsWithRating.length === PAGE_SIZE;
            setHasMore(hasMoreRef.current);
          }
        } catch (error) {
          console.error("Shop product fetching Error", error);
          if (isLoadMore) {
            setLoadingMore(false);
            hasMoreRef.current = true;
          } else {
            setLoading(false);
          }
        }
      },
      [],
    );

    useEffect(() => {
      setStart(0);
      setHasMore(true);
      const timer = setTimeout(() => {
        fetchProducts(deferredCategory, deferredBrand, deferredPrice, 0, false);
      }, 300);

      return () => clearTimeout(timer);
    }, [deferredCategory, deferredBrand, deferredPrice, fetchProducts]);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (
            entries[0].isIntersecting &&
            hasMoreRef.current &&
            !loadingRef.current
          ) {
            const newStart = start + PAGE_SIZE;
            setStart(newStart);
            hasMoreRef.current = false;
            setLoadingMore(true);
            fetchProducts(
              deferredCategory,
              deferredBrand,
              deferredPrice,
              newStart,
              true,
            );
          }
        },
        { threshold: 0.1 },
      );

      if (loadMoreRef.current) {
        observer.observe(loadMoreRef.current);
      }

      return () => observer.disconnect();
    }, [start, deferredCategory, deferredBrand, deferredPrice, fetchProducts]);

    const handleClearFilters = useCallback(() => {
      startTransition(() => {
        setSelectedCategory(null);
        setSelectedBrand(null);
        setSelectedPrice(null);
      });
    }, []);

    const handleCategoryChange = useCallback((value: string) => {
      startTransition(() => {
        setSelectedCategory(value);
      });
    }, []);

    const handleBrandChange = useCallback((value: string) => {
      startTransition(() => {
        setSelectedBrand(value);
      });
    }, []);

    const handlePriceChange = useCallback((value: string) => {
      startTransition(() => {
        setSelectedPrice(value);
      });
    }, []);

    const hasFilters =
      selectedCategory !== null ||
      selectedBrand !== null ||
      selectedPrice !== null;

    const isLoading = loading || loadingMore || isPending;

    const categoryItems = categories.map((cat) => ({
      value: cat.slug?.current as string,
      label: cat.title as string,
    }));

    const brandItems = brands.map((brand) => ({
      value: brand.slug?.current as string,
      label: brand.title as string,
    }));

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
                <FilterRadioGroup
                  title="Categorias"
                  items={categoryItems}
                  selected={selectedCategory}
                  onChange={handleCategoryChange}
                  onClear={() => setSelectedCategory(null)}
                />
                <div className="my-4 border-t border-border" />
                <FilterRadioGroup
                  title="Marcas"
                  items={brandItems}
                  selected={selectedBrand}
                  onChange={handleBrandChange}
                  onClear={() => setSelectedBrand(null)}
                />
                <div className="my-4 border-t border-border" />
                <FilterRadioGroup
                  title="Preço"
                  items={priceArray}
                  selected={selectedPrice}
                  onChange={handlePriceChange}
                  onClear={() => setSelectedPrice(null)}
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
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                      {products?.map((product) => (
                        <ProductCard
                          key={product?._id}
                          product={product}
                          rating={product.rating}
                          reviewCount={product.reviewCount}
                        />
                      ))}
                    </div>
                    {hasMore && (
                      <div
                        ref={loadMoreRef}
                        className="flex justify-center py-8"
                      >
                        {loadingMore && (
                          <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <NoProductAvailable className="bg-card mt-0 rounded-xl border border-border" />
                )}
              </div>
            </main>
          </div>
        </Container>
      </div>
    );
  },
);

Shop.displayName = "Shop";

export default Shop;
