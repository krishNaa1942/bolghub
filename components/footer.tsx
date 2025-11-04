import Link from "next/link";

const quickLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/categories", label: "Categories" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/new", label: "Create" },
];

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/15 bg-background/80 pb-10 pt-12 backdrop-blur-2xl dark:border-white/10">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent opacity-70" />
      <div className="container relative flex flex-col gap-10 px-4">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.3em] text-primary/70">
              BLOGHUB
            </p>
            <p className="max-w-xl text-balance text-lg text-muted-foreground">
              A creative space for multi-author storytelling. Publish faster,
              collaborate better, and deliver immersive reading experiences.
            </p>
          </div>
          <div className="grid w-full gap-3 text-sm text-muted-foreground sm:grid-cols-2 md:w-auto md:text-right">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground md:flex-row">
          <p>
            © {new Date().getFullYear()} BlogHub. Crafted with Next.js, tRPC,
            and Drizzle ORM.
          </p>
          <p className="uppercase tracking-[0.4em]">
            Built for creators worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
