"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function NewPostPage() {
  const router = useRouter();
  const utils = trpc.useUtils();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const { data: categories } = trpc.category.getAll.useQuery();
  const createMutation = trpc.post.create.useMutation({
    onSuccess: (post) => {
      utils.post.getAll.invalidate();
      toast.success(`Post "${post.title}" created successfully`);
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error("Failed to create post", {
        description: error.message,
      });
    },
  });

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

    toast.loading(publish ? "Publishing post..." : "Saving as draft...");
    createMutation.mutate({
      title,
      content,
      published: publish,
      categoryIds: selectedCategories,
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1 bg-gradient-to-b from-background/60 via-background to-background/80 pb-20 pt-16">
        <div className="container max-w-6xl px-4">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Button asChild variant="ghost" className="w-max">
                <Link href="/dashboard">← Back to dashboard</Link>
              </Button>
              <Badge
                variant="secondary"
                className="w-max uppercase tracking-[0.35em]"
              >
                Story atelier
              </Badge>
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)]">
              <Card className="border-white/10 bg-background/80 backdrop-blur-xl">
                <CardHeader className="space-y-3">
                  <CardTitle className="text-3xl">Craft a new post</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Blend markdown magic with category curation. Everything
                    saves in place; publish when the story feels complete.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="Enter an evocative headline"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Categories</Label>
                    <div className="flex flex-wrap gap-2">
                      {categories?.map((category) => (
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
                    {categories && categories.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        No categories yet.{" "}
                        <Link href="/categories" className="underline">
                          Create one
                        </Link>{" "}
                        to theme your story.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="content">
                        Content * (Markdown supported)
                      </Label>
                      <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                        Live preview on the right
                      </span>
                    </div>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(event) => setContent(event.target.value)}
                      placeholder="Write your post content here..."
                      className="min-h-[420px] resize-none border-white/10 bg-background/70 font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="sm:w-auto"
                      onClick={() => router.push("/dashboard")}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="sm:w-auto"
                      onClick={() => handleSubmit(false)}
                      disabled={createMutation.isPending}
                    >
                      {createMutation.isPending ? "Saving..." : "Save as draft"}
                    </Button>
                    <Button
                      type="button"
                      className="sm:w-auto"
                      onClick={() => handleSubmit(true)}
                      disabled={createMutation.isPending}
                    >
                      {createMutation.isPending ? "Publishing..." : "Publish"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-background/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Real-time preview</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Markdown renders instantly with tables, code, and rich
                    typography.
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
                        Start typing to see your story shimmer here.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
