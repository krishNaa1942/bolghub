import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("Utils", () => {
  describe("cn (className merger)", () => {
    it("should merge class names correctly", () => {
      const result = cn("text-red-500", "text-blue-500");
      expect(result).toBe("text-blue-500");
    });

    it("should handle conditional classes", () => {
      const result = cn("base-class", false && "hidden", "visible");
      expect(result).toBe("base-class visible");
    });

    it("should merge tailwind classes without conflicts", () => {
      const result = cn("px-4 py-2", "px-6");
      expect(result).toBe("py-2 px-6");
    });

    it("should handle empty inputs", () => {
      const result = cn();
      expect(result).toBe("");
    });

    it("should handle arrays of classes", () => {
      const result = cn(["text-sm", "font-bold"], "text-lg");
      expect(result).toBe("font-bold text-lg");
    });
  });
});
