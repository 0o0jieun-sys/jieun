import type { SiteContent } from "@/lib/site/types";

const phone = process.env.NEXT_PUBLIC_HANUDAM_PHONE ?? "0507-1431-0005";

export const fallbackContent: SiteContent = Object.freeze({
  settings: {
    name: "하누담",
    description: "수원 영통에서 1++ No.9 한우와 제철 상차림, 개별룸 식사를 제공하는 하누담입니다.",
    roadAddress:
      "경기도 수원시 영통구 청명남로34번길 21 테라스가든 상가 2층 하누담",
    phone,
    businessHours: [],
    parking: "주차 가능 (세부 조건은 네이버 플레이스 확인)",
    naverReservationUrl: "https://naver.me/FbOhLPXy",
    naverPlaceUrl: "https://naver.me/FbOhLPXy",
    orderInquiryUrl: `tel:${phone}`,
  },
  menu: [
    {
      slug: "tenderloin",
      name: "투플 안심",
      cut: "안심",
      description: "부드러운 식감과 섬세한 풍미의 한우 안심.",
      priceText: "56,000원",
      servingText: "130g",
      origin: "국내산 한우",
      grade: "1++ No.9",
      visible: true,
    },
    {
      slug: "sirloin",
      name: "투플 등심",
      cut: "등심",
      description: "육향과 고소함의 균형을 즐기는 한우 등심.",
      priceText: "52,000원",
      servingText: "130g",
      origin: "국내산 한우",
      grade: "1++ No.9",
      visible: true,
    },
    {
      slug: "salchisal",
      name: "투플 살치살",
      cut: "살치살",
      description: "풍부한 마블링과 고소한 풍미의 한우 살치살, 한정 메뉴입니다.",
      priceText: "78,000원 (한정)",
      servingText: "130g",
      origin: "국내산 한우",
      grade: "1++ No.9",
      visible: true,
    },
    {
      slug: "outside-skirt",
      name: "투플 안창살",
      cut: "안창살",
      description: "진한 풍미의 한우 안창살, 한정 메뉴입니다.",
      priceText: "86,000원 (한정)",
      servingText: "130g",
      origin: "국내산 한우",
      grade: "1++ No.9",
      visible: true,
    },
  ],
  rooms: [
    {
      slug: "private-room",
      name: "개별룸",
      capacityText: "",
      description: "가족 모임과 비즈니스 식사를 위한 독립된 공간입니다.",
      amenities: [],
      visible: true,
    },
  ],
  faqs: [
    {
      question: "2명부터 29명까지는 어떻게 예약하나요?",
      answer: "가족 모임과 소규모 기업 회식 모두 네이버 예약에서 날짜와 인원을 선택해 예약해 주세요.",
      category: "예약",
    },
    {
      question: "30명 이상 단체는 어떻게 문의하나요?",
      answer: "홈페이지 단체 문의 또는 전화 문의로 상담해 주세요.",
      category: "예약",
    },
  ],
  notices: [],
  testimonials: [],
  seo: {
    "/": {
      title: "하누담 | 수원 영통 1++ No.9 한우 전문점",
      description: "1++ No.9 한우와 제철 상차림, 개별룸 식사를 제공하는 수원 영통 하누담입니다.",
    },
    "/menu": {
      title: "메뉴 | 하누담",
      description: "하누담의 1++ No.9 안심, 등심, 살치살과 점심 메뉴를 확인하세요.",
    },
    "/rooms": {
      title: "개별룸 | 하누담",
      description: "가족 모임과 비즈니스 식사를 위한 하누담 개별룸 안내입니다.",
    },
    "/reservation": {
      title: "예약 안내 | 하누담",
      description: "2–29명 가족 모임·기업 회식 네이버 예약과 30명 이상 단체 문의 방법을 안내합니다.",
    },
    "/location": {
      title: "오시는 길 | 하누담",
      description: "수원 영통 하누담 주소와 방문 정보를 확인하세요.",
    },
  },
});
