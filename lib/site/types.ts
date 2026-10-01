export type SeoFields = {
  title: string;
  description: string;
  imageUrl?: string;
  noIndex?: boolean;
};

export type SiteSettings = {
  name: "하누담";
  description: string;
  roadAddress: string;
  phone: string;
  businessHours: string[];
  parking: string;
  naverReservationUrl: string;
  naverPlaceUrl: string;
  orderInquiryUrl: string;
};

export type MenuItem = {
  slug: string;
  name: string;
  cut: "안심" | "등심" | "살치살" | "안창살" | "기타";
  description: string;
  priceText: string;
  servingText: string;
  origin: string;
  grade: string;
  imageUrl?: string;
  visible: boolean;
};

export type Room = {
  slug: string;
  name: string;
  capacityText: string;
  description: string;
  amenities: string[];
  imageUrl?: string;
  visible: boolean;
};

export type Faq = {
  question: string;
  answer: string;
  category: string;
};

export type Notice = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  publishedAt: string;
  visible: boolean;
};

export type PublicTestimonial = {
  id: string;
  maskedNickname: string;
  quote: string;
  visitPurpose: string;
  visitPeriod: string;
  sourceUrl: string;
  consentConfirmed: true;
  consentConfirmedAt: string;
  consentEvidence: string;
  imageUrl?: string;
  visible: true;
};

export type SiteContent = {
  settings: SiteSettings;
  menu: MenuItem[];
  rooms: Room[];
  faqs: Faq[];
  notices: Notice[];
  testimonials: PublicTestimonial[];
  seo: Record<string, SeoFields>;
};

export interface ContentRepository {
  getSiteContent(): Promise<SiteContent>;
  getNotice(slug: string): Promise<Notice | null>;
}
