"use client";

import { useEffect, useRef, useCallback } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact" | "invisible";
        },
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

interface TurnstileWidgetProps {
  siteKey: string;
  onToken:   (token: string) => void;
  onExpire?: () => void;
  onError?:  () => void;
  theme?:    "light" | "dark" | "auto";
  compact?:  boolean;
}

export function TurnstileWidget({
  siteKey,
  onToken,
  onExpire,
  onError,
  theme   = "light",
  compact = false,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef  = useRef<string | null>(null);

  const onTokenRef  = useRef(onToken);
  const onExpireRef = useRef(onExpire);
  const onErrorRef  = useRef(onError);
  useEffect(() => { onTokenRef.current  = onToken;  }, [onToken]);
  useEffect(() => { onExpireRef.current = onExpire; }, [onExpire]);
  useEffect(() => { onErrorRef.current  = onError;  }, [onError]);

  const renderWidget = useCallback(() => {
    if (!containerRef.current || !window.turnstile) return;
    if (widgetIdRef.current !== null) {
      try { window.turnstile.remove(widgetIdRef.current); } catch { /* ignore */ }
      widgetIdRef.current = null;
    }
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey:            siteKey,
      callback:           (token) => onTokenRef.current(token),
      "expired-callback": () => onExpireRef.current?.(),
      "error-callback":   () => onErrorRef.current?.(),
      theme,
      size: compact ? "compact" : "normal",
    });
  }, [siteKey, theme, compact]);

  useEffect(() => {
    if (window.turnstile) renderWidget();
  }, [renderWidget]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
        onLoad={renderWidget}
      />
      <div ref={containerRef} />
    </>
  );
}
