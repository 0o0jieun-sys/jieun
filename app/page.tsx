import {
  ArrowUpRight,
  CalendarCheck2,
  Check,
  MapPin,
  UsersRound,
} from "lucide-react";
import Image from "next/image";

import { getSiteContent } from "@/lib/site/content";
import type { SiteContent } from "@/lib/site/types";
import { absoluteUrl } from "@/lib/site/urls";

const images = {
  heroDesktop: "/images/hanudam-assorted-hanwoo.webp",
  heroMobile: "/images/hanudam-marbling-closeup.webp",
  tenderloin: "/images/hanudam-menu-tenderloin.webp",
  sirloin: "/images/hanudam-menu-sirloin.webp",
  salchisal: "/images/hanudam-menu-salchisal.webp",
  seasonalTable: "/images/hanudam-served-table.webp",
  room: "/images/hanudam-white-marble-room.webp",
} as const;

const standards = [
  ["01", "1++ No.9의 풍미", "안심·등심·살치살, 취향에 맞춘 대표 부위"],
  ["02", "굽기의 완성", "식사에 집중할 수 있도록 세심하게 준비하는 서비스"],
  ["03", "제철의 곁들임", "계절에 맞춰 달라지는 밑반찬과 함께하는 한 상"],
] as const;

const signatureCuts = [
  {
    cut: "안심",
    name: "안심",
    englishName: "TENDERLOIN",
    image: images.tenderloin,
    imageDescription: "네이버 플레이스 업체 안심 메뉴 사진",
  },
  {
    cut: "등심",
    name: "등심",
    englishName: "SIRLOIN",
    image: images.sirloin,
    imageDescription: "네이버 플레이스 업체 등심 메뉴 사진",
  },
  {
    cut: "살치살",
    name: "살치살",
    englishName: "CHUCK FLAP TAIL",
    image: images.salchisal,
    imageDescription: "네이버 플레이스 업체 살치살 메뉴 사진",
  },
] as const;

const lunchMenu = [
  { name: "갈비해신탕", price: "22,000원", image: "/images/hanudam-lunch-galbi-haesintang.webp" },
  { name: "육회비빔밥", price: "14,000원", image: "/images/hanudam-lunch-yukhoe-bibimbap.webp" },
  { name: "한우국밥", price: "13,000원", image: "/images/hanudam-lunch-hanwoo-gukbap.webp" },
] as const;

const visitorReviews = [
  {
    title: "1++ No.9 한우",
    image: "/images/reviews/naver-visitor-review-1.webp",
    height: 836,
    alt: "네이버 방문자 리뷰 원본 화면. 투플러스 No.9 한우의 풍미와 직원의 친절한 서비스를 칭찬한 후기",
  },
  {
    title: "프라이빗한 룸",
    image: "/images/reviews/naver-visitor-review-2.webp",
    height: 431,
    alt: "네이버 방문자 리뷰 원본 화면. 프라이빗한 룸에서 좋은 시간을 보냈다는 후기",
  },
  {
    title: "가족의 점심",
    image: "/images/reviews/naver-visitor-review-3.webp",
    height: 521,
    alt: "네이버 방문자 리뷰 원본 화면. 부모님 환갑 기념 점심 특선과 넓은 룸에 만족했다는 후기",
  },
  {
    title: "밑반찬의 조화",
    image: "/images/reviews/naver-visitor-review-4.webp",
    height: 476,
    alt: "네이버 방문자 리뷰 원본 화면. 직원이 구운 고기와 밑반찬의 조화를 칭찬한 후기",
  },
  {
    title: "직접 구워주는 서비스",
    image: "/images/reviews/naver-visitor-review-5.webp",
    height: 521,
    alt: "네이버 방문자 리뷰 원본 화면. 프라이빗한 룸과 직접 구워주는 서비스에 만족했다는 후기",
  },
] as const;

const reviewColumns = [
  [visitorReviews[0], visitorReviews[2]],
  [visitorReviews[1], visitorReviews[3], visitorReviews[4]],
] as const;

