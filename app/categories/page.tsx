"use client";

import { useMemo, useState } from "react";
import {
  Layers,
  PenSquare,
  Sparkles,
  TimerReset,
  ArrowUpRight,
  Tag,
} from "lucide-react";
import { toast } from "sonner";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CategoriesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<{
    id: number;
    name: string;
    description: string | null;
  } | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [query, setQuery] = useState("");
  const [nowMs] = useState(() => Date.now());

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const utils = trpc.useUtils();
  const { data: categories, isLoading } = trpc.category.getAll.useQuery();

  const sortedCategories = useMemo(() => {
    if (!categories) return [];
    return [...categories].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [categories]);

  const filteredCategories = useMemo(() => {
    if (!query.trim()) return sortedCategories;
    const term = query.toLowerCase();
    return sortedCategories.filter((category) =>
      `${category.name} ${category.description ?? ""}`
        .toLowerCase()
        .includes(term)
    );
  }, [query, sortedCategories]);

  const activeCategory = useMemo(() => {
    if (!filteredCategories.length) return null;
    if (!selectedCategoryId) return filteredCategories[0];
    return (
      filteredCategories.find(
        (category) => category.id === selectedCategoryId
      ) ?? filteredCategories[0]
    );
  }, [filteredCategories, selectedCategoryId]);

  const analytics = useMemo(() => {
    const total = sortedCategories.length;
    const withoutDescription = sortedCategories.filter(
      (category) => !category.description?.trim()
    ).length;
    const freshWindowMs = 1000 * 60 * 60 * 24 * 7;
    const refreshed = sortedCategories.filter(
      (category) =>
        nowMs - new Date(category.updatedAt).getTime() <= freshWindowMs
    ).length;
    const coverage =
      total === 0
        ? 0
        : Math.round(((total - withoutDescription) / total) * 100);

    return {
      total,
      refreshed,
      withoutDescription,
      coverage,
    };
  }, [sortedCategories, nowMs]);

  const timelineEvents = useMemo(() => {
    return sortedCategories.slice(0, 6).map((category) => {
      const lastUpdate = new Date(category.updatedAt);
      const needsCopy = !category.description?.trim();
      const tone = needsCopy ? "Needs polish" : "Refined";

      return {
        id: category.id,
        name: category.name,
        tone,
        description: category.description || "No description yet",
        meta: formatRelativeTime(lastUpdate, nowMs),
      };
    });
  }, [nowMs, sortedCategories]);

  const createMutation = trpc.category.create.useMutation({
    onSuccess: (category) => {
      utils.category.getAll.invalidate();
      setIsCreateOpen(false);
      setNewName("");
      setNewDescription("");
      toast.success(`Category "${category.name}" created`);
    },
    onError: (error) => {
      toast.error("Failed to create category", {
        description: error.message,
      });
    },
  });

  const updateMutation = trpc.category.update.useMutation({
    onSuccess: (category) => {
      utils.category.getAll.invalidate();
      setIsEditOpen(false);
      setEditingCategory(null);
      toast.success(`Category "${category.name}" updated`);
    },
    onError: (error) => {
      toast.error("Failed to update category", {
        description: error.message,
      });
    },
  });

  const deleteMutation = trpc.category.delete.useMutation({
    onSuccess: () => {
      utils.category.getAll.invalidate();
      setDeleteId(null);
      toast.success("Category deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete category", {
        description: error.message,
      });
    },
  });

  const handleCreate = () => {
    if (!newName.trim()) return;
    createMutation.mutate({
      name: newName,
      description: newDescription || undefined,
    });
  };

  const handleEdit = () => {
    if (!editingCategory || !editingCategory.name.trim()) return;
    updateMutation.mutate({
      id: editingCategory.id,
      name: editingCategory.name,
      description: editingCategory.description || undefined,
    });
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate({ id: deleteId });
    }
  };

  const openEditDialog = (category: {
    id: number;
    name: string;
    description: string | null;
  }) => {
    setEditingCategory(category);
    setIsEditOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1 bg-gradient-to-b from-background/60 via-background to-background/80 pb-20 pt-16">
        <div className="container max-w-6xl px-4">
          <div className="flex flex-col gap-10">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-background/80 p-8 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_55%)]" />
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-3">
                  <Badge
                    variant="secondary"
                    className="w-max uppercase tracking-[0.35em]"
                  >
                    Taxonomy studio
                  </Badge>
                  <div className="space-y-3">
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                      Architect category systems with finesse
                    </h1>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                      Evolve your information architecture with precision
                      tooling, rich analytics, and a glassy workspace built for
                      editorial veterans.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    className="group w-full sm:w-auto"
                    onClick={() => setIsCreateOpen(true)}
                  >
                    <Sparkles className="mr-2 h-4 w-4 transition group-hover:rotate-12" />
                    Create category
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-white/20 bg-white/5 text-sm sm:w-auto"
                    onClick={() => setQuery("")}
                  >
                    Reset filters
                  </Button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <CategoriesSkeleton />
            ) : sortedCategories.length === 0 ? (
              <Card className="border-white/10 bg-background/80 backdrop-blur-xl">
                <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
                  <div className="rounded-full bg-white/5 p-3">
                    <Layers className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">No categories yet</h3>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Spark your taxonomy by crafting the first category. Use it
                    to guide readers through your most important story arcs.
                  </p>
                  <Button onClick={() => setIsCreateOpen(true)}>
                    Create your first category
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col gap-10">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <MetricCard
                    icon={Layers}
                    label="Total categories"
                    value={analytics.total.toString().padStart(2, "0")}
                    tone="emerald"
                  />
                  <MetricCard
                    icon={TimerReset}
                    label="Recently refreshed"
                    value={`${analytics.refreshed}`}
                    hint="Updated in the past 7 days"
                    tone="sky"
                  />
                  <MetricCard
                    icon={PenSquare}
                    label="Needs descriptions"
                    value={`${analytics.withoutDescription}`}
                    hint="Fill in to boost clarity"
                    tone="amber"
                  />
                  <MetricCard
                    icon={Sparkles}
                    label="Coverage"
                    value={`${analytics.coverage}%`}
                    hint="Categories with narrative context"
                    tone="violet"
                  />
                </div>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,0.4fr)]">
                  <Card className="border-white/10 bg-background/80 backdrop-blur-xl">
                    <CardHeader className="gap-3">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Tag className="h-5 w-5 text-primary" /> Curated
                        categories
                      </CardTitle>
                      <CardDescription>
                        Search, focus, and refine the taxonomy powering your
                        storytelling.
                      </CardDescription>
                      <div className="relative">
                        <Input
                          value={query}
                          onChange={(event) => setQuery(event.target.value)}
                          placeholder="Search categories or descriptions..."
                          className="border-white/10 bg-white/5 pl-4 pr-12"
                        />
                        <ArrowUpRight className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      {filteredCategories.length === 0 ? (
                        <div className="flex min-h-[220px] items-center justify-center text-sm text-muted-foreground">
                          No categories match that filter. Try a different
                          keyword.
                        </div>
                      ) : (
                        <div className="grid gap-3">
                          {filteredCategories.map((category) => {
                            const isActive = activeCategory?.id === category.id;
                            const lastUpdated = formatRelativeTime(
                              new Date(category.updatedAt),
                              nowMs
                            );
                            const requiresCopy = !category.description?.trim();

                            return (
                              <button
                                key={category.id}
                                type="button"
                                onClick={() =>
                                  setSelectedCategoryId(category.id)
                                }
                                className={`group relative flex w-full items-center justify-between gap-6 rounded-2xl border p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                                  isActive
                                    ? "border-primary/50 bg-primary/10 text-primary-foreground"
                                    : "border-white/10 bg-white/[0.04] hover:-translate-y-0.5 hover:border-primary/50"
                                }`}
                              >
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center gap-3">
                                    <p className="text-base font-medium tracking-tight">
                                      {category.name}
                                    </p>
                                    {requiresCopy ? (
                                      <Badge
                                        variant="outline"
                                        className="border-amber-400/50 bg-amber-500/10 text-amber-200"
                                      >
                                        Needs copy
                                      </Badge>
                                    ) : (
                                      <Badge
                                        variant="outline"
                                        className="border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                                      >
                                        Narrative ready
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="line-clamp-2 text-sm text-muted-foreground">
                                    {category.description ||
                                      "No description yet. Add context to guide readers."}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end text-xs text-muted-foreground">
                                  <span>{lastUpdated}</span>
                                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground/80">
                                    Updated
                                  </span>
                                </div>
                                <span className="pointer-events-none absolute inset-y-0 right-0 w-1 rounded-tr-2xl rounded-br-2xl bg-gradient-to-b from-primary/40 to-primary/5 opacity-0 transition group-hover:opacity-100" />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="flex flex-col gap-6">
                    <Card className="h-full border-white/10 bg-background/80 backdrop-blur-xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <Sparkles className="h-5 w-5 text-primary" /> Detail
                          studio
                        </CardTitle>
                        <CardDescription>
                          Deep dive into the selected category and refine
                          instantly.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-6">
                        {activeCategory ? (
                          <>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <h3 className="text-2xl font-semibold tracking-tight">
                                  {activeCategory.name}
                                </h3>
                                <Badge
                                  variant="secondary"
                                  className="uppercase tracking-[0.3em]"
                                >
                                  Focus
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {activeCategory.description ||
                                  "No description yet. Use the editor to give this category a voice."}
                              </p>
                            </div>

                            <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-muted-foreground">
                              <DetailRow
                                label="Slug"
                                value={activeCategory.slug}
                              />
                              <DetailRow
                                label="Created"
                                value={formatAbsolute(
                                  new Date(activeCategory.createdAt)
                                )}
                              />
                              <DetailRow
                                label="Last updated"
                                value={formatAbsolute(
                                  new Date(activeCategory.updatedAt)
                                )}
                              />
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                Quick actions
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditDialog(activeCategory)}
                                >
                                  Refine copy
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => setDeleteId(activeCategory.id)}
                                >
                                  Archive
                                </Button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Select a category on the left to surface its details
                            instantly.
                          </p>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-background/80 backdrop-blur-xl">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Changelog pulses
                        </CardTitle>
                        <CardDescription>
                          Track the freshest category activity across the
                          catalogue.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        {timelineEvents.map((event) => (
                          <div key={event.id} className="flex gap-3">
                            <span className="mt-1 h-6 w-6 rounded-full border border-primary/40 bg-primary/10 text-center text-xs leading-[22px] text-primary">
                              •
                            </span>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">
                                  {event.name}
                                </p>
                                <Badge
                                  variant="outline"
                                  className="border-white/10 bg-white/5 text-xs"
                                >
                                  {event.tone}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {event.description}
                              </p>
                              <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground/70">
                                {event.meta}
                              </p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <CategoryCreateDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        newName={newName}
        newDescription={newDescription}
        setNewName={setNewName}
        setNewDescription={setNewDescription}
        onSubmit={handleCreate}
        isSubmitting={createMutation.isPending}
      />

      <CategoryEditDialog
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        editingCategory={editingCategory}
        setEditingCategory={setEditingCategory}
        onSubmit={handleEdit}
        isSubmitting={updateMutation.isPending}
      />

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="border-white/10 bg-background/90 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>Archive category</DialogTitle>
            <DialogDescription>
              Removing a category won&apos;t delete associated posts, but their
              taxonomy guidance will disappear.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Archiving..." : "Archive"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

function formatRelativeTime(date: Date, nowMs: number) {
  const diffMs = nowMs - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;

  if (diffMs < minute) return "Just now";
  if (diffMs < hour) return `${Math.round(diffMs / minute)}m ago`;
  if (diffMs < day) return `${Math.round(diffMs / hour)}h ago`;
  if (diffMs < week) return `${Math.round(diffMs / day)}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatAbsolute(date: Date) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
        {label}
      </span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}

type MetricCardProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  hint?: string;
  tone: "emerald" | "sky" | "amber" | "violet";
};

const metricStyles = {
  emerald: "from-emerald-400/30 to-emerald-500/10",
  sky: "from-sky-400/30 to-sky-500/10",
  amber: "from-amber-400/30 to-amber-500/10",
  violet: "from-violet-400/30 to-violet-500/10",
} as const;

function MetricCard({ icon: Icon, label, value, hint, tone }: MetricCardProps) {
  return (
    <Card className="border-white/10 bg-background/80 backdrop-blur-xl">
      <CardContent className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.04] p-6">
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${metricStyles[tone]}`}
        />
        <div className="relative flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-white/10 p-2">
              <Icon className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs uppercase tracking-[0.3em] text-white/60">
              {label}
            </span>
          </div>
          <p className="text-3xl font-semibold text-white">{value}</p>
          {hint && <p className="text-xs text-white/70">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function CategoriesSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,0.4fr)]">
      <Card className="border-white/10 bg-background/80 backdrop-blur-xl">
        <CardHeader className="gap-4">
          <div className="h-5 w-40 animate-pulse rounded bg-muted/70" />
          <div className="h-9 w-full animate-pulse rounded bg-muted/60" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`skeleton-left-${index}`}
              className="h-20 animate-pulse rounded-2xl border border-white/10 bg-muted/40"
            />
          ))}
        </CardContent>
      </Card>
      <div className="flex flex-col gap-6">
        <Card className="border-white/10 bg-background/80 backdrop-blur-xl">
          <CardHeader>
            <div className="h-5 w-32 animate-pulse rounded bg-muted/70" />
            <div className="h-4 w-40 animate-pulse rounded bg-muted/50" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`skeleton-right-${index}`}
                  className="h-14 animate-pulse rounded-xl border border-white/10 bg-muted/40"
                />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-background/80 backdrop-blur-xl">
          <CardHeader>
            <div className="h-5 w-28 animate-pulse rounded bg-muted/70" />
            <div className="h-4 w-64 animate-pulse rounded bg-muted/50" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`skeleton-timeline-${index}`}
                className="h-12 animate-pulse rounded-xl border border-white/10 bg-muted/40"
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type CategoryDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newName: string;
  newDescription: string;
  setNewName: (value: string) => void;
  setNewDescription: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
};

function CategoryCreateDialog({
  isOpen,
  onOpenChange,
  newName,
  newDescription,
  setNewName,
  setNewDescription,
  onSubmit,
  isSubmitting,
}: CategoryDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Compose new category</DialogTitle>
          <DialogDescription>
            Give your category a resonant name and add context that guides
            future posts.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              placeholder="e.g. Product Vision"
              className="mt-2 border-white/10 bg-white/5"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newDescription}
              onChange={(event) => setNewDescription(event.target.value)}
              placeholder="Add positioning notes, tone guidance, or editorial intent"
              className="mt-2 border-white/10 bg-white/5"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type CategoryEditDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: {
    id: number;
    name: string;
    description: string | null;
  } | null;
  setEditingCategory: (
    category: {
      id: number;
      name: string;
      description: string | null;
    } | null
  ) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
};

function CategoryEditDialog({
  isOpen,
  onOpenChange,
  editingCategory,
  setEditingCategory,
  onSubmit,
  isSubmitting,
}: CategoryEditDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Refine category</DialogTitle>
          <DialogDescription>
            Evolve the language or description. Changes propagate instantly
            across the dashboard.
          </DialogDescription>
        </DialogHeader>
        {editingCategory && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={editingCategory.name}
                onChange={(event) =>
                  setEditingCategory({
                    ...editingCategory,
                    name: event.target.value,
                  })
                }
                placeholder="Category name"
                className="mt-2 border-white/10 bg-white/5"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editingCategory.description ?? ""}
                onChange={(event) =>
                  setEditingCategory({
                    ...editingCategory,
                    description: event.target.value,
                  })
                }
                placeholder="What should contributors know about this space?"
                className="mt-2 border-white/10 bg-white/5"
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
