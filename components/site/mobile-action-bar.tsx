import type { SiteSettings } from "@/lib/site/types";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function MobileActionBar({ settings }: { settings: SiteSettings }) {
  const canReserve = isHttpsUrl(settings.naverReservationUrl);
  const canCall = settings.phone.trim().length > 0;

  if (!canReserve && !canCall) return null;

  return (
    <nav
      aria-label="빠른 문의"
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t bg-background/95 p-3 shadow-[0_-8px_30px_rgba(17,17,17,0.12)] backdrop-blur md:hidden"
    >
      {canReserve ? (
        <a
          href={settings.naverReservationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ size: "customer" }), !canCall && "col-span-2")}
        >
          네이버 예약
        </a>
      ) : null}
      {canCall ? (
        <a
          href={`tel:${settings.phone}`}
          className={cn(
            buttonVariants({ variant: "outline", size: "customer" }),
            !canReserve && "col-span-2",
          )}
        >
          전화 문의
        </a>
      ) : null}
    </nav>
  );
}
