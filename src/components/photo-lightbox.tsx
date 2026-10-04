import type { ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { t } from "@/lib/ui-strings";

/** Wraps a thumbnail; tapping it shows the photo full-screen. */
export function PhotoLightbox({
  url,
  caption,
  children,
  className = "",
}: {
  url: string;
  caption?: string;
  children: ReactNode;
  className?: string;
}) {
  const { lang } = useLanguage();
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label={t("photo.view", lang)}
          className={`focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
        >
          {children}
        </button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/90 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 p-4 pt-[calc(env(safe-area-inset-top,0px)+4rem)] pb-[calc(env(safe-area-inset-bottom,0px)+1rem)] focus:outline-none"
        >
          <DialogPrimitive.Title className="sr-only">
            {caption ?? t("photo.view", lang)}
          </DialogPrimitive.Title>
          <DialogPrimitive.Close asChild>
            {/* Tapping the photo also closes it */}
            <button
              type="button"
              tabIndex={-1}
              className="flex min-h-0 w-full flex-1 items-center justify-center"
            >
              <img
                src={url}
                alt=""
                className="max-h-full max-w-full rounded-xl object-contain shadow-lg"
              />
            </button>
          </DialogPrimitive.Close>
          {caption && <p className="max-w-sm text-center text-[13px] text-white/90">{caption}</p>}
          <DialogPrimitive.Close
            aria-label={t("photo.close", lang)}
            className="absolute right-4 top-[calc(env(safe-area-inset-top,0px)+1rem)] flex size-10 items-center justify-center rounded-full bg-white/90 text-black shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-5" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
