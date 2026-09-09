import { useRef, useState } from "react";
import { photoUrl, uploadPhoto, usePhotoUrl } from "@/lib/child-data";

export function PhotoAttach({
  photoPath,
  onUploaded,
  className = "",
}: {
  photoPath: string | null | undefined;
  onUploaded: (path: string) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: url } = usePhotoUrl(photoPath);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setError("That photo is a bit large — try one under 8MB.");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const path = await uploadPhoto(file);
      await photoUrl(path); // warm the signed url before we hand the path off
      onUploaded(path);
    } catch {
      setError("Couldn't upload that photo. Please try again.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
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
            alt="Uploaded"
            className="size-8 shrink-0 rounded-lg object-cover ring-1 ring-line"
          />
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="shrink-0 rounded-full bg-surface/70 px-2.5 py-1 font-mono text-[10px] text-muted-foreground ring-1 ring-line disabled:opacity-60"
        >
          {busy ? "uploading…" : photoPath ? "replace photo" : "+ photo"}
        </button>
      </div>
      {error && <p className="mt-1 text-[10px] text-ochre">{error}</p>}
    </div>
  );
}
