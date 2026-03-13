"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { memo, useMemo } from "react";
import { Button } from "@/components/ui/button";

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const AdminPagination = memo(function AdminPagination({
  currentPage,
  totalPages,
  onPageChange,
}: AdminPaginationProps) {
  const pageNumbers = useMemo(() => {
    if (totalPages <= 1) {
      return [];
    }

    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center justify-center gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="gap-1 px-2.5"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:block">Anterior</span>
      </Button>

      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) =>
          page === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="px-2">
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? "outline" : "ghost"}
              size="sm"
              onClick={() => onPageChange(page)}
              className={`h-8 w-8 p-0 ${page === currentPage ? "border-2 border-primary" : ""}`}
            >
              {page}
            </Button>
          ),
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="gap-1 px-2.5"
      >
        <span className="hidden sm:block">Proxima</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
});
