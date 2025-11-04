"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { toast } from "sonner";
import type { inferRouterOutputs } from "@trpc/server";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { AppRouter } from "@/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type PostDetail = NonNullable<RouterOutputs["post"]["getById"]>;
type CategoryList = RouterOutputs["category"]["getAll"];

type SubmitPayload = {
  title: string;
  content: string;
  categoryIds: number[];
};

type EditContentProps = {
  post: PostDetail;
  categories: CategoryList;
  onCancel: () => void;
  onSubmit: (payload: SubmitPayload, publish: boolean) => void;
  isUpdating: boolean;
};

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = useMemo(() => {
    const raw = params?.id;
    if (!raw) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  }, [params]);

  const utils = trpc.useUtils();
  const { data: categories = [] } = trpc.category.getAll.useQuery();
  const { data: existingPost, isLoading } = trpc.post.getById.useQuery(
    { id: postId ?? 0 },
    { enabled: postId !== null }
  );

  const updateMutation = trpc.post.update.useMutation({
    onSuccess: (post) => {
      utils.post.getAll.invalidate();
      toast.success(`Post "${post.title}" updated successfully`);
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error("Failed to update post", {
        description: error.message,
      });
    },
  });

  if (isLoading || !existingPost) {
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

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1 bg-gradient-to-b from-background/60 via-background to-background/80 pb-20 pt-16">
        <div className="container max-w-6xl px-4">
          <EditContent
            key={`${existingPost.id}-${existingPost.updatedAt.toString()}`}
            post={existingPost}
            categories={categories}
            isUpdating={updateMutation.isPending}
            onCancel={() => router.push("/dashboard")}
            onSubmit={(payload, publish) =>
              updateMutation.mutate({
                id: existingPost.id,
                title: payload.title,
                content: payload.content,
                published: publish,
                categoryIds: payload.categoryIds,
              })
            }
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function EditContent({
  post,
  categories,
  onCancel,
  onSubmit,
  isUpdating,
}: EditContentProps) {
  const [title, setTitle] = useState(() => post.title);
  const [content, setContent] = useState(() => post.content);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(() =>
    post.postCategories.map((pc) => pc.category.id)
  );

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = (publish: boolean) => {
    if (!title.trim() || !content.trim()) {
      toast.error("Validation failed", {
        description: "Please fill in title and content",
      });
      return;
    }

    toast.loading(publish ? "Publishing changes..." : "Saving as draft...");
    onSubmit(
      {
        title,
        content,
        categoryIds: selectedCategories,
      },
      publish
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Dashboard", href: "/dashboard" },
          { label: `Edit: ${post.title}` },
        ]}
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild variant="ghost" className="w-max">
          <Link href="/dashboard">← Back to dashboard</Link>
        </Button>
        <Badge
          variant="secondary"
          className="w-max uppercase tracking-[0.35em]"
        >
          Editing
        </Badge>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)]">
        <Card className="border-white/10 bg-background/80 backdrop-blur-xl">
          <CardHeader className="space-y-3">
            <CardTitle className="text-3xl">Refine your post</CardTitle>
            <p className="text-sm text-muted-foreground">
              Update copy, switch categories, and preview the glow in real time
              before publishing.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Adjust your headline"
              />
            </div>

            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant={
                      selectedCategories.includes(category.id)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer transition hover:scale-[1.02]"
                    onClick={() => toggleCategory(category.id)}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
              {categories.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No categories yet.{" "}
                  <Link href="/categories" className="underline">
                    Create one
                  </Link>{" "}
                  to tag this story.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">Content * (Markdown supported)</Label>
                <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Live preview on the right
                </span>
              </div>
              <Textarea
                id="content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Refresh your post content..."
                className="min-h-[420px] resize-none border-white/10 bg-background/70 font-mono"
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="sm:w-auto"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                className="sm:w-auto"
                onClick={() => handleSubmit(false)}
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save as draft"}
              </Button>
              <Button
                type="button"
                className="sm:w-auto"
                onClick={() => handleSubmit(true)}
                disabled={isUpdating}
              >
                {isUpdating
                  ? "Updating..."
                  : post.published
                  ? "Update"
                  : "Publish"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-background/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Live preview</CardTitle>
            <p className="text-sm text-muted-foreground">
              See exactly what readers will experience, including markdown
              styling.
            </p>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none text-foreground dark:prose-invert">
              {content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              ) : (
                <p className="text-muted-foreground">
                  Start editing to watch the magic unfold.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
