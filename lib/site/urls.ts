export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://my-shop-nu-rouge.vercel.app";

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
