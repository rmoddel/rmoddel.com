"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import {
  TURNSTILE_ACTION,
  TURNSTILE_SITE_KEY
} from "@/lib/security/turnstile-config";

type TurnstileWidgetProps = {
  action?: string;
};

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || TURNSTILE_SITE_KEY;

export function TurnstileScript() {
  return (
    <Script
      src="https://challenges.cloudflare.com/turnstile/v0/api.js"
      strategy="afterInteractive"
    />
  );
}

export function TurnstileWidget({ action = TURNSTILE_ACTION }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    const configuredSiteKey = siteKey ?? "";

    if (!configuredSiteKey) {
      return undefined;
    }

    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    function renderTurnstile() {
      if (cancelled || widgetIdRef.current) {
        return;
      }

      const container = containerRef.current;

      if (!container) {
        return;
      }

      if (container.querySelector("iframe")) {
        return;
      }

      if (!window.turnstile?.render) {
        retryTimer = setTimeout(renderTurnstile, 250);
        return;
      }

      widgetIdRef.current = window.turnstile.render(container, {
        sitekey: configuredSiteKey,
        action,
        appearance: "interaction-only",
        size: "flexible",
        theme: "auto"
      });
    }

    renderTurnstile();

    return () => {
      cancelled = true;

      if (retryTimer) {
        clearTimeout(retryTimer);
      }

      if (widgetIdRef.current) {
        window.turnstile?.remove?.(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [action]);

  if (!siteKey) {
    return (
      <p className="formNotice error">
        Security verification is not configured.
      </p>
    );
  }

  return (
    <div className="turnstileWrap">
      <div
        ref={containerRef}
        className="cf-turnstile"
        data-sitekey={siteKey}
        data-action={action}
        data-appearance="interaction-only"
        data-size="flexible"
        data-theme="auto"
      />
    </div>
  );
}
