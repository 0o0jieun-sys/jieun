import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { HomePage } from "@/app/page";
import { fallbackContent } from "@/lib/site/fallback-content";

afterEach(cleanup);

describe("Hanudam home page", () => {
  it("uses real beef, lunch, and room photos", () => {
    render(<HomePage content={fallbackContent} />);

    expect(screen.getByRole("img", { name: "하누담 한우 모둠 사진" })).toHaveStyle({
      backgroundImage: 'url("/images/hanudam-assorted-hanwoo.webp")',
    });
    expect(screen.getByRole("img", { name: "네이버 플레이스 업체 안심 메뉴 사진" })).toHaveStyle({
      backgroundImage: 'url("/images/hanudam-menu-tenderloin.webp")',
    });
    expect(screen.getByRole("img", { name: "네이버 플레이스 업체 등심 메뉴 사진" })).toHaveStyle({
      backgroundImage: 'url("/images/hanudam-menu-sirloin.webp")',
    });
    expect(screen.getByRole("img", { name: "네이버 플레이스 업체 살치살 메뉴 사진" })).toHaveStyle({
      backgroundImage: 'url("/images/hanudam-menu-salchisal.webp")',
    });
    expect(screen.getByRole("img", { name: "하누담 마블링 한우 사진" })).toHaveStyle({
      backgroundImage: 'url("/images/hanudam-marbling-closeup.webp")',
    });
    expect(screen.getByRole("img", { name: "흰 대리석 테이블이 있는 하누담 개별룸" })).toHaveStyle({
      backgroundImage: 'url("/images/hanudam-white-marble-room.webp")',
    });
    expect(screen.getByRole("img", { name: "하누담 갈비해신탕 메뉴 사진" })).toHaveStyle({
      backgroundImage: 'url("/images/hanudam-lunch-galbi-haesintang.webp")',
    });
    expect(screen.getByRole("img", { name: "하누담 육회비빔밥 메뉴 사진" })).toHaveStyle({
      backgroundImage: 'url("/images/hanudam-lunch-yukhoe-bibimbap.webp")',
    });
    expect(screen.getByRole("img", { name: "하누담 한우국밥 메뉴 사진" })).toHaveStyle({
      backgroundImage: 'url("/images/hanudam-lunch-hanwoo-gukbap.webp")',
    });
  });

  it("renders the approved premium Hanwoo story and signature cuts", () => {
    render(<HomePage content={fallbackContent} />);

    expect(
      screen.getByRole("heading", { name: "완전한 개별룸에서 만나는 1++ No.9 한우", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "하누담의 대표 한우 메뉴" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "안심" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "등심" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "살치살" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "점심에도 이어지는 하누담의 정성" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /1\+\+ No\.9에서.*제철 상차림까지/ })).toBeInTheDocument();
    expect(screen.getAllByText(/계절에 맞춰 달라지는 밑반찬/)).toHaveLength(2);
  });

  it("keeps the reservation paths and verified Naver destination clear", () => {
    render(<HomePage content={fallbackContent} />);

    const reservation = screen.getByRole("region", { name: "예약 안내" });
    expect(within(reservation).getByRole("link", { name: "네이버 예약" })).toHaveAttribute(
      "href",
      "https://naver.me/FbOhLPXy",
    );
    expect(within(reservation).getByText("2–29명")).toBeInTheDocument();
    expect(within(reservation).getByText("30명 이상")).toBeInTheDocument();
    expect(within(reservation).getByRole("heading", { name: "가족 모임·기업 회식" })).toBeInTheDocument();
  });

  it("shows current verified menu and visit facts with a working phone link", () => {
    const { container } = render(<HomePage content={fallbackContent} />);

    expect(screen.getByText("1++ No.9 · 130g · 56,000원")).toBeInTheDocument();
    expect(screen.getByText("1++ No.9 · 130g · 52,000원")).toBeInTheDocument();
    expect(screen.getByText("1++ No.9 · 130g · 78,000원 (한정)")).toBeInTheDocument();
    expect(screen.getByText(/특수부위 모둠 450g.*180,000원/)).toBeInTheDocument();
    const lunch = screen.getByRole("region", { name: "점심 메뉴" });
    expect(within(lunch).getByRole("heading", { name: "갈비해신탕" })).toBeInTheDocument();
    expect(within(lunch).getByRole("heading", { name: "육회비빔밥" })).toBeInTheDocument();
    expect(within(lunch).getByRole("heading", { name: "한우국밥" })).toBeInTheDocument();
    expect(screen.getByText(/0507-1431-0005/)).toBeInTheDocument();
    expect(screen.getByText(/영통역 1번 출구 542m/)).toBeInTheDocument();
    expect(screen.getByText(/휠체어 출입 가능/)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "전화 문의" }).every((link) => link.getAttribute("href") === "tel:0507-1431-0005")).toBe(true);
    expect(container.querySelector('a[href="https://naver.me/FbOhLPXy"]')).toBeInTheDocument();
  });

  it("shows five redacted visitor review captures with their source", () => {
    const { container } = render(<HomePage content={fallbackContent} />);

    const reviews = screen.getByRole("region", { name: "네이버 고객 리뷰" });
    const captures = within(reviews).getAllByRole("img");
    expect(captures).toHaveLength(5);
    for (const capture of captures) {
      expect(capture).toHaveAttribute("alt", expect.stringContaining("네이버 방문자 리뷰 원본 화면"));
    }
    expect(captures.map((capture) => capture.getAttribute("src")).sort()).toEqual(
      [1, 2, 3, 4, 5].map((index) => `/images/reviews/naver-visitor-review-${index}.webp`),
    );
    expect(within(reviews).queryAllByRole("blockquote")).toHaveLength(0);
    expect(within(reviews).getByText(/고객 아이디와 프로필 정보는 가렸습니다/)).toBeInTheDocument();
    expect(container.querySelector('a[href="https://m.place.naver.com/restaurant/1745436509/review/visitor"]')).toBeInTheDocument();
  });

  it("emits conservative Restaurant and FAQ structured data", () => {
    const { container } = render(<HomePage content={fallbackContent} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();

    const structuredData = JSON.parse(script?.textContent ?? "null");
    expect(structuredData[0]).toMatchObject({
      "@type": "Restaurant",
      name: "하누담",
      telephone: "0507-1431-0005",
      address: {
        streetAddress: "경기도 수원시 영통구 청명남로34번길 21 테라스가든 상가 2층 하누담",
      },
    });
    expect(structuredData[1]).toMatchObject({ "@type": "FAQPage" });
    expect(structuredData[0]).not.toHaveProperty("openingHours");
    expect(structuredData[0]).not.toHaveProperty("aggregateRating");
    expect(script?.textContent).not.toContain("335");
  });
});
