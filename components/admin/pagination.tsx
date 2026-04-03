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
    <nav
      className="
        flex items-center justify-center gap-1
        py-4 px-2
        mt-6
        border-t border-border/50
      "
      aria-label="Paginação"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="
          h-9 px-3 gap-1.5
          text-muted-foreground hover:text-foreground
          hover:bg-muted
          disabled:hover:bg-transparent disabled:hover:text-muted-foreground
          transition-all duration-200
          rounded-md
        "
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline text-sm font-medium">Anterior</span>
      </Button>

      <div className="flex items-center gap-1 mx-1">
        {pageNumbers.map((page, index) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-muted-foreground text-sm select-none"
            >
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(page)}
              className={`
                h-9 w-9 p-0 text-sm font-medium
                transition-all duration-200 rounded-md
                ${
                  page === currentPage
                    ? `
                    bg-primary/10 text-primary
                    border border-primary/20
                    hover:bg-primary/20
                    `
                    : `
                    text-muted-foreground hover:text-foreground
                    hover:bg-muted
                    `
                }
              `}
            >
              {page}
            </Button>
          ),
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="
          h-9 px-3 gap-1.5
          text-muted-foreground hover:text-foreground
          hover:bg-muted
          disabled:hover:bg-transparent disabled:hover:text-muted-foreground
          transition-all duration-200
          rounded-md
        "
      >
        <span className="hidden sm:inline text-sm font-medium">Próxima</span>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </nav>
  );
});
