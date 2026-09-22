import { useRef, useState } from "react";
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
          <img
            src={url}
            alt=""
            className="size-9 shrink-0 rounded-lg object-cover ring-1 ring-line"
          />
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
