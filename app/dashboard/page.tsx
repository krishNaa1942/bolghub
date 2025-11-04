"use client";

import { trpc } from "@/lib/trpc";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DashboardPage() {
  const [deletePostId, setDeletePostId] = useState<number | null>(null);
  const utils = trpc.useUtils();

  const { data: posts, isLoading } = trpc.post.getAll.useQuery({});
  const deleteMutation = trpc.post.delete.useMutation({
    onSuccess: () => {
      utils.post.getAll.invalidate();
      setDeletePostId(null);
      toast.success("Post deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete post", {
        description: error.message,
      });
    },
  });

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handleDelete = () => {
    if (deletePostId) {
      deleteMutation.mutate({ id: deletePostId });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1 bg-gradient-to-b from-background/60 via-background to-background/80 pb-20 pt-16">
        <div className="container max-w-6xl px-4">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-background/80 p-8 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <Badge
                  variant="secondary"
                  className="uppercase tracking-[0.35em]"
                >
                  Editorial cockpit
                </Badge>
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    Orchestrate every story
                  </h1>
                  <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                    Review drafts, publish instantly, and keep your catalogue
                    glowing with the latest updates.
                  </p>
                </div>
              </div>
              <Button asChild size="lg" className="w-full md:w-auto">
                <Link href="/dashboard/new">Create new post</Link>
              </Button>
            </div>

            <div className="grid gap-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <Card
                    key={`post-skeleton-${index}`}
                    className="border-white/10 bg-background/70 p-6 backdrop-blur-xl"
                  >
                    <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
                    <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-muted" />
                  </Card>
                ))
              ) : posts && posts.posts && posts.posts.length > 0 ? (
                posts.posts.map((post: typeof posts.posts[0]) => (
                  <Card
                    key={post.id}
                    className="group border-white/10 bg-background/80 backdrop-blur-xl transition hover:-translate-y-1 hover:border-primary/40"
                  >
                    <CardHeader>
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <CardTitle className="text-xl">
                              {post.title}
                            </CardTitle>
                            <Badge
                              variant={post.published ? "default" : "secondary"}
                            >
                              {post.published ? "Published" : "Draft"}
                            </Badge>
                          </div>
                          <CardDescription>
                            Created {formatDate(post.createdAt)} • Updated{" "}
                            {formatDate(post.updatedAt)}
                          </CardDescription>
                        </div>
                        <div className="flex flex-shrink-0 items-center gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/blog/${post.slug}`}>View</Link>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/dashboard/edit/${post.id}`}>
                              Edit
                            </Link>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeletePostId(post.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {post.content.substring(0, 200)}...
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-white/10 bg-background/80 backdrop-blur-xl">
                  <CardContent className="py-14 text-center">
                    <h3 className="text-lg font-semibold">No posts yet</h3>
                    <p className="mt-3 text-muted-foreground">
                      Get started by crafting your first dazzling post.
                    </p>
                    <Button asChild className="mt-6">
                      <Link href="/dashboard/new">Create your first post</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Dialog
        open={deletePostId !== null}
        onOpenChange={() => setDeletePostId(null)}
      >
        <DialogContent className="border-white/10 bg-background/90 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletePostId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
