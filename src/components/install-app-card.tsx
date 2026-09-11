import { useEffect, useState } from "react";

const DISMISS_KEY = "grade-r-ready:install-dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export function InstallAppCard() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [installed, setInstalled] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
    setInstalled(isStandalone());

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    const onInstalled = () => setInstalled(true);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed || dismissed) return null;
  if (!deferredPrompt && !isIos()) return null;

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  async function install() {
    if (!deferredPrompt) {
      setShowIosHelp(true);
      return;
    }
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setDeferredPrompt(null);
  }

  return (
    <div className="rounded-2xl bg-sungold-soft p-4 ring-1 ring-sungold/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-[13px] font-bold">Add Grade R Ready to your phone</p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Get it on your home screen like an app — one tap to open, no browser bar.
          </p>
        </div>
        <button
          onClick={dismiss}
          className="shrink-0 text-[16px] leading-none text-muted-foreground"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>

      {!showIosHelp ? (
        <button
          onClick={install}
          className="mt-3 w-full rounded-xl bg-foreground py-2.5 text-[13px] font-semibold text-background transition active:scale-[0.99]"
        >
          Add to home screen
        </button>
      ) : (
        <p className="mt-3 rounded-xl bg-background/60 px-3 py-2.5 text-[12px] leading-relaxed text-foreground">
          Tap the <span className="font-semibold">Share</span> button in Safari (the square with an
          arrow), then scroll down and tap{" "}
          <span className="font-semibold">"Add to Home Screen"</span>.
        </p>
      )}
    </div>
  );
}
