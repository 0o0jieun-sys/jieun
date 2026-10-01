import Link from "next/link";

import type { SiteSettings } from "@/lib/site/types";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="border-t border-white/10 bg-secondary pb-24 pt-12 text-secondary-foreground md:pb-12">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <p className="text-2xl font-extrabold">하누담</p>
          <p className="max-w-xl text-base text-secondary-foreground/80">
            {settings.description}
          </p>
          <address className="text-base not-italic text-secondary-foreground/80">
            {settings.roadAddress}
          </address>
          {settings.phone ? (
            <a className="inline-flex text-base font-semibold hover:text-accent" href={`tel:${settings.phone}`}>
              {settings.phone}
            </a>
          ) : null}
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-3 text-base font-bold">이용 안내</p>
            {settings.businessHours.length > 0 ? (
              <ul className="space-y-1 text-base text-secondary-foreground/80">
                {settings.businessHours.map((hours) => (
                  <li key={hours}>{hours}</li>
                ))}
              </ul>
            ) : null}
            {settings.parking ? (
              <p className="mt-3 text-base text-secondary-foreground/80">주차: {settings.parking}</p>
            ) : null}
          </div>
          <nav aria-label="하단 메뉴" className="flex flex-col items-start gap-2">
            <Link href="/#menu" className="text-base hover:text-accent">메뉴</Link>
            <Link href="/#rooms" className="text-base hover:text-accent">개별룸</Link>
            <Link href="/#group-inquiry" className="text-base hover:text-accent">예약·단체문의</Link>
            <Link href="/#visit" className="text-base hover:text-accent">오시는 길</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
