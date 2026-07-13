import { describe, expect, it } from "vitest";

import { createFallbackRepository } from "@/lib/site/content";

describe("fallback content repository", () => {
  it("keeps the verified public address and reservation source", async () => {
    const content = await createFallbackRepository().getSiteContent();

    expect(content.settings.roadAddress).toBe(
      "경기도 수원시 영통구 청명남로34번길 21 테라스가든 상가 2층 하누담",
    );
    expect(content.settings.naverReservationUrl).toBe("https://naver.me/FbOhLPXy");
  });

  it("starts without unapproved testimonials", async () => {
    const content = await createFallbackRepository().getSiteContent();

    expect(content.testimonials).toHaveLength(0);
    expect(
      content.testimonials.every((item) => item.consentConfirmed && item.visible),
    ).toBe(true);
  });
});
