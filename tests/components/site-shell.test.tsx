import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { MobileActionBar } from "@/components/site/mobile-action-bar";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Button } from "@/components/ui/button";
import { fallbackContent } from "@/lib/site/fallback-content";

afterEach(cleanup);

describe("site shell", () => {
  it("exposes Korean navigation and the reservation action", () => {
    render(<SiteHeader settings={fallbackContent.settings} />);

    expect(screen.getByRole("link", { name: "메뉴" })).toHaveAttribute("href", "/#menu");
    expect(screen.getByRole("link", { name: "개별룸" })).toHaveAttribute("href", "/#rooms");
    expect(screen.getByRole("link", { name: "예약·단체문의" })).toHaveAttribute(
      "href",
      "/#group-inquiry",
    );
    expect(screen.getByRole("link", { name: "오시는 길" })).toHaveAttribute("href", "/#visit");
    expect(screen.getByRole("link", { name: "네이버 예약" })).toHaveAttribute(
      "href",
      "https://naver.me/FbOhLPXy",
    );
  });

  it("hides an empty phone action instead of rendering a broken tel link", () => {
    render(<MobileActionBar settings={{ ...fallbackContent.settings, phone: "" }} />);

    expect(screen.queryByRole("link", { name: "전화 문의" })).not.toBeInTheDocument();
  });

  it("keeps footer navigation on implemented home sections", () => {
    render(<SiteFooter settings={fallbackContent.settings} />);

    expect(screen.getByRole("link", { name: "메뉴" })).toHaveAttribute("href", "/#menu");
    expect(screen.getByRole("link", { name: "개별룸" })).toHaveAttribute("href", "/#rooms");
    expect(screen.getByRole("link", { name: "예약·단체문의" })).toHaveAttribute(
      "href",
      "/#group-inquiry",
    );
    expect(screen.getByRole("link", { name: "오시는 길" })).toHaveAttribute("href", "/#visit");
  });

  it("provides a customer-sized button with readable text", () => {
    render(<Button size="customer">예약하기</Button>);

    expect(screen.getByRole("button", { name: "예약하기" })).toHaveClass(
      "min-h-13",
      "text-base",
    );
  });
});
