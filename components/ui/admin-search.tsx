"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminSearchProps<T extends { _id?: string; id?: string | number }> {
  items: T[];
  searchKeys: (keyof T)[];
  onFilter: (filtered: T[]) => void;
  placeholder?: string;
  createLabel?: string;
  createHref?: string;
  debounceMs?: number;
}

function normalize(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getKey<T extends { _id?: string; id?: string | number }>(item: T) {
  return item._id ?? item.id ?? JSON.stringify(item);
}

export function AdminSearch<T extends { _id?: string; id?: string | number }>({
  items,
  searchKeys,
  onFilter,
  placeholder = "Buscar...",
  createLabel,
  createHref,
  debounceMs = 400,
}: AdminSearchProps<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);

  const filtered = useMemo(() => {
    if (!query.trim()) {
      return [...items];
    }

    const normalizedQuery = normalize(query);

    return items.filter((item) =>
      searchKeys.some((key) => {
        const value = item[key];
        if (value === null || value === undefined) return false;
        return normalize(String(value)).includes(normalizedQuery);
      }),
    );
  }, [items, query, searchKeys]);

  const lastFilteredKeysRef = useRef<string>("");
  const onFilterRef = useRef(onFilter);
  useEffect(() => {
    onFilterRef.current = onFilter;
  });

  useEffect(() => {
    const keys = filtered.map(getKey).join(",");
    if (keys !== lastFilteredKeysRef.current) {
      lastFilteredKeysRef.current = keys;
      onFilterRef.current(filtered);
    }
  }, [filtered]);

  const searchParamsRef = useRef(searchParams);
  useEffect(() => {
    searchParamsRef.current = searchParams;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParamsRef.current.toString());
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      router.replace(`${pathname}?${params.toString()}`);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, pathname, router, debounceMs]);

  const handleClear = useCallback(() => {
    setQuery("");
    const params = new URLSearchParams(searchParamsRef.current.toString());
    params.delete("q");
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, router]);

  return (
    <div className="space-y-3 mb-6">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-9 pr-9"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {createLabel && createHref && (
          <Button asChild>
            <Link href={createHref}>+ {createLabel}</Link>
          </Button>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        {filtered.length} de {items.length} resultados
      </p>
    </div>
  );
}
