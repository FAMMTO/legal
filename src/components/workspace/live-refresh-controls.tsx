"use client";

import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useTransition } from "react";

type LiveRefreshControlsProps = {
  intervalMs?: number;
  pauseAutoRefresh?: boolean;
  disabled?: boolean;
  buttonLabel?: string;
};

export function LiveRefreshControls({
  intervalMs = 10_000,
  pauseAutoRefresh = false,
  disabled = false,
  buttonLabel = "Recargar",
}: LiveRefreshControlsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const triggerRefresh = useEffectEvent(() => {
    if (disabled || isPending) {
      return;
    }

    startTransition(() => {
      router.refresh();
    });
  });

  useEffect(() => {
    if (pauseAutoRefresh) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (document.visibilityState !== "visible") {
        return;
      }

      triggerRefresh();
    }, intervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [intervalMs, pauseAutoRefresh, triggerRefresh]);

  return (
    <button
      className="secondary-button companies-refresh-button"
      type="button"
      disabled={disabled || isPending}
      title="Recarga silenciosa cada 10 segundos"
      onClick={triggerRefresh}
    >
      {buttonLabel}
    </button>
  );
}
