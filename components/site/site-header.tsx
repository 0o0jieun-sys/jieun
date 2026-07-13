import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import type { SiteSettings } from "@/lib/site/types";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/menu", label: "메뉴" },
  { href: "/rooms", label: "개별룸" },
  { href: "/reservation", label: "예약·단체문의" },
  { href: "/location", label: "오시는 길" },
  { href: "/news", label: "소식" },
];

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-secondary/95 text-secondary-foreground backdrop-blur">
      <a
        href="#main-content"
        className="sr-only rounded-md bg-background px-4 py-3 text-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        본문으로 바로가기
      </a>
      <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" className="text-2xl font-extrabold tracking-tight" aria-label="하누담 홈">
          하누담
        </Link>
        <nav aria-label="주요 메뉴" className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-base font-semibold text-secondary-foreground/90 transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <a
          href={settings.naverReservationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ size: "customer" }), "hidden sm:inline-flex")}
        >
          네이버 예약
        </a>
      </div>
    </header>
  );
}
