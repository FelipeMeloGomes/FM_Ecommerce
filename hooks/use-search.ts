"use client";

import { useCallback, useEffect, useState } from "react";

interface UseSearchOptions<T> {
  initialValue?: string;
  debounceMs?: number;
  onSearch?: (value: string) => Promise<T[]>;
}

interface UseSearchResult<T> {
  query: string;
  setQuery: (value: string) => void;
  results: T[];
  isSearching: boolean;
  error: Error | null;
}

export function useSearch<T>({
  initialValue = "",
  debounceMs = 300,
  onSearch,
}: UseSearchOptions<T> = {}): UseSearchResult<T> {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<T[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!onSearch || !query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setError(null);
      try {
        const data = await onSearch(query);
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Search failed"));
      } finally {
        setIsSearching(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, onSearch]);

  const _clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching,
    error,
  };
}
