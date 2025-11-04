import Link from "next/link";
import { Layers, PenTool, Sparkles, Users } from "lucide-react";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SpectacularHero } from "@/components/hero/spectacular-hero";

const features = [
  {
    title: "Cinematic reading flow",
    description:
      "Progressive disclosure, smooth typography, and responsive layouts keep every story immersive on any device.",
    Icon: Sparkles,
  },
  {
    title: "Collaborative by design",
    description:
      "Coordinate multi-author workflows with instant publishing controls, category assignments, and real-time feedback.",
    Icon: Users,
  },
  {
    title: "Markdown, elevated",
    description:
      "Compose in rich markdown with live previews, syntax highlighting, and perfect slugs generated automatically.",
    Icon: PenTool,
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        <SpectacularHero />

        <section className="py-20">
          <div className="container px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Design-led features that feel like illusions
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Elevate every interaction with glassmorphism, gentle gradients,
                and frictionless editorial flows.
              </p>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {features.map(({ Icon, title, description }) => (
                <Card
                  key={title}
                  className="group relative overflow-hidden border-white/10 bg-background/80 backdrop-blur-xl transition hover:-translate-y-1"
                >
                  <span className="absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <CardContent className="relative flex h-full flex-col gap-5 p-8">
                    <div className="flex items-center gap-3">
                      <span className="flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <Icon className="size-5" />
                      </span>
                      <h3 className="text-xl font-semibold">{title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
          <div className="container px-4">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <Card className="relative overflow-hidden border-white/15 bg-background/80 p-8 backdrop-blur-xl">
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.4),transparent_55%)]" />
                <div className="relative space-y-6">
                  <Badge
                    variant="secondary"
                    className="text-xs uppercase tracking-[0.3em]"
                  >
                    Editorial intelligence
                  </Badge>
                  <h3 className="text-3xl font-semibold tracking-tight">
                    Live previews and instant publishing controls
                  </h3>
                  <p className="text-muted-foreground">
                    Toggle between markdown and rendered prose in one click.
                    Assign categories, manage drafts, and publish updates with
                    confidence.
                  </p>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Layers className="mt-1 size-4 text-primary" />
                      Layered dashboards with real-time data fetching via tRPC +
                      React Query.
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="mt-1 size-4 text-primary" />
                      Glassmorphism cards that glow on hover, guiding attention
                      across the workspace.
                    </li>
                    <li className="flex items-start gap-2">
                      <PenTool className="mt-1 size-4 text-primary" />
                      Markdown-first editing with syntax-aware previews powered
                      by remark plugins.
                    </li>
                  </ul>
                </div>
              </Card>
              <Card className="relative overflow-hidden border-white/10 bg-background/80 p-0 shadow-[0_30px_80px_-60px_rgba(79,70,229,1)]">
                <div className="absolute inset-0 bg-[conic-gradient(from_0deg,rgba(79,70,229,0.35),transparent_45%)] opacity-70" />
                <CardContent className="relative flex h-full flex-col justify-between gap-6 p-8">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Dashboard snapshot</span>
                    <span>Curated for teams</span>
                  </div>
                  <div className="space-y-4 rounded-2xl border border-white/10 bg-background/70 p-6 backdrop-blur-xl">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Drafts ready
                      </span>
                      <span className="font-semibold">04</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Published stories
                      </span>
                      <span className="font-semibold">18</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Categories curated
                      </span>
                      <span className="font-semibold">9</span>
                    </div>
                  </div>
                  <Button asChild size="lg">
                    <Link href="/dashboard">Open the dashboard</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="container px-4">
            <Card className="relative overflow-hidden border-white/10 bg-background/80 p-10 text-center backdrop-blur-xl">
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(59,130,246,0.35),transparent_60%)]" />
              <div className="relative mx-auto max-w-3xl space-y-6">
                <h3 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  Ready to design a luminous publishing experience?
                </h3>
                <p className="text-lg text-muted-foreground">
                  Bring your contributors together, craft mesmerizing layouts,
                  and ship to production with a cohesive stack built on Next.js
                  16, tRPC, and Drizzle ORM.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Button asChild size="lg">
                    <Link href="/dashboard/new">Create your first post</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-primary/40"
                  >
                    <Link href="/categories">Organize categories</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
