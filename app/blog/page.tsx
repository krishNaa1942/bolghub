"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const { data: posts, isLoading: postsLoading } = trpc.post.getAll.useQuery({
    published: true,
    categoryId: selectedCategory ?? undefined,
  });
  const { data: categories } = trpc.category.getAll.useQuery();

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const postsContent = (() => {
    if (postsLoading) {
      return Array.from({ length: 4 }).map((_, index) => (
        <Card
          key={`skeleton-${index}`}
          className="border-white/10 bg-background/70 backdrop-blur-xl"
        >
          <CardHeader>
            <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
            <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="mt-3 h-4 w-5/6 animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      ));
    }

    if (posts && posts.posts && posts.posts.length > 0) {
      return posts.posts.map((post: typeof posts.posts[0]) => (
        <Card
          key={post.id}
          className="group relative flex h-full flex-col border-white/10 bg-background/70 backdrop-blur-xl transition hover:-translate-y-1 hover:border-primary/40"
        >
          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <CardHeader>
            <div className="flex flex-col gap-3">
              <Badge
                variant="outline"
                className="self-start text-xs uppercase tracking-[0.3em]"
              >
                {formatDate(post.createdAt)}
              </Badge>
              <CardTitle className="text-2xl">
                <Link
                  href={`/blog/${post.slug}`}
                  className="transition hover:text-primary"
                >
                  {post.title}
                </Link>
              </CardTitle>
              <CardDescription>
                {post.published ? "Published" : "Draft"}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {post.content.length > 220
                ? `${post.content.substring(0, 220)}...`
                : post.content}
            </p>
            <div className="mt-6">
              <Button asChild variant="outline">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2"
                >
                  Read story
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ));
    }

    return (
      <Card className="border-white/10 bg-background/70 backdrop-blur-xl">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            {selectedCategory !== null
              ? "No posts found in this category."
              : "No published posts yet."}
          </p>
        </CardContent>
      </Card>
    );
  })();

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        <section className="relative border-b border-white/10 bg-background/80 py-16 backdrop-blur-xl">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4">
                Fresh from the editor
              </Badge>
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                Stories with luminous clarity
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Dive into thoughtfully crafted articles across technology,
                lifestyle, business, and more—all powered by a shimmering
                editorial workflow.
              </p>
            </div>
          </div>
        </section>

        <section className="container px-4 py-14">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                Browse by topic
              </p>
            </div>
            {categories && categories.length > 0 && (
              <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    selectedCategory === null
                      ? "border-primary/40 bg-primary/10 text-foreground"
                      : "border-transparent bg-background/70 text-muted-foreground hover:border-primary/20 hover:text-foreground"
                  }`}
                >
                  All topics
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      selectedCategory === category.id
                        ? "border-primary/40 bg-primary/10 text-foreground"
                        : "border-transparent bg-background/70 text-muted-foreground hover:border-primary/20 hover:text-foreground"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">{postsContent}</div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
