"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default function PostPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const {
    data: post,
    isLoading,
    error,
  } = trpc.post.getBySlug.useQuery({ slug }, { enabled: !!slug });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <main className="flex flex-1 items-start justify-center bg-gradient-to-b from-background/60 via-background to-background/80 py-16">
          <Card className="w-full max-w-3xl border-white/10 bg-background/80 p-10 backdrop-blur-xl">
            <div className="h-10 w-3/4 animate-pulse rounded bg-muted" />
            <div className="mt-4 h-5 w-1/3 animate-pulse rounded bg-muted" />
            <div className="mt-8 space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <main className="flex flex-1 items-center justify-center bg-background/80 py-16">
          <Card className="max-w-xl border-white/10 bg-background/80 p-10 text-center backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-3xl">Post not found</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground">
              <p>
                The story you&apos;re searching for has either moved or never
                existed.
              </p>
              <Button asChild>
                <Link href="/blog">Return to the blog</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1 bg-gradient-to-b from-background/60 via-background to-background/80 pb-20 pt-16">
        <div className="container px-4">
          <div className="mx-auto flex max-w-3xl flex-col gap-12">
            <div className="flex flex-col gap-6 text-balance">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Blog", href: "/blog" },
                  { label: post.title },
                ]}
              />
              <Button asChild variant="ghost" className="w-max">
                <Link href="/blog">← Back to all posts</Link>
              </Button>
              <div>
                <Badge variant="secondary" className="mb-4">
                  {post.published ? "Published" : "Draft"}
                </Badge>
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  {post.title}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span>Published {formatDate(post.createdAt)}</span>
                  {post.createdAt !== post.updatedAt && (
                    <span>Updated {formatDate(post.updatedAt)}</span>
                  )}
                </div>
                {post.postCategories && post.postCategories.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.postCategories.map((pc) => (
                      <Badge key={pc.category.id} variant="outline">
                        {pc.category.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Card className="border-white/10 bg-background/80 p-10 backdrop-blur-xl">
              <div className="prose prose-lg max-w-none text-foreground dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.content}
                </ReactMarkdown>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
