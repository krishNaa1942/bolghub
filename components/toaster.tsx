"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      richColors
      theme="dark"
      className="toaster group"
      visibleToasts={4}
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:border-white/10 group-[.toaster]:bg-background/90 group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur-xl",
          description:
            "group-[.toast]:text-muted-foreground text-xs",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
    />
  );
}
