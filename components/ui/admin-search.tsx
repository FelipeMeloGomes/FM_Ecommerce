import { Search, X } from "lucide-react";
import Link from "next/link";
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
  return (
    <div className="space-y-3 mb-6">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={placeholder}
            className="pl-9 pr-9"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
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
    </div>
  );
}
