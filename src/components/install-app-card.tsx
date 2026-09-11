import { useEffect, useState } from "react";
import { ArrowRight, Smartphone, X } from "lucide-react";

const DISMISS_KEY = "grade-r-ready:install-dismissed";

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export function InstallAppCard() {
  const [dismissed, setDismissed] = useState(true);
  const [installed, setInstalled] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
    setInstalled(isStandalone());
  }, []);

  if (installed || dismissed) return null;

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-surface/60 p-1.5 shadow-lg shadow-sungold/5 backdrop-blur-xl">
      <div className="relative rounded-[1.4rem] bg-gradient-to-br from-sungold-soft/90 to-sungold/10 p-5">
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 grid size-8 place-items-center rounded-full bg-background/50 text-foreground/70 transition hover:bg-background/70 active:scale-90"
          aria-label="Dismiss"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-4 pr-8">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-sungold/20 text-sungold">
              <Smartphone size={22} strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <p className="font-display text-[17px] font-bold leading-tight tracking-tight">
                Add Grade R Ready to your phone
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                Get quick access to activities and progress from your home screen.
              </p>
            </div>
          </div>

          {!expanded ? (
            <button
              onClick={() => setExpanded(true)}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground py-3.5 text-[15px] font-bold text-background shadow-md shadow-foreground/10 transition hover:bg-foreground/90 hover:shadow-lg active:scale-[0.98]"
            >
              <span>Show me how</span>
              <ArrowRight
                size={18}
                strokeWidth={2.5}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          ) : (
            <div className="space-y-3">
              <p className="rounded-2xl bg-background/60 px-4 py-3 text-[13px] leading-relaxed text-foreground">
                {isIos() ? (
                  <>
                    Tap the <span className="font-semibold">Share</span> button in Safari (the square with an
                    arrow), then scroll down and tap{" "}
                    <span className="font-semibold">"Add to Home Screen"</span>.
                  </>
                ) : (
                  <>
                    Tap the <span className="font-semibold">⋮ menu</span> (top right of Chrome), then tap{" "}
                    <span className="font-semibold">"Add to Home screen"</span>.
                  </>
                )}
              </p>
              <button
                onClick={() => setExpanded(false)}
                className="w-full rounded-2xl bg-background/40 py-2.5 text-[13px] font-semibold text-foreground/80 transition hover:bg-background/60 active:scale-[0.99]"
              >
                Hide instructions
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
