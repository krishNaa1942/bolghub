"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, PenSquare, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/categories", label: "Categories" },
  ];

  const isActive = (href: string) => {
    if (!pathname) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-40 mx-auto w-full backdrop-blur">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="container relative px-4 pb-4 pt-6">
        <nav 
          className="relative flex items-center justify-between rounded-full border border-white/20 bg-background/80 px-4 py-3 shadow-[0_20px_60px_-35px_rgba(79,70,229,0.7)] backdrop-blur-xl transition-all dark:border-white/10 dark:bg-background/60"
          aria-label="Main navigation"
        >
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="relative flex items-center gap-2 text-lg font-semibold tracking-tight"
              aria-label="BlogHub - Home"
            >
              <span className="relative inline-flex items-center justify-center overflow-hidden rounded-full border border-primary/40 bg-primary/10 px-2 py-1 text-[10px] uppercase tracking-[0.35em] text-primary/90">
                Hub
              </span>
              <span className="bg-gradient-to-br from-foreground via-primary to-foreground/80 bg-clip-text text-transparent">
                BlogHub
              </span>
            </Link>
            <div className="hidden items-center gap-6 md:flex" role="menubar">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  role="menuitem"
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  <span className="relative z-10">{item.label}</span>
                  <span
                    className={cn(
                      "absolute inset-x-0 -bottom-2 h-[2px] rounded-full bg-gradient-to-r from-primary/80 via-primary to-primary/60 transition-opacity duration-300",
                      isActive(item.href)
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    )}
                  />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard/new" className="hidden md:block">
              <Button className="shadow-[0_12px_35px_-18px_rgba(79,70,229,0.8)]">
                <PenSquare className="size-4" />
                New Post
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>
          </div>

          {isMenuOpen && (
            <div className="absolute left-0 right-0 top-full mt-4 rounded-3xl border border-white/15 bg-background/90 p-6 shadow-2xl backdrop-blur-xl md:hidden">
              <div className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between rounded-2xl border border-transparent px-3 py-3 text-sm font-medium transition hover:border-primary/30 hover:bg-primary/5",
                      isActive(item.href) &&
                        "border-primary/40 bg-primary/10 text-foreground"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                    <span className="text-xs text-muted-foreground">
                      {isActive(item.href) ? "Active" : ""}
                    </span>
                  </Link>
                ))}
              </div>
              <div className="mt-5">
                <Button asChild className="w-full">
                  <Link href="/dashboard/new">
                    <PenSquare className="size-4" /> Create post
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
