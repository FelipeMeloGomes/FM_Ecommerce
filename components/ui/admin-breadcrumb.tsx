"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  admin: "Admin",
  produtos: "Produtos",
  marcas: "Marcas",
  categorias: "Categorias",
  criar: "Criar",
  editar: "Editar",
  new: "Novo",
};

interface Segment {
  label: string;
  href: string;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getSegmentLabel(slug: string): string {
  if (LABELS[slug]) {
    return LABELS[slug];
  }
  return capitalize(slug.replace(/-/g, " "));
}

function buildSegments(pathname: string): Segment[] {
  if (pathname === "/admin") {
    return [];
  }

  const segments = pathname.split("/").filter(Boolean);
  const result: Segment[] = [];

  let currentPath = "";

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;

    if (/^\d+$/.test(segment)) {
      continue;
    }

    result.push({
      label: getSegmentLabel(segment),
      href: currentPath,
    });
  }

  return result;
}

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const segments = buildSegments(pathname);

  if (segments.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center gap-1.5 text-sm mb-4">
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;

        return (
          <span key={segment.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-muted-foreground mx-0.5" />
            )}
            {isLast ? (
              <span className="text-muted-foreground">{segment.label}</span>
            ) : (
              <Link
                href={segment.href}
                className="text-foreground hover:underline"
              >
                {segment.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
