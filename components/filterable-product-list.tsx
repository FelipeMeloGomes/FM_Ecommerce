"use client";

import { Loader2, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { Product } from "@/sanity.types";
import ProductCard from "./ProductCard";
import { EmptyState } from "./ui/empty-state";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterableProductListProps {
  products: Product[];
  loading?: boolean;
  searchPlaceholder?: string;
  filters?: FilterOption[];
  onFilterChange?: (filter: string) => void;
  emptyState?: {
    title?: string;
    description?: string;
    action?: React.ReactNode;
  };
  className?: string;
}

export function FilterableProductList({
  products,
  loading = false,
  searchPlaceholder = "Buscar produtos...",
  filters = [],
  onFilterChange,
  emptyState,
  className,
}: FilterableProductListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = searchQuery
        ? product.name?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchesSearch;
    });
  }, [products, searchQuery]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [],
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleFilterClick = useCallback(
    (filterValue: string) => {
      const newFilter = selectedFilter === filterValue ? null : filterValue;
      setSelectedFilter(newFilter);
      onFilterChange?.(newFilter || "");
    },
    [selectedFilter, onFilterChange],
  );

  const handleFilterSelect = useCallback(
    (filterValue: string) => () => {
      handleFilterClick(filterValue);
    },
    [handleFilterClick],
  );

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-10 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              type="button"
              key={filter.value}
              onClick={handleFilterSelect(filter.value)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                selectedFilter === filter.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground mt-4">Carregando produtos...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <EmptyState
          title={emptyState?.title || "Nenhum produto encontrado"}
          description={
            emptyState?.description || "Tente ajustar sua busca ou filtros."
          }
          action={emptyState?.action}
        />
      )}
    </div>
  );
}
