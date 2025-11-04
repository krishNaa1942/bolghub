"use client";

import { useEffect } from "react";
import { announceToScreenReader } from "@/lib/accessibility";

/**
 * Keyboard Shortcuts Handler
 * Implements common keyboard shortcuts for better UX
 */
export function KeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Note: Search functionality placeholder for future implementation
      // Ctrl/Cmd + K: Open search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        announceToScreenReader("Search functionality coming soon", "polite");
      }

      // Ctrl/Cmd + H: Go to home
      if ((e.ctrlKey || e.metaKey) && e.key === "h") {
        e.preventDefault();
        window.location.href = "/";
        announceToScreenReader("Navigating to home", "polite");
      }

      // Ctrl/Cmd + B: Go to blog
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        window.location.href = "/blog";
        announceToScreenReader("Navigating to blog", "polite");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Render hidden instructions for screen readers
  return (
    <div className="sr-only" aria-live="polite">
      Keyboard shortcuts available: Ctrl+H for home, Ctrl+B for blog
    </div>
  );
}
