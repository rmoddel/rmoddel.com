export {};

declare global {
  interface Window {
    turnstile?: {
      render?: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          action?: string;
          appearance?: "always" | "execute" | "interaction-only";
          size?: "normal" | "compact" | "flexible";
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      remove?: (widgetId: string) => void;
      reset: (widgetId?: string) => void;
    };
  }
}
