import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Breadcrumbs } from "@/components/breadcrumbs";

describe("Breadcrumbs Component", () => {
  it("should render breadcrumb items", () => {
    const items = [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: "Post Title" },
    ];

    render(<Breadcrumbs items={items} />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Blog")).toBeInTheDocument();
    expect(screen.getByText("Post Title")).toBeInTheDocument();
  });

  it("should render links for items with href", () => {
    const items = [
      { label: "Home", href: "/" },
      { label: "Current Page" },
    ];

    render(<Breadcrumbs items={items} />);

    const homeLink = screen.getByText("Home");
    expect(homeLink.closest("a")).toHaveAttribute("href", "/");
  });

  it("should not render link for last item", () => {
    const items = [
      { label: "Home", href: "/" },
      { label: "Current Page" },
    ];

    render(<Breadcrumbs items={items} />);

    const currentPage = screen.getByText("Current Page");
    expect(currentPage.closest("a")).toBeNull();
  });

  it("should handle single breadcrumb item", () => {
    const items = [{ label: "Home", href: "/" }];

    render(<Breadcrumbs items={items} />);

    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("should handle empty breadcrumbs gracefully", () => {
    const { container } = render(<Breadcrumbs items={[]} />);

    expect(container.querySelector("nav")).toBeInTheDocument();
  });
});
