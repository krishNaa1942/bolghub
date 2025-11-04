"use client";

import { useEffect, useRef } from "react";

/**
 * Auto-save hook for form data to localStorage
 * Prevents data loss when navigating away or browser crashes
 */
export function useAutoSave<T>(
  key: string,
  data: T,
  options: {
    delay?: number;
    enabled?: boolean;
  } = {}
) {
  const { delay = 2000, enabled = true } = options;
  const savedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Auto-save when data changes
  useEffect(() => {
    if (!data || !enabled) return;

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced save
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        savedRef.current = true;
        console.log(`[AUTO-SAVE] Saved to localStorage: ${key}`);
      } catch (error) {
        console.error("[AUTO-SAVE] Failed to save:", error);
      }
    }, delay);

    // Cleanup timeout on unmount or data change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, key, delay, enabled]);

  return savedRef;
}

/**
 * Load saved data from localStorage
 */
export function loadFromLocalStorage<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      console.log(`[AUTO-SAVE] Loaded from localStorage: ${key}`);
      return JSON.parse(saved) as T;
    }
  } catch (error) {
    console.error("[AUTO-SAVE] Failed to load:", error);
  }
  return null;
}

/**
 * Clear saved data from localStorage
 */
export function clearLocalStorage(key: string) {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem(key);
    console.log(`[AUTO-SAVE] Cleared localStorage: ${key}`);
  } catch (error) {
    console.error("[AUTO-SAVE] Failed to clear:", error);
  }
}

/**
 * Check if there's saved data
 */
export function hasSavedData(key: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(key) !== null;
}
