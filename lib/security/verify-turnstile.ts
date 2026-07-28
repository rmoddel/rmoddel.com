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
  expectedHostname?: string;
};

const PRODUCTION_HOSTNAMES = new Set(["rmoddel.com", "www.rmoddel.com"]);

function normalizeHostname(hostname?: string) {
  return hostname?.toLowerCase().split(":")[0]?.trim() || "";
}

function getAllowedProductionHostnames(expectedHostname?: string) {
  const configured = (process.env.TURNSTILE_ALLOWED_HOSTNAMES || "")
    .split(",")
    .map(normalizeHostname)
    .filter(Boolean);

  return new Set([
    ...PRODUCTION_HOSTNAMES,
    ...configured,
    normalizeHostname(expectedHostname)
  ].filter(Boolean));
}

export async function verifyTurnstile({
  token,
  ip,
  expectedAction,
  expectedHostname
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
      response: token
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

    const hostname = normalizeHostname(result.hostname);

    if (process.env.NODE_ENV === "production" && !hostname) {
      console.warn("Turnstile response did not include a hostname");
      return false;
    }

    if (
      process.env.NODE_ENV === "production" &&
      !getAllowedProductionHostnames(expectedHostname).has(hostname)
    ) {
      console.warn("Unexpected Turnstile hostname", {
        expectedHostname: normalizeHostname(expectedHostname) || undefined,
        hostname
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error("Turnstile verification error", error);
    return false;
  }
}
