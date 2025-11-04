"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-center gap-1">
          {index > 0 && (
            <ChevronRight className="size-4 opacity-50" aria-hidden="true" />
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="transition hover:text-foreground"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
