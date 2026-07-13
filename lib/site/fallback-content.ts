import type { SiteContent } from "@/lib/site/types";

const phone = process.env.NEXT_PUBLIC_HANUDAM_PHONE ?? "";

export const fallbackContent: SiteContent = Object.freeze({
  settings: {
    name: "하누담",
    description: "수원 영통에서 투플 한우와 개별룸 식사를 제공하는 하누담입니다.",
    roadAddress:
      "경기도 수원시 영통구 청명남로34번길 21 테라스가든 상가 2층 하누담",
    phone,
    businessHours: [],
    parking: "",
    naverReservationUrl: "https://naver.me/FbOhLPXy",
    naverPlaceUrl: "https://naver.me/FbOhLPXy",
    orderInquiryUrl: `tel:${phone}`,
  },
  menu: [
    {
      slug: "tenderloin",
      name: "투플 안심",
      cut: "안심",
      description: "투플 등급 한우 안심을 준비합니다.",
      priceText: "",
      servingText: "",
      origin: "국내산 한우",
      grade: "1++",
      visible: true,
    },
    {
      slug: "sirloin",
      name: "투플 등심",
      cut: "등심",
      description: "투플 등급 한우 등심을 준비합니다.",
      priceText: "",
      servingText: "",
      origin: "국내산 한우",
      grade: "1++",
      visible: true,
    },
    {
      slug: "outside-skirt",
      name: "투플 안창살",
      cut: "안창살",
      description: "투플 등급 한우 안창살을 준비합니다.",
      priceText: "",
      servingText: "",
      origin: "국내산 한우",
      grade: "1++",
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
      answer: "네이버 예약에서 날짜와 인원을 선택해 예약해 주세요.",
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
      title: "하누담 | 수원 영통 투플 한우 전문점",
      description: "투플 한우와 개별룸 식사를 제공하는 수원 영통 하누담입니다.",
    },
    "/menu": {
      title: "메뉴 | 하누담",
      description: "하누담의 투플 안심, 등심, 안창살 메뉴를 확인하세요.",
    },
    "/rooms": {
      title: "개별룸 | 하누담",
      description: "가족 모임과 비즈니스 식사를 위한 하누담 개별룸 안내입니다.",
    },
    "/reservation": {
      title: "예약 안내 | 하누담",
      description: "2–29명 네이버 예약과 30명 이상 단체 문의 방법을 안내합니다.",
    },
    "/location": {
      title: "오시는 길 | 하누담",
      description: "수원 영통 하누담 주소와 방문 정보를 확인하세요.",
    },
  },
});
