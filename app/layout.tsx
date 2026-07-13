import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";

import { MobileActionBar } from "@/components/site/mobile-action-bar";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getSiteContent } from "@/lib/site/content";
import { absoluteUrl } from "@/lib/site/urls";

import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: "하누담 | 수원 영통 투플 한우 전문점",
  description: "투플 한우와 개별룸 식사를 제공하는 수원 영통 하누담입니다.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { settings } = await getSiteContent();

  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader settings={settings} />
        <div id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
          {children}
        </div>
        <SiteFooter settings={settings} />
        <MobileActionBar settings={settings} />
      </body>
    </html>
  );
}
