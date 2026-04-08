"use client";

import { useCallback, useMemo, useState } from "react";

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  total?: number;
}

interface UsePaginationResult {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  getOffset: () => number;
}

export function usePagination({
  initialPage = 1,
  initialPageSize = 10,
  total = 0,
}: UsePaginationOptions = {}): UsePaginationResult {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = useMemo(() => {
    if (pageSize === 0) return 0;
    return Math.ceil(total / pageSize);
  }, [total, pageSize]);

  const hasNextPage = useMemo(() => page < totalPages, [page, totalPages]);
  const hasPreviousPage = useMemo(() => page > 1, [page]);

  const goToPage = useCallback(
    (newPage: number) => {
      const validPage = Math.max(1, Math.min(newPage, totalPages || 1));
      setPage(validPage);
    },
    [totalPages],
  );

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setPage((p) => p + 1);
    }
  }, [hasNextPage]);

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      setPage((p) => p - 1);
    }
  }, [hasPreviousPage]);

  const goToFirstPage = useCallback(() => setPage(1), []);
  const goToLastPage = useCallback(() => setPage(totalPages), [totalPages]);

  const getOffset = useCallback(() => {
    return (page - 1) * pageSize;
  }, [page, pageSize]);

  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    setPage: goToPage,
    setPageSize: (size: number) => {
      setPageSize(size);
      setPage(1);
    },
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    getOffset,
  };
}
