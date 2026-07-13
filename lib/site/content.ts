import { fallbackContent } from "@/lib/site/fallback-content";
import type { ContentRepository, Notice, SiteContent } from "@/lib/site/types";

export function createFallbackRepository(): ContentRepository {
  return {
    async getSiteContent(): Promise<SiteContent> {
      return fallbackContent;
    },
    async getNotice(slug: string): Promise<Notice | null> {
      return fallbackContent.notices.find((item) => item.slug === slug) ?? null;
    },
  };
}

let repository: ContentRepository = createFallbackRepository();

export function setContentRepository(next: ContentRepository): void {
  repository = next;
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    return await repository.getSiteContent();
  } catch {
    return fallbackContent;
  }
}

export async function getNotice(slug: string): Promise<Notice | null> {
  try {
    return await repository.getNotice(slug);
  } catch {
    return fallbackContent.notices.find((item) => item.slug === slug) ?? null;
  }
}
