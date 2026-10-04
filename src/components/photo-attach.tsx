import { useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { uploadPhoto, usePhotoUrl } from "@/lib/child-data";
import { useLanguage } from "@/lib/language";
import { t } from "@/lib/ui-strings";

const MAX_BYTES = 8 * 1024 * 1024;

export function PhotoAttach({
  photoPath,
  onUploaded,
  className = "",
}: {
  photoPath: string | null | undefined;
  onUploaded: (path: string) => void;
  className?: string;
}) {
  const { lang } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: url } = usePhotoUrl(photoPath);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    if (file.size > MAX_BYTES) {
      setError(t("photo.tooLarge", lang));
      return;
    }
    setBusy(true);
    try {
      const path = await uploadPhoto(file);
      onUploaded(path);
    } catch {
      setError(t("photo.uploadFailed", lang));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <div className="flex items-center gap-2">
        {url && (
          <DialogPrimitive.Root>
            <DialogPrimitive.Trigger asChild>
              <button
                type="button"
                aria-label={t("photo.view", lang)}
                className="shrink-0 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <img
                  src={url}
                  alt=""
                  className="size-9 rounded-lg object-cover ring-1 ring-line"
                />
              </button>
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal>
              <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/90 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
              <DialogPrimitive.Content
                aria-describedby={undefined}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-[calc(env(safe-area-inset-top,0px)+4rem)] pb-[calc(env(safe-area-inset-bottom,0px)+1rem)] focus:outline-none"
              >
                <DialogPrimitive.Title className="sr-only">
                  {t("photo.view", lang)}
                </DialogPrimitive.Title>
                <DialogPrimitive.Close asChild>
                  {/* Tapping anywhere on the photo area also closes it */}
                  <button type="button" className="flex h-full w-full items-center justify-center" tabIndex={-1}>
                    <img
                      src={url}
                      alt=""
                      className="max-h-full max-w-full rounded-xl object-contain shadow-lg"
                    />
                  </button>
                </DialogPrimitive.Close>
                <DialogPrimitive.Close
                  aria-label={t("photo.close", lang)}
                  className="absolute right-4 top-[calc(env(safe-area-inset-top,0px)+1rem)] flex size-10 items-center justify-center rounded-full bg-white/90 text-black shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="size-5" />
                </DialogPrimitive.Close>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          </DialogPrimitive.Root>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="rounded-full bg-surface/70 px-2.5 py-1 font-mono text-[10px] text-muted-foreground ring-1 ring-line disabled:opacity-60"
        >
          {busy
            ? t("photo.uploading", lang)
            : url
              ? t("photo.replace", lang)
              : t("photo.add", lang)}
        </button>
      </div>
      {error && <p className="mt-1 text-[11px] text-ochre">{error}</p>}
    </div>
  );
}
