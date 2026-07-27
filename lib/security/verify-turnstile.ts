import { randomUUID } from "crypto";

type TurnstileVerification = {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
  "error-codes"?: string[];
};

type VerifyTurnstileOptions = {
  token: string;
  ip?: string;
  expectedAction: string;
};

const PRODUCTION_HOSTNAMES = new Set(["rmoddel.com", "www.rmoddel.com"]);

export async function verifyTurnstile({
  token,
  ip,
  expectedAction
}: VerifyTurnstileOptions): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY is not configured");
    return false;
  }

  if (!token || token.length > 2_048) {
    return false;
  }

  try {
    const body = new URLSearchParams({
      secret,
      response: token,
      idempotency_key: randomUUID()
    });

    if (ip) {
      body.set("remoteip", ip);
    }

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body,
        cache: "no-store",
        signal: AbortSignal.timeout(8_000)
      }
    );

    if (!response.ok) {
      console.error("Turnstile verification request failed", {
        status: response.status
      });
      return false;
    }

    const result = (await response.json()) as TurnstileVerification;

    if (!result.success) {
      console.warn("Turnstile rejected submission", {
        errors: result["error-codes"] ?? []
      });
      return false;
    }

    if (result.action !== expectedAction) {
      console.warn("Unexpected Turnstile action", {
        expected: expectedAction,
        received: result.action
      });
      return false;
    }

    if (
      process.env.NODE_ENV === "production" &&
      (!result.hostname || !PRODUCTION_HOSTNAMES.has(result.hostname))
    ) {
      console.warn("Unexpected Turnstile hostname", {
        hostname: result.hostname
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error("Turnstile verification error", error);
    return false;
  }
}