const faqs = [
  {
    question: "예약은 어떻게 하나요?",
    answer: "가족 모임과 기업 회식을 포함해 2–29명은 네이버 예약, 30명 이상 단체는 전화로 문의해 주세요.",
  },
  {
    question: "개별룸 이용이 가능한가요?",
    answer: "모임 목적과 인원에 맞는 공간을 예약 단계에서 안내합니다.",
  },
  {
    question: "메뉴와 영업 정보는 어디서 확인하나요?",
    answer: "메뉴와 가격은 네이버 플레이스 최신 메뉴를, 영업시간·휴무·주차 조건은 최신 매장 안내를 확인해 주세요.",
  },
] as const;

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`text-base font-bold tracking-[0.14em] ${light ? "text-[#c8a05a]" : "text-[#6e1f26]"}`}>
      {children}
    </p>
  );
}

function PrimaryLink({
  href,
  children,
  external = false,
  light = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  light?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`inline-flex min-h-13 items-center justify-center gap-2 rounded-md px-6 text-base font-extrabold transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 ${
        light
          ? "border border-white/35 bg-white/5 text-white hover:bg-white/15"
          : "bg-[#6e1f26] text-white hover:bg-[#58181e]"
      }`}
    >
      {children}
    </a>
  );
}

export function HomePage({ content }: { content: SiteContent }) {
  const { settings } = content;
  const inquiryHref = settings.orderInquiryUrl || (settings.phone ? `tel:${settings.phone}` : settings.naverPlaceUrl);
  const menuItems = content.menu.filter((item) => item.visible);
  const restaurantStructuredData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: settings.name,
    description: settings.description,
    telephone: settings.phone,
    url: absoluteUrl("/"),
    sameAs: [settings.naverPlaceUrl],
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.roadAddress,
      addressLocality: "수원시",
      addressRegion: "경기도",
      addressCountry: "KR",
    },
    hasMenu: {
      "@type": "Menu",
      hasMenuSection: [
        {
          "@type": "MenuSection",
          name: "대표 한우 메뉴",
          hasMenuItem: menuItems.map((item) => {
            const price = Number(item.priceText.replace(/[^0-9]/g, ""));

            return {
              "@type": "MenuItem",
              name: item.name,
              description: [item.grade, item.servingText, item.description].filter(Boolean).join(" · "),
              ...(price > 0
                ? { offers: { "@type": "Offer", priceCurrency: "KRW", price } }
                : {}),
            };
          }),
        },
      ],
    },
  };
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
  const structuredData = JSON.stringify([restaurantStructuredData, faqStructuredData]).replace(/</g, "\\u003c");

  return (
    <main className="overflow-x-hidden bg-[#f5f1ec] text-[#171311]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      <section className="relative isolate min-h-[700px] overflow-hidden bg-[#171311] text-white">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center sm:hidden"
          style={{ backgroundImage: `url(${images.heroMobile})` }}
          role="img"
          aria-label="하누담 마블링 한우 사진"
        />
        <div
          className="absolute inset-0 -z-20 hidden bg-cover bg-center sm:block"
          style={{ backgroundImage: `url(${images.heroDesktop})` }}
          role="img"
          aria-label="하누담 한우 모둠 사진"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(23,19,17,0.98)_0%,rgba(23,19,17,0.9)_48%,rgba(23,19,17,0.28)_100%)]" />
        <div className="mx-auto flex min-h-[700px] w-full max-w-7xl flex-col justify-center px-5 py-20 sm:px-8 lg:py-28">
          <div className="max-w-3xl">
            <span className="mb-8 inline-flex rounded border border-white/25 bg-white/5 px-4 py-2 text-base font-bold tracking-[0.12em]">
              PREMIUM PRIVATE DINING
            </span>
            <p className="mb-4 text-lg font-bold text-[#c8a05a]">수원 영통 · 1++ No.9 한우 전문점</p>
            <h1 className="max-w-2xl text-4xl font-black leading-[1.18] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              완전한 개별룸에서{" "}
              <br />
              만나는 1++ No.9 한우
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#eee7e1]">
              깊은 육향의 한 점에서 제철 반찬을 곁들인 한 상까지. 가족의 특별한 날과 중요한 비즈니스 자리에도
              하누담의 식사가 이어집니다.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryLink href={settings.naverReservationUrl} external>
                네이버 예약
                <ArrowUpRight aria-hidden="true" size={20} />
              </PrimaryLink>
              <PrimaryLink href={inquiryHref} external={!settings.phone} light>
                전화 문의
              </PrimaryLink>
            </div>
          </div>
          <div className="mt-14 grid gap-3 border-t border-white/25 pt-5 text-base font-semibold text-[#f4eee8] sm:grid-cols-3">
              <p>블루리본 인증 수원 한우 명소</p>
            <p>개별룸 중심의 모임 공간</p>
              <p>2–29명 예약 · 30명 이상 문의</p>
          </div>
        </div>
      </section>

      <section id="visit" aria-label="예약 안내" className="bg-[#f5f1ec] py-12 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="mb-7 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="text-3xl font-black tracking-tight">예약은 간단하게, 모임은 정확하게.</h2>
            <p className="text-base text-[#6b625c]">인원에 맞는 예약 방법을 선택하세요.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-[1fr_0.75fr]">
            <div className="grid gap-4">
            <article className="flex min-h-36 items-start gap-5 border border-[#d6d1cb] bg-white p-6">
              <CalendarCheck2 className="mt-1 shrink-0 text-[#6e1f26]" aria-hidden="true" size={30} />
              <div>
                <p className="text-base font-bold text-[#6e1f26]">2–29명</p>
                <h3 className="mt-1 text-2xl font-black">가족 모임·기업 회식</h3>
                <p className="mt-2 text-base text-[#6b625c]">기념일과 소규모 기업 회식도 네이버에서 날짜와 인원을 선택해 예약하세요.</p>
                <a
                  className="mt-4 inline-flex min-h-11 items-center font-extrabold text-[#6e1f26]"
                  href={settings.naverReservationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  네이버 예약 <ArrowUpRight aria-hidden="true" className="ml-1" size={19} />
                </a>
              </div>
            </article>
            <article id="group-inquiry" className="flex min-h-36 items-start gap-5 bg-[#6e1f26] p-6 text-white">
              <UsersRound className="mt-1 shrink-0" aria-hidden="true" size={30} />
              <div>
                <p className="text-base font-bold text-[#e0bb75]">30명 이상</p>
                <h3 className="mt-1 text-2xl font-black">대규모 회식과 단체 모임</h3>
                <p className="mt-2 text-base text-[#f2e7e8]">전화로 일정과 좌석을 상담해드립니다.</p>
                <a
                  className="mt-4 inline-flex min-h-11 items-center font-extrabold text-white"
                  href={inquiryHref}
                  target={settings.phone ? undefined : "_blank"}
                  rel={settings.phone ? undefined : "noopener noreferrer"}
                >
                  {settings.phone ? "전화 문의" : "네이버 플레이스에서 문의처 확인"}
                  <ArrowUpRight aria-hidden="true" className="ml-1" size={19} />
                </a>
              </div>
            </article>
            </div>
            <article className="bg-[#241f1c] p-7 text-white">
              <MapPin className="text-[#c8a05a]" aria-hidden="true" size={30} />
              <h3 className="mt-5 text-2xl font-black">{settings.name}</h3>
              <address className="mt-3 text-base not-italic leading-7 text-[#e4dbd4]">{settings.roadAddress}</address>
              <p className="mt-4 text-base leading-7 text-[#beb3ab]">
                전화 {settings.phone} · 주차 가능
                <br />
                영통역 1번 출구 542m · 휠체어 출입 가능
              </p>
              <p className="mt-3 text-base leading-7 text-[#beb3ab]">
                영업시간과 주차 조건은 네이버 플레이스 최신 안내를 확인해 주세요.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`tel:${settings.phone}`}
                  className="inline-flex min-h-13 items-center gap-2 bg-[#6e1f26] px-5 text-base font-extrabold"
                >
                  전화 문의 <ArrowUpRight aria-hidden="true" size={19} />
                </a>
                <a
                  href={settings.naverPlaceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-13 items-center gap-2 border border-white/35 px-5 text-base font-extrabold"
                >
                  네이버 플레이스 <ArrowUpRight aria-hidden="true" size={19} />
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="menu" className="bg-[#241f1c] py-20 text-white sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="mb-9 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Eyebrow light>SIGNATURE CUTS</Eyebrow>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">하누담의 대표 한우 메뉴</h2>
            </div>
            <p className="text-base text-[#cfc5be]">네이버 플레이스 2026.09.11 기준 · 가격 변동 가능</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {signatureCuts.map((cut) => {
              const item = menuItems.find((menuItem) => menuItem.cut === cut.cut);
              if (!item) return null;

              return (
              <article
                key={cut.name}
                className="relative isolate flex min-h-[380px] flex-col justify-end overflow-hidden border border-white/15 p-6"
              >
                <div
                  className="absolute inset-0 -z-20 bg-cover bg-center transition-transform duration-500 hover:scale-105"
                  style={{ backgroundImage: `url(${cut.image})` }}
                  role="img"
                  aria-label={cut.imageDescription}
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/20 to-black/5" />
                <p className="text-base font-bold tracking-[0.12em] text-[#e0bb75]">{cut.englishName}</p>
                <h3 className="mt-1 text-3xl font-black">{cut.name}</h3>
                <p className="mt-2 text-base text-[#e5ddd6]">
                  {item.grade} · {item.servingText} · {item.priceText}
                </p>
              </article>
              );
            })}
          </div>
          <p className="mt-4 text-base text-[#cfc5be]">부위별 사진은 네이버 플레이스 업체 메뉴 사진입니다. 구성은 방문 시 달라질 수 있습니다.</p>
          <div className="mt-6 space-y-2 text-base leading-7 text-[#e5ddd6]">
              <p>특수부위 모둠 450g · 안심과 특수부위 2~3가지 · 180,000원</p>
              <a className="inline-flex min-h-13 items-center gap-2 font-bold text-[#e0bb75] underline underline-offset-4" href={settings.naverPlaceUrl} target="_blank" rel="noopener noreferrer">
                전체 메뉴는 네이버 플레이스에서 확인 <ArrowUpRight aria-hidden="true" size={19} />
              </a>
          </div>
        </div>
      </section>

      <section id="lunch" aria-label="점심 메뉴" className="bg-[#f5f1ec] py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="mb-9 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Eyebrow>LUNCH AT HANUDAM</Eyebrow>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">점심에도 이어지는 하누담의 정성</h2>
            </div>
            <p className="text-base text-[#6b625c]">네이버 플레이스 메뉴 사진 · 가격 변동 가능</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {lunchMenu.map((item) => (
              <article key={item.name} className="relative isolate flex min-h-[320px] flex-col justify-end overflow-hidden bg-[#241f1c] p-6 sm:min-h-[380px]">
                <div className="absolute inset-0 -z-20 bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} role="img" aria-label={`하누담 ${item.name} 메뉴 사진`} />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <p className="text-base font-bold tracking-[0.12em] text-[#e0bb75]">LUNCH</p>
                <h3 className="mt-1 text-3xl font-black text-white">{item.name}</h3>
                <p className="mt-2 text-base text-[#e5ddd6]">{item.price}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 text-base text-[#6b625c]">메뉴와 가격은 방문 전 네이버 플레이스의 최신 정보를 확인해 주세요.</p>
        </div>
      </section>

      <section aria-label="하누담의 상차림 이야기" className="bg-[#efe9e2] py-20 sm:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
          <div className="min-h-[440px] bg-cover bg-center" style={{ backgroundImage: `url(${images.seasonalTable})` }} role="img" aria-label="하누담 한우와 제철 밑반찬 상차림" />
          <div>
            <Eyebrow>THE HANUDAM TABLE</Eyebrow>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl">1++ No.9에서<br />제철 상차림까지</h2>
            <p className="mt-6 text-lg leading-8 text-[#5f5751]">마블링과 육향이 살아 있는 한우를 고르고, 알맞은 굽기로 한 점의 맛을 완성합니다. 식탁에는 계절에 맞춰 달라지는 밑반찬을 곁들여 그날의 식사를 더 풍성하게 준비합니다.</p>
            <p className="mt-4 text-base leading-7 text-[#6b625c]">사진은 실제 하누담 상차림입니다. 밑반찬 구성은 계절과 재료 수급에 따라 달라집니다.</p>
          </div>
        </div>
      </section>

      <section className="bg-[#efe9e2] py-20 sm:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Eyebrow>HANUDAM STANDARD</Eyebrow>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              좋은 한우를 고르는 일부터
              <br />
              가장 맛있는 순간까지
            </h2>
            <p className="mt-6 text-lg leading-8 text-[#5f5751]">
              하누담은 1++ No.9 한우의 부위별 매력을 살피고, 식사의 목적과 취향에 맞는 선택을 돕습니다. 중요한
              자리일수록 고기와 공간, 서비스의 기준을 세심하게 준비합니다.
            </p>
          </div>
          <ol className="border-b border-[#cfc4b9]">
            {standards.map(([number, title, description]) => (
              <li key={title} className="grid gap-3 border-t border-[#cfc4b9] py-6 sm:grid-cols-[3.5rem_1fr]">
                <span className="text-lg font-black text-[#c8a05a]">{number}</span>
                <div>
                  <h3 className="text-xl font-black">{title}</h3>
                  <p className="mt-1 text-base leading-7 text-[#6b625c]">{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="rooms" className="bg-[#f5f1ec] py-20 sm:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
          <div
            className="relative min-h-[420px] overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `url(${images.room})` }}
            role="img"
            aria-label="흰 대리석 테이블이 있는 하누담 개별룸"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <p className="absolute bottom-6 left-6 right-6 text-lg font-bold text-white">모임의 목적에 맞춘 개별룸</p>
          </div>
          <div>
            <Eyebrow>PRIVATE DINING</Eyebrow>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              소중한 대화가
              <br />
              온전히 머무는 공간
            </h2>
            <p className="mt-6 text-lg leading-8 text-[#5f5751]">
              부모님과의 식사, 기념일, 중요한 비즈니스 모임까지. 목적에 맞는 자리를 편안하게 준비할 수
              있도록 예약 단계부터 안내합니다.
            </p>
            <ul className="mt-7 space-y-4">
              {["가족 식사와 기념일", "비즈니스 식사와 소규모 회식", "30명 이상 단체 모임 상담"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-3 text-base font-bold">
                    <Check className="shrink-0 text-[#c8a05a]" aria-hidden="true" size={21} />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      <section aria-label="네이버 고객 리뷰" className="bg-[#171311] py-20 text-white sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <Eyebrow light>NAVER VISITOR REVIEWS</Eyebrow>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">고객의 식사 경험이 말해주는 하누담</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#ddd4cd]">
            네이버 방문자 리뷰 원본 화면을 담았습니다. 고객 아이디와 프로필 정보는 가렸습니다.
          </p>
          <div className="mt-9 grid gap-5 md:grid-cols-2">
            {reviewColumns.map((column, index) => (
              <div key={index} className="flex flex-col gap-5">
                {column.map((review) => (
                  <article key={review.title}>
                    <h3 className="mb-2 text-xl font-bold text-[#c8a05a]">{review.title}</h3>
                    <Image
                      src={review.image}
                      width={780}
                      height={review.height}
                      alt={review.alt}
                      className="h-auto w-full bg-white"
                      sizes="(min-width: 768px) 50vw, 100vw"
                      unoptimized
                    />
                  </article>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-5 border-t border-white/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-base text-[#e9e1da]">네이버 방문자 리뷰 원본 화면 · 아이디와 프로필 비공개</p>
            <PrimaryLink href="https://m.place.naver.com/restaurant/1745436509/review/visitor" external>
              네이버 리뷰 보기
              <ArrowUpRight aria-hidden="true" size={20} />
            </PrimaryLink>
          </div>
        </div>
      </section>

      <section className="bg-[#171311] py-20 text-white sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <Eyebrow light>BEFORE YOUR VISIT</Eyebrow>
          <h2 className="mt-3 text-3xl font-black tracking-tight">방문 전 자주 묻는 질문</h2>
          <dl className="mt-8 border-b border-white/15">
            {faqs.map((faq) => (
              <div key={faq.question} className="grid gap-3 border-t border-white/15 py-6 lg:grid-cols-[20rem_1fr]">
                <dt className="text-lg font-black">{faq.question}</dt>
                <dd className="text-base leading-7 text-[#cfc5be]">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </main>
  );
}

export default async function Home() {
  const content = await getSiteContent();
  return <HomePage content={content} />;
}
