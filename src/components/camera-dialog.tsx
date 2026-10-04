import { useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { t } from "@/lib/ui-strings";

const MAX_SIDE = 1600;

type CameraState = "starting" | "live" | "preview" | "denied" | "unavailable";

/**
 * Full-screen camera that runs inside the app (getUserMedia), so the phone
 * never switches to its own camera app — which on many phones closes the
 * web app in the background and loses the photo.
 */
export function CameraDialog({
  open,
  onOpenChange,
  onPhoto,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPhoto: (file: File) => void;
}) {
  const { lang } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<CameraState>("starting");
  const [shot, setShot] = useState<{ blob: Blob; url: string } | null>(null);

  function stopStream() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  async function startStream() {
    stopStream();
    setState("starting");
    if (!navigator.mediaDevices?.getUserMedia) {
      setState("unavailable");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1440 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setState("live");
    } catch (err) {
      const name = (err as DOMException)?.name;
      setState(name === "NotAllowedError" || name === "SecurityError" ? "denied" : "unavailable");
    }
  }

  function clearShot() {
    if (shot) URL.revokeObjectURL(shot.url);
    setShot(null);
  }

  useEffect(() => {
    if (open) {
      startStream();
    } else {
      stopStream();
      clearShot();
    }
    return stopStream;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function takePhoto() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const scale = Math.min(1, MAX_SIDE / Math.max(video.videoWidth, video.videoHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        stopStream();
        setShot({ blob, url: URL.createObjectURL(blob) });
        setState("preview");
      },
      "image/jpeg",
      0.85,
    );
  }

  function retake() {
    clearShot();
    startStream();
  }

  function usePhoto() {
    if (!shot) return;
    onPhoto(new File([shot.blob], "photo.jpg", { type: "image/jpeg" }));
    onOpenChange(false);
  }

  function handleGalleryFile(file: File | undefined) {
    if (!file) return;
    onPhoto(file);
    onOpenChange(false);
  }

  const message =
    state === "denied"
      ? t("photo.cameraDenied", lang)
      : state === "unavailable"
        ? t("photo.cameraUnavailable", lang)
        : null;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-50 flex flex-col bg-black text-white focus:outline-none"
        >
          <DialogPrimitive.Title className="sr-only">{t("photo.cameraTitle", lang)}</DialogPrimitive.Title>

          <input
            ref={galleryRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              handleGalleryFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />

          {/* Camera / preview area */}
          <div className="relative flex flex-1 items-center justify-center overflow-hidden pt-[env(safe-area-inset-top,0px)]">
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={`h-full w-full object-contain ${state === "live" ? "" : "hidden"}`}
            />
            {state === "preview" && shot && (
              <img src={shot.url} alt="" className="h-full w-full object-contain" />
            )}
            {state === "starting" && (
              <p className="text-sm text-white/80">{t("photo.startingCamera", lang)}</p>
            )}
            {message && <p className="max-w-xs px-6 text-center text-sm leading-relaxed text-white/90">{message}</p>}

            <DialogPrimitive.Close
              aria-label={t("photo.close", lang)}
              className="absolute right-4 top-[calc(env(safe-area-inset-top,0px)+1rem)] flex size-10 items-center justify-center rounded-full bg-white/90 text-black shadow-md focus:outline-none"
            >
              <X className="size-5" />
            </DialogPrimitive.Close>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-4 px-6 pt-5 pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)]">
            {state === "live" && (
              <button
                type="button"
                onClick={takePhoto}
                aria-label={t("photo.capture", lang)}
                className="size-[72px] rounded-full border-4 border-white bg-white/25 active:bg-white/60 focus:outline-none"
              />
            )}
            {state === "preview" && (
              <div className="flex w-full max-w-sm gap-3">
                <button
                  type="button"
                  onClick={retake}
                  className="flex-1 rounded-full bg-white/15 py-3 text-sm font-semibold ring-1 ring-white/40"
                >
                  {t("photo.retake", lang)}
                </button>
                <button
                  type="button"
                  onClick={usePhoto}
                  className="flex-1 rounded-full bg-white py-3 text-sm font-semibold text-black"
                >
                  {t("photo.usePhoto", lang)}
                </button>
              </div>
            )}
            {state !== "preview" && (
              <button
                type="button"
                onClick={() => galleryRef.current?.click()}
                className={
                  message
                    ? "rounded-full bg-white px-5 py-3 text-sm font-semibold text-black"
                    : "text-sm text-white/80 underline underline-offset-4"
                }
              >
                {t("photo.gallery", lang)}
              </button>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
