import { Search, X } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminSearchProps {
  query: string;
  onQueryChange: (value: string) => void;
  placeholder?: string;
  createLabel?: string;
  createHref?: string;
}

export function AdminSearch({
  query,
  onQueryChange,
  placeholder = "Buscar...",
  createLabel,
  createHref,
}: AdminSearchProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onQueryChange(e.target.value);
    },
    [onQueryChange],
  );

  const handleClear = useCallback(() => {
    onQueryChange("");
  }, [onQueryChange]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search className="w-4 h-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder={placeholder}
            className="
              h-11 pl-10 pr-10 
              bg-background 
              border-input 
              text-foreground
              placeholder:text-muted-foreground
              rounded-lg
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring
              hover:border-border
            "
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="
                absolute right-3 top-1/2 -translate-y-1/2 
                text-muted-foreground hover:text-foreground
                transition-colors duration-150
                p-0.5 rounded-md hover:bg-muted
              "
              aria-label="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {createLabel && createHref && (
          <Button
            asChild
            className="
              h-11 px-5
              bg-primary text-primary-foreground
              hover:bg-primary/90
              rounded-lg
              font-medium
              transition-all duration-200
              shadow-sm hover:shadow
            "
          >
            <Link href={createHref}>
              <span className="text-lg mr-1">+</span> {createLabel}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
